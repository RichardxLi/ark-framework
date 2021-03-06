/** 
 * 精灵-按钮
 * @param viewport  所属视窗
 * @param txt       文本
 */
function SpriteButton(viewport, txt) {
    var _bmp1 = RF.LoadCache("../System/button-menu_0.png");
    var _bmp2 = RF.LoadCache("../System/button-menu_1.png");
    IButton.call(this, _bmp1, _bmp2, " ", viewport, false);
    var _title = txt;

    // 刷新
    this.frameUpdate = function() {
        this.drawTitleQ(_title, IColor.Black(), 32);
    };

    // 设置文本
    this.setTitle = function(txt) {
        _title = txt;
    };

    // 焦点处理
    this.doFocus = function() {
        this.setBitmap(_bmp2, _bmp1);
    };

    // 失去焦点处理
    this.doUnfocus = function() {
        this.setBitmap(_bmp1, _bmp2);
    };
};
