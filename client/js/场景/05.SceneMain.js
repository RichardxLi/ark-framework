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

    this.s = null;
};
SceneMain.prototype = new SceneBase(); 
SceneMain.prototype.constructor = SceneMain;
// ===========================
// 初始化
SceneMain.prototype.init = function() {
    SceneBase.prototype.init.call(this);
    if(IVal.DEBUG) {
        this.__debugInit();
    }
    this.initLogic();
    this.initSprite();
    this.initWindow();

    return true;
};

// 帧刷新
SceneMain.prototype.update = function() {
    SceneBase.prototype.update.call(this);
    this.updateWindow();
    // // 用户窗体事件
    if(this.wPlayer.active) {
        // todo:
    }
    // 指令窗体事件
    if(this.wCommand.active) {
        // todo:
    }
    // 响应窗体事件
    if(this.wReation.active) {
        // todo:
    }
};


// 逻辑初始化
SceneMain.prototype.initLogic = function() {
    // todo:
};

// 精灵初始化
SceneMain.prototype.initSprite = function() {
    this.background.drawRect(
        new IRect(0, 0, this.background.width, this.background.height),
        new IColor(160, 160, 160)
    );
};

// 窗体初始化
SceneMain.prototype.initWindow = function() {
    this.wLog = new WindowLog(0,0);
    this.wLog.init();
    this.wCommand = new WindowCommand(0, 280);
    this.wCommand.init();
    this.wPlayer = new WindowPlayer(480, 270);
    this.wPlayer.init();
    this.wReation = new WindowReaction(430, 370);
    this.wReation.init();
    this.wReation.z = 2000;
};   

// 窗体刷新
SceneMain.prototype.updateWindow = function() {
    this.wLog.update();
    this.wCommand.update();
    this.wPlayer.update();
    this.wReation.update();
};

// 网络消息
SceneMain.prototype.netHandler = function(router, data) {
    // todo:
};

// ===========================
// 测试用
SceneMain.prototype.__debugInit = function() {
    RV.GameData.Cards.init();
    RV.GameData.Core.currentPlayer = 3;
    RV.GameData.Temp.mainLog = "游戏开始";
    RV.GameData.Temp.myIndex = 1;
    //RV.GameData.User.name = "响";
    //RV.GameData.User.isHost = true;
    RV.GameData.Room.players = [
        new GameRoomPlayer(1, "响"),
        new GameRoomPlayer(2, "京豪"),
        new GameRoomPlayer(3, "姨妈"),
        new GameRoomPlayer(4, "青"),
    ];
    RV.GameData.Players.init();
    var lx = RV.GameData.Players.get(1);
    lx.gold = 9;
    lx.setHand(0, 1);
    lx.setHand(1, 9);
    lx.hand(0).faceUp = true;
    lx.hand(0).hint = true;
    lx.hand(1).faceUp = true;
    lx.hand(1).die = true;

    var jh = RV.GameData.Players.get(2);
    jh.gold = 7;
    jh.challenge = true;
    jh.setHand(0, 2);
    jh.setHand(1, 6);

    var ym = RV.GameData.Players.get(3);
    ym.gold = 1;
    ym.setHand(0, 4);
    ym.setHand(1, 13);
    ym.hand(0).die = true;

    var lq = RV.GameData.Players.get(4);
    lq.gold = 5;
    lq.setHand(0, 10);
    lq.setHand(1, 3);
    lq.hand(0).hint = true;
};
