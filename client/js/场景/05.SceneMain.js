/**
 * 主场景
 */
function SceneMain() {
    SceneBase.call(this);
    this.lMain = null;      // 主流程逻辑
    this.lHandler = null;   // 网络输入处理逻辑
};

SceneMain.prototype = new SceneBase(); 
SceneMain.prototype.constructor = SceneMain;

// 初始化
SceneMain.prototype.init = function() {
    SceneBase.prototype.init.call(this);
    this.initLogic();
    this.initSprite();
    this.initWindow();
    return true;
};

// 帧刷新
SceneRoom.prototype.update = function() {
    SceneBase.prototype.update.call(this);
    // todo:
};

SceneRoom.prototype.initLogic = function() {

};


// 精灵初始化
SceneRoom.prototype.initSprite = function() {
    // todo:
};    

// 窗体初始化
SceneRoom.prototype.initWindow = function() {
    // todo:
};   

