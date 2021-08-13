/** 
 * 调试用
 */
function SceneTest() {
    SceneBase.call(this)
    this.s1 = null;
    this.s2 = null;
    this.s3 = null;
};

SceneTest.prototype = new SceneBase(); 
SceneTest.prototype.constructor = SceneTest;
//================================
// 初始化
SceneTest.prototype.init = function() {
    SceneBase.prototype.init.call(this);
    this.s1 = new ISprite(RF.DefaultBitmap);
    this.s2 = new ISprite(RF.DefaultBitmap);
    return true;
};


// 帧更新
SceneTest.prototype.update = function() {
    if(IInput.isKeyUp(RC.Key.down)) {
        s1.dispose();
        this.s3 = new ISprite(RF.DefaultBitmap);
    }
};
