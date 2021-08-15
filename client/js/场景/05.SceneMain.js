/**
 * 主场景
 */
function SceneMain() {
    SceneBase.call(this);
    this.lMain = null;      // 主流程处理 仅host
    this.lHandler = null;   // 输入处理

    this.wLog = null;       // 信息窗体
    this.wCommand = null;   // 指令窗体
    this.wPlayer = null;    // 玩家窗体
    this.wReation = null;   // 响应窗体
};
SceneMain.prototype = new SceneBase(); 
SceneMain.prototype.constructor = SceneMain;
// ===========================
// 初始化
SceneMain.prototype.init = function() {
    SceneBase.prototype.init.call(this);
    this.initLogic();
    this.initSprite();
    this.initWindow();
    return true;
};

// 帧刷新
SceneMain.prototype.update = function() {
    SceneBase.prototype.update.call(this);
    this.updateWindow();
    
    // 窗口活动判断
    this.wCommand.active = false;
    this.wPlayer.active = false;
    this.wReation.active = false;
    if(RV.GameData.Temp.waitInput) {
        var inputMode = RV.GameData.Temp.inputMode;
        if(inputMode == 1) {
            this.wCommand.active = true;
        } else if (inputMode == 2) {
            this.wPlayer.active = true;
        } else if (inputMode == 3) {
            this.wReation.open();
            this.wReation.reset();
            this.wReation.active = true;
        }
    }

    // 指令输入
    if(RV.GameData.Temp.selectCommand != 0) {
        this.lHandler.commandSelect();
    }
    if(RV.GameData.Temp.selectCard != 0) {
        this.lHandler.cardSelect();
    }


};

// 逻辑初始化
SceneMain.prototype.initLogic = function() {
    this.lMain = new LogicMain();
    this.lMain.init();
    this.lHandler = new LogicHandler();
    this.lHandler.init();
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
    this.wReation.z = 2000;
    this.wReation.init();
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
    if(this.lMain==null || this.lHandler==null) {
        return;
    }
    if(router==Protocol.Tcp.MainSetReq) {
        this.lMain.gamesetHandler(data);
        return;
    }
    if(router==Protocol.Tcp.MainSetRsp) {
        this.lHandler.gamesetHandler(data);
        this.wPlayer.createPlayers();
        this.lHandler.turnStart();
        return;
    }
    if(router==Protocol.Tcp.MainCommand) {
        this.lMain.commandHandler(data);
        return;
    }
    if(router==Protocol.Tcp.MainDo01) {
        this.lHandler.do01Handler(data);
        return;
    }
};
