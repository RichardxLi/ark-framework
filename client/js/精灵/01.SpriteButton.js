/** 
 * 精灵-按钮
 * @param viewport  所属视窗
 * @param txt       文本
 */
class SpriteButton extends IButton {
    constructor(viewport, txt) {
        let bmp1 = RF.LoadCache("../System/button-menu_0.png");
        let bmp2 = RF.LoadCache("../System/button-menu_1.png");
        super(bmp1, bmp2, " ", viewport, false);
        this._bmp1 = bmp1;
        this._bmp2 = bmp2;
        this.title = txt;
    }

    update() {
        super.update();
        this.updateBasic();
    }

    updateBasic() {
        this.drawTitleQ(this.title, IColor.Black(), 32);
    }

    doFocus() {
        this.setBitmap(this._bmp2, this._bmp1);
    }

    cancelFocus() {
        this.setBitmap(this._bmp1, this._bmp2);
    }

    dispose() {
        super.disposeMin();
    }
}
