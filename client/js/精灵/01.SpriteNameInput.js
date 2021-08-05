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


    this.update = function() {
        this.clearBitmap();
        this.drawRect(new IRect(0,0,400,120), IColor.Black());
        this.drawRect(new IRect(10,10, 390,110), contentColor());
        this.drawTextQ(_user.name,15,25,IColor.Blue(),60);
    };

    var contentColor = function() {
        if(_contentColor==null) _contentColor = new IColor(225,225,225,225);
        return _contentColor
    };
};
