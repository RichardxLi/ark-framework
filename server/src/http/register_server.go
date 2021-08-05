package http

import (
	"encoding/json"
	"fmt"
	"io"
	"nano-server/src/tcp"
	"net/http"
	"strings"
	"sync"
	"time"

	uuidGen "github.com/go-basic/uuid"
)

const MaxGroup = 10    // 最大承载数量
const PortStart = 3250 // TCP端口起始分配值

var GroupList [MaxGroup]*groupSlot // 群组列表
var GLock sync.RWMutex             // 群组读写锁

func init() {
	for i := 0; i < MaxGroup; i++ {
		GroupList[i] = &groupSlot{
			Port: PortStart + i,
			Busy: false,
		}
	}
	checkHeartbeat()
}

type groupSlot struct {
	GUid     string    `json:"guid"` // 组识别号 全局唯一
	Name     string    `json:"name"` // 名称
	Port     int       `json:"port"` // TCP服务器端口
	HostUUid string    `json:"-"`    // 主机UUID
	LastHb   time.Time `json:"-"`    // 上一次心跳
	Busy     bool      `json:"-"`    // 使用中
	Running  bool      `json:"-"`
}

// 获取一个闲置群组
func idleGroup() *groupSlot {
	for _, v := range GroupList {
		if !v.Busy {
			return v
		}
	}
	return nil
}

// 通过GUID查找关联群组
func getByGUid(guid string) *groupSlot {
	for _, v := range GroupList {
		if v.Busy && v.GUid == guid {
			return v
		}
	}
	return nil
}

//注册服务器
type registerServer struct {
	mux *http.ServeMux
}

//NewRegisterServer 返回一个注册服务器
func NewRegisterServer() *registerServer {
	return &registerServer{}
}

//Start 启动服务
func (s *registerServer) Start(port int) {
	s.mux = http.NewServeMux()
	s.router()
	go func() {
		err := http.ListenAndServe(fmt.Sprintf(":%d", port), s.mux)
		if err != nil {
			fmt.Printf("%v", err)
		}
	}()
}

//url路由
func (s *registerServer) router() {
	s.mux.HandleFunc("/hello", helloHandler)
	s.mux.HandleFunc("/group/create", createHandler)
	s.mux.HandleFunc("/group/join", joinHandler)
	s.mux.HandleFunc("/group/free", freeHandler)
	s.mux.HandleFunc("/group/list", listHandler)
	s.mux.HandleFunc("/group/heartbeat", heartbeatHandler)
}

//helloHandler
//返回HelloWorld
//@request name 姓名
//@response "Hello world"
func helloHandler(w http.ResponseWriter, req *http.Request) {
	str := fmt.Sprintf("Hello world,%s!", req.FormValue("name"))
	io.WriteString(w, str)
}

//createHandler
//创建群组
//@request uuid 用户识别号
//@request name 游戏名
func createHandler(w http.ResponseWriter, req *http.Request) {
	// 回包
	type response struct {
		Code int    `json:"code"` // 100-成功
		GUid string `json:"guid"` // 群组id
		Port int    `json:"port"` // tcp端口
	}
	var rsp = &response{Code: 100}

	// 入参
	uuid := strings.TrimSpace(req.FormValue("uuid"))
	if uuid == "" {
		rsp.Code = 901 // 参数异常
		sendRsp(w, rsp)
		return
	}
	name := strings.TrimSpace(req.FormValue("name"))
	if name == "" {
		name = uuid
	}

	// 获取信息，分配端口
	GLock.Lock()
	g := idleGroup()
	if g == nil {
		rsp.Code = 201 // 201-已达上限
		sendRsp(w, rsp)
		return
	}

	// 生成 GUID
	guid := uuidGen.New()
	if len(guid) >= 8 {
		guid = guid[0:8]
	}

	// 分配
	g.GUid = guid
	g.Name = name
	g.HostUUid = uuid
	g.LastHb = time.Now()
	g.Busy = true
	GLock.Unlock()
	tcp.StartChan <- g.Port // 启动TCP服务
	fmt.Printf("新群组建立 GUID:%s\n", guid)

	rsp.GUid = guid
	rsp.Port = g.Port
	sendRsp(w, rsp)
}

