package main

import (
	"fmt"
	"nano-server/src/http"
	"nano-server/src/tcp"
)

func main() {
	registerServer := http.NewRegisterServer()
	registerServer.Start(8080)
	fmt.Printf("注册服务器启动[%d]\n", 8080)

	go func() {
		for {
			select {
			case port := <-tcp.StartChan:
				tcp.RunEchoServer(port)
				fmt.Printf("广播服务器启动[%d]\n", port)
			}
		}
	}()

	go func() {
		for {
			select {
			case port := <-tcp.CloseChan:
				tcp.CloseEchoServer(port)
				fmt.Printf("广播服务器关闭[%d]\n", port)
			}
		}
	}()

	//循环
	select {}
}
