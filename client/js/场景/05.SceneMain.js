/**
 * 主场景
 */
function SceneMain() {
    SceneBase.call(this);
    this.lMain = null;      // 主流程逻辑
    this.lHandler = null;   // 输入处理逻辑

    this.wLog = null;       // 信息窗体
    this.wCommand = null;   // 指令窗体
    this.wPlayer = null;    // 玩家窗体
    this.wReation = null;   // 响应窗体

    // 视图
    this.vPlayer = null;
    this.vCommand = null;
    this.vLog = null;
    this.vReation = null;
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
    this.updateWindow();
    // 用户窗体事件
    if(this.vPlayer.active) {
        // todo:
    }
    // 指令窗体事件
    if(this.vCommand.active) {
        // todo:
    }
    // 响应窗体事件
    if(this.vReation.active) {
        // todo:
    }
};


// 逻辑初始化
SceneRoom.prototype.initLogic = function() {
    // todo:
};

// 精灵初始化
SceneRoom.prototype.initSprite = function() {
    // todo:
};    

// 窗体初始化
SceneRoom.prototype.initWindow = function() {
    // todo:
};   

// 窗体刷新
SceneRoom.prototype.updateWindow = function() {
    // todo:
};

// 网络处理
SceneRoom.prototype.netHandler = function(router, data) {
    // todo:
};

// ------------------------------