//joinHandler
//加入群组
//@request guid 群组id
func joinHandler(w http.ResponseWriter, req *http.Request) {
	// 回包
	type response struct {
		Code     int    `json:"code"` // 100-成功
		HostUUid string `json:"host"` // 主机uuid
		Port     int    `json:"port"` // tcp端口
	}
	var rsp = &response{Code: 100}

	// 入参
	guid := strings.TrimSpace(req.FormValue("guid"))
	if guid == "" {
		rsp.Code = 901 // 参数异常
		sendRsp(w, rsp)
		return
	}

	// 群组信息
	GLock.RLock()
	g := getByGUid(guid)
	if g == nil {
		rsp.Code = 201 // 群组不存在
	} else {
		rsp.HostUUid = g.HostUUid
		rsp.Port = g.Port
	}
	GLock.RUnlock()
	sendRsp(w, rsp)
}

//freeHandler
//释放群组
//@request guid 群组id
func freeHandler(w http.ResponseWriter, req *http.Request) {
	// 入参
	guid := strings.TrimSpace(req.FormValue("guid"))
	if guid == "" {
		return
	}

	GLock.Lock()
	g := getByGUid(guid)
	if g == nil {
		GLock.Unlock()
		return
	}
	g.Busy = false
	GLock.Unlock()
	tcp.CloseChan <- g.Port
}

//listHandler
//获取群组列表
func listHandler(w http.ResponseWriter, req *http.Request) {
	// 回包
	type response struct {
		Code int         `json:"code"` // 100-成功
		List []groupSlot `json:"list"`
	}
	var rsp = &response{Code: 100, List: []groupSlot{}}

	GLock.RLock()
	for _, v := range GroupList {
		if !v.Busy {
			continue
		}
		g := groupSlot{
			GUid: v.GUid,
			Name: v.Name,
			Port: v.Port,
		}
		rsp.List = append(rsp.List, g)
	}
	GLock.RUnlock()
	sendRsp(w, rsp)
}

//heartbeatHandler
//群组心跳 仅主机请求
//@request guid 用户识别号
func heartbeatHandler(w http.ResponseWriter, req *http.Request) {
	// 回包
	type response struct {
		Code int `json:"code"` // 100-成功
	}
	var rsp = &response{Code: 100}

	// 入参
	guid := strings.TrimSpace(req.FormValue("guid"))
	if guid == "" {
		rsp.Code = 901 // 参数异常
		sendRsp(w, rsp)
		return
	}

	GLock.Lock()
	g := getByGUid(guid)
	if g != nil {
		g.LastHb = time.Now()
	}
	GLock.Unlock()
	sendRsp(w, rsp)
}

//回包
func sendRsp(w http.ResponseWriter, rsp interface{}) {
	str, err := json.Marshal(rsp)
	if err != nil {
		return
	}
	_, err = io.WriteString(w, string(str))
	return
}

//心跳检测
//一分钟主机无心跳 自动摘除
func checkHeartbeat() {
	go func() {
		timer := time.NewTicker(time.Minute)

		for {
			select {
			case <-timer.C:
				now := time.Now()
				var closePorts []int
				GLock.Lock()
				for _, v := range GroupList {
					if v.Busy && now.Sub(v.LastHb) >= time.Minute {
						v.Busy = false
						closePorts = append(closePorts, v.Port)
						fmt.Printf("组群超时删除 GUID:%s\n", v.GUid)
					}
				}
				GLock.Unlock()

				for _, v := range closePorts {
					tcp.CloseChan <- v
				}
			}
		}
	}()
}
