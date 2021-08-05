/** 
 * 精灵-昵称输入框
 * @param viewport  所属视窗
 * @param user      用户数据
 */
function SpriteNameInput(viewport, user) {
    var bitmap = new IBitmap.CBitmap(400, 120)
    ISprite.call(this, bitmap, viewport);
    var _user = user;
    var _contentColor = null; // <IColor>
    var _rect1 = null; // <IRect>
    var _rect2 = null; // <IRect>


    this.update = function() {
        this.clearBitmap();
        this.drawRect(boardRect(), IColor.Black());
        this.drawRect(contentRect(), contentColor());
        this.drawTextQ(_user.name,15,25,IColor.Blue(),60);
    };

    var contentColor = function() {
        if(_contentColor==null) _contentColor = new IColor(225,225,225,225);
        return _contentColor
    };

    var boardRect = function() {
        if(_rect1==null) _rect1 = new IRect(0,0,400,120);
        return _rect1;
    };

    var contentRect = function() {
        if(_rect2==null) _rect2 = new IRect(10,10, 390,110);
        return _rect2;
    };
};
