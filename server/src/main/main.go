package main

import (
	"ark-server/src/http"
	"ark-server/src/tcp"
	"fmt"
)

func main() {
	registerServer := http.NewRegisterServer()
	registerServer.Start(8080)
	fmt.Printf("注册服务器启动[%d]\n", 8080)

	//循环
	for{
		select {
			case port := <-tcp.StartChan:
				tcp.RunEchoServer(port)
				fmt.Printf("广播服务器启动[%d]\n", port)
			case port := <-tcp.CloseChan:
				tcp.CloseEchoServer(port)
				fmt.Printf("广播服务器关闭[%d]\n", port)
		}
	}

}
