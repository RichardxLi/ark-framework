/** 
 * 精灵对象-样例
 * @param viewport  所属视窗
 * @param object    游戏数据
 */
function SpriteObject(viewport, object) {
    ISprite.call(this, RF.DefaultBitmap(), viewport);
    var _object = object; // <GameObject>
    var _isLoad = false;

    // 精灵绑定数据
    if(_object != null) {
        var bitmap = RF.LoadCache(_object.picture);
        this.setBitmap(bitmap);
    }
};
