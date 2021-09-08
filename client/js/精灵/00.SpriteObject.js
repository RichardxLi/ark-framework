/** 
 * 精灵对象-样例
 * @param viewport  所属视窗
 * @param object    游戏数据
 */
class SpriteObject extends ISprite {
    constructor(viewport, object) {
        super(RF.DefaultBitmap(), viewport);
        this._obj = object;
        // 精灵绑定数据
        if(this._obj != null) {
            let bitmap = RF.LoadCache(this._obj.picture);
            this.setBitmap(bitmap);
        }
    }

    updateBase() {
        if(this._obj.moveX != 0) {
            this.move(this.x+this._obj.moveX, this.y, this._obj.aniFrame)
            this._obj.moveX = 0;
        }
        if(this._obj.moveBaF) {
            this.moveBackAndForth(this._obj.aniFrame);
        }
    }

    move(x, y, frame) {
        if(!this.isAnim()) {
            this.slideTo(x, y, frame);
        }
    }

    moveBackAndForth(frame) {
        if(!this.isAnim()) {
            this.endAction();
            this.addAction(action.move, this.x+100, this.y, frame);
            this.addAction(action.wait, frame);
            this.addAction(action.move, this.x, this.y, frame);
        }
    }
}
