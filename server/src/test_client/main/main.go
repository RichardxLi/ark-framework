package main

import (
	"ark-server/src/test_client/public"
	"ark-server/src/test_client/scene"
	"os"
)

type HostData struct {
	foo int
	bar string
}

func main() {
	public.IGameData = &public.GameData{}
	public.ISocketClient = &public.SocketClient{}
	public.IScene = scene.NewSceneBase()

	public.Graphics()
	public.Input()

	select {
	case <-public.Exit:
		os.Exit(0)
	}
}
