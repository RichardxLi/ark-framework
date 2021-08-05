package logic

import "ark-server/src/test_client/public"

type LBase struct{}

func (l LBase) UUid() {
	public.ISocketClient.UUid = public.IGameData.Bar
	public.IGameData.Foo = 0
}

func (l LBase) CreateRoom() {
	public.ISocketClient.CreateGroup()
	public.IGameData.Foo = 2
}

func (l LBase) JoinRoom1() {
	public.IGameData.Bar = "请输入GUID"
	public.IGameData.Foo = 1
}

func (l LBase) JoinRoom2() {
	public.ISocketClient.JoinGroup(public.IGameData.Bar)
	public.IGameData.Foo = 2
}
