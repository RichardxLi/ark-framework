package public

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"strings"
	"time"
)

const SERVERIP = "139.196.187.232"
const HTTPPORT = 8080

var Exit chan int
var GSprites []Sprite
var IScene Scene
var IInput string
var IGameData *GameData
var ISocketClient *SocketClient

func init() {
	Exit = make(chan int)
	GSprites = make([]Sprite, 0)
}

type GameData struct {
	Foo    int
	Bar    string
	IsHost bool
}

type Sprite interface {
	Name() string
	Visible() bool
	SetVisible(bool)
	Update()
}

type Scene interface {
	Title()
	Update()
}

func Graphics() {
	go func() {
		// 每5秒刷新一次 模拟刷帧
		for {
			timer1 := time.NewTicker(5 * time.Second)
			select {
			case <-timer1.C:
				if IScene != nil {
					IScene.Update()
				}
				for _, v := range GSprites {
					if !v.Visible() {
						continue
					}
					v.Update()
				}
			}
		}
	}()
}

func Input() {
	go func() {
		inputReader := bufio.NewReader(os.Stdin)
		for {
			input, err := inputReader.ReadString('\n')
			if err != nil {
				fmt.Printf("read from console failed, err: %v\n", err)
				break
			}
			trimmedInput := strings.TrimSpace(input)
			if trimmedInput == "__exit" {
				Exit <- 1
				break
			}
			IInput = trimmedInput
		}
	}()
}

type Logic interface{}

type SocketClient struct {
	socket     net.Conn
	UUid       string
	GUid       string
	IsHost     bool
	StopHttpHB bool
}

func (s SocketClient) dialTcp(ip string, port int) (err error) {
	s.socket, err = net.Dial("tcp", fmt.Sprintf("%s:%d", ip, port))
	if err != nil {
		return
	}
	return
}

func (s SocketClient) CreateGroup() {
	name := "new%20game"
	url := fmt.Sprintf("http://%s:%d/group/create?name=%s&uuid=%s", SERVERIP, HTTPPORT, name, s.UUid)

	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("%v", err)
		Exit <- 1
		return
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	var data = struct {
		Code int    `json:"code"`
		GUid string `json:"guid"`
		Port int    `json:"port"`
	}{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		fmt.Printf("%v", err)
		Exit <- 1
		return
	}

	if data.Code == 100 {
		IGameData.IsHost = true
		s.GUid = data.GUid
		s.IsHost = true
		err = s.dialTcp(SERVERIP, data.Port)
		if err != nil {
			fmt.Printf("%v", err)
			Exit <- 1
			return
		}
		s.StopHttpHB = false
		go s.doHeartbeat()
	} else {
		fmt.Printf("code=%d", data.Code)
		Exit <- 1
		return
	}
}

func (s SocketClient) JoinGroup(guid string) {
	url := fmt.Sprintf("http://%s:%d/group/join?guid=%s", SERVERIP, HTTPPORT, guid)
	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("%v", err)
		Exit <- 1
		return
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	var data = struct {
		Code int    `json:"code"`
		Host string `json:"host"`
		Port int    `json:"port"`
	}{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		fmt.Printf("%v", err)
		Exit <- 1
		return
	}

	if data.Code == 100 {
		s.GUid = guid
		if data.Host == s.UUid {
			IGameData.IsHost = true
			s.IsHost = true
			s.StopHttpHB = false
			go s.doHeartbeat()
		}
		err = s.dialTcp(SERVERIP, data.Port)
		if err != nil {
			fmt.Printf("%v", err)
			Exit <- 1
			return
		}
	} else {
		fmt.Printf("code=%d", data.Code)
		Exit <- 1
		return
	}
}

func (s SocketClient) doHeartbeat() {
	for {
		timer1 := time.NewTicker(15 * time.Second)
		select {
		case <-timer1.C:
			if s.StopHttpHB {
				break
			}
			url := fmt.Sprintf("http://%s:%d/group/heartbeat?guid=%s", SERVERIP, HTTPPORT, s.GUid)
			resp, err := http.Get(url)
			if err != nil {
				fmt.Printf("%v", err)
				Exit <- 1
				return
			}
			resp.Body.Close()
		}
	}
}
