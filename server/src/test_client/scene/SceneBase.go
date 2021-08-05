package scene

import (
	"ark-server/src/test_client/logic"
	"ark-server/src/test_client/public"
	"ark-server/src/test_client/sprite"
	"strings"
)

func NewSceneBase() *sceneBase {
	scene := &sceneBase{}
	scene.Logic = logic.LBase{}
	scene.loginSprite = sprite.NewSprite("loginS", public.IGameData, true)
	scene.mainSprite = sprite.NewSprite("mainS", public.IGameData, false)
	public.IGameData.Bar = "输入uuid"
	public.IGameData.Foo = -1
	return scene
}

type sceneBase struct {
	loginSprite public.Sprite
	mainSprite  public.Sprite
	Logic       public.Logic
}

func (s sceneBase) Title() {}

func (s sceneBase) Update() {
	if public.IGameData.Foo == -1 && strings.TrimSpace(public.IInput) != "" {
		public.IGameData.Bar = strings.TrimSpace(public.IInput)
		s.Logic.(logic.LBase).UUid()
		public.IInput = ""
	}
	if public.IGameData.Foo == 0 && public.IInput == "_create" {
		s.Logic.(logic.LBase).CreateRoom()
		public.IInput = ""
	}
	if public.IGameData.Foo == 0 && public.IInput == "_join" {
		s.Logic.(logic.LBase).JoinRoom1()
		public.IInput = ""
	}
	if public.IGameData.Foo == 1 && public.IInput != "" {
		public.IGameData.Bar = public.IInput
		s.Logic.(logic.LBase).JoinRoom2()
		public.IInput = ""
	}
	if public.IGameData.Foo == 2 && !s.mainSprite.Visible() {
		s.mainSprite.SetVisible(true)
	}
	return
}
