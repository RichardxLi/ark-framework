package tcp

import (
	"bufio"
	"fmt"
	"net"
	"sync"
)

var StartChan chan int            // 服务启动用
var CloseChan chan int            // 服务关闭用
var ServerPool map[int]EchoServer // 服务池
var GLock sync.Mutex              // 服务池读写锁

func init() {
	StartChan = make(chan int, 10)
	CloseChan = make(chan int, 10)
	ServerPool = make(map[int]EchoServer)
}

type EchoServer interface {
	Start(port int) error
	Close()
	Count() int
}

//广播服务器
type multiEchoServer struct {
	lis *net.TCPListener
	//当前客户端ID
	curClientId int
	//所有客户端
	clients map[int]*client
	//广播消息
	broadcastMsg chan []byte
}

//客户端
type client struct {
	//ID
	id int
	//连接
	conn net.Conn
	//接收消息
	recvMsg chan []byte
	//发送消息
	sendMsg chan []byte
	//接收消息是否关闭
	isRecvMsgClose chan bool
	//发送消息是否关闭
	isSendMsgClose chan bool
	//服务器
	mes *multiEchoServer
}

//RunEchoServer
//启动服务
func RunEchoServer(port int) {
	GLock.Lock()
	defer GLock.Unlock()
	ServerPool[port] = newEchoServer()
	ServerPool[port].Start(port)
}

//CloseEchoServer
//关闭服务
func CloseEchoServer(port int) {
	GLock.Lock()
	defer GLock.Unlock()
	ServerPool[port].Close()
	delete(ServerPool, port)
}

//newEchoServer 返回一个广播服务器
func newEchoServer() *multiEchoServer {
	return &multiEchoServer{
		curClientId:  0,
		clients:      make(map[int]*client),
		broadcastMsg: make(chan []byte, 1),
	}
}

//Start 启动服务器
func (m *multiEchoServer) Start(port int) error {
	//获取tcp地址
	addr, err := net.ResolveTCPAddr("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return err
	}
	//监听端口
	m.lis, err = net.ListenTCP("tcp", addr)
	if err != nil {
		return err
	}
	//启一个goroutine处理广播
	go m.BroadcastLoop()
	//启一个goroutine处理客户端来的连接
	go func() {
		for {
			conn, err := m.lis.Accept()
			if err != nil {
				continue
			}
			cli := &client{
				id:             m.curClientId,
				conn:           conn,
				recvMsg:        make(chan []byte, 1),
				sendMsg:        make(chan []byte, 1),
				isRecvMsgClose: make(chan bool, 1),
				isSendMsgClose: make(chan bool, 1),
				mes:            m,
			}
			fmt.Printf("新增一个链接：ID：%+v\n", cli.id)
			//加客户端加入到服务器clients中
			tmpCli := m.clients
			tmpCli[m.curClientId] = cli
			m.clients = tmpCli
			m.curClientId++

			//启两个goroutine分别处理客户端的接收与发送消息
			go cli.RecvLoop()
			go cli.SendLoop()
		}
	}()
	return nil
}

//Close 停止服务器
func (m *multiEchoServer) Close() {
	m.lis.Close()
	//循环关闭客户端
	for _, client := range m.clients {
		client.conn.Close()
		//这里只需给一个发送消息就好了
		client.isRecvMsgClose <- true
	}
}

//Count 返回当前客户端连接数
func (m *multiEchoServer) Count() int {
	return len(m.clients)
}

//BroadcastLoop 处理广播
func (m *multiEchoServer) BroadcastLoop() {
	for {
		select {
		case data := <-m.broadcastMsg:
			{
				//遍历所有客户端，循环发送消息
				for _, client := range m.clients {
					client.sendMsg <- data
				}
				break
			}
		}
	}
}

//DelClient 删除客户端
func (m *multiEchoServer) DelClient(c *client) error {
	c.conn.Close()
	tmpCli := m.clients
	delete(tmpCli, c.id)
	m.clients = tmpCli
	return nil
}

//RecvLoop 处理客户端接收消息
func (c *client) RecvLoop() {
	defer func() {
		fmt.Println(c.conn.RemoteAddr().String() + " RecvLoop exit")
	}()
	for {
		read := bufio.NewReader(c.conn)
		data := make([]byte, 8*1024)
		n, err := read.Read(data)
		if err != nil {
			c.isSendMsgClose <- true
			return
		}

		select {
		//接收消息是否关闭
		case <-c.isRecvMsgClose:
			{
				c.isSendMsgClose <- true
				return
			}
		//广播消息
		case c.mes.broadcastMsg <- data[0:n]:
			{
				break
			}
		}
	}
}

//SendLoop 处理客户端发送消息
func (c *client) SendLoop() {
	defer func() {
		fmt.Println(c.conn.RemoteAddr().String() + " SendLoop exit")
	}()
	for {
		select {
		//发送消息关闭，则把客户端从服务中删除
		case <-c.isSendMsgClose:
			{
				c.mes.DelClient(c)
				return
			}
		//向客户写入要发送的消息
		case data := <-c.sendMsg:
			{
				_, err := c.conn.Write(data)
				if err != nil {
					return
				}
			}
		}
	}
}
