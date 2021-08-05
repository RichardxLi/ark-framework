package sprite

import (
	"ark-server/src/test_client/public"
	"fmt"
)

type spriteImp struct {
	name    string
	data    *public.GameData
	visible bool
}

func (s spriteImp) Name() string {
	return s.name
}

func (s spriteImp) Visible() bool {
	return s.visible
}

func (s *spriteImp) SetVisible(visible bool) {
	s.visible = visible
}

func (s spriteImp) Update() {
	fmt.Printf("[%s] foo=%d bar=%s\n", s.name, s.data.Foo, s.data.Bar)
}

func NewSprite(name string, d *public.GameData, visible bool) *spriteImp {
	s := &spriteImp{name, d, visible}
	public.GSprites = append(public.GSprites, s)
	return s
}
