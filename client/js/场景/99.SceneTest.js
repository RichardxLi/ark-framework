/** 
 * 调试用
 */
function SceneTest() {
    SceneBase.call(this)
    this.sprite = null;
    this.obj = null;
    this.socket = null;
};

SceneTest.prototype = new SceneBase(); 
SceneTest.prototype.constructor = SceneTest;
//================================
// 初始化
SceneTest.prototype.init = function() {
    SceneBase.prototype.init.call(this);
    this.sprite = new ISprite(150,30,IColor.Red());
    this.sprite.drawTextQ("Hello World",10,10,IColor.Blue(),18);
    this.sprite.z = 1001;

    return true;
};


// 帧更新
SceneTest.prototype.update = function() {
    SceneBase.prototype.update.call(this);
    if(this.sprite.isSelected() && IInput.up){
        IInput.up = false;
        gameInput("输入昵称", "昵称", "", function(text){
            var obj = {player:1, name:text}
            var str = JSON.stringify(obj)
            var str2 = str.replace(/\"/gm, "\\\"")
            ISocketClient.sendGroup("SceneTest.Hello", str2);
        });
    }    
};
