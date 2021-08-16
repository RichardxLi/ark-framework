/**
 * 主场景
 */
function SceneMain() {
    SceneBase.call(this);
    this.lMain = null;      // 主流程逻辑
    this.lHandler = null;   // 网络输入逻辑
    this.lInputer = null;     // 本机输入逻辑

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
    this.updateInput();
};

// 逻辑初始化
SceneMain.prototype.initLogic = function() {
    this.lMain = new LogicMain();
    this.lMain.init();
    this.lInputer = new LogicInputer();
    this.lInputer.init(this.lMain);
    this.lHandler = new LogicHandler();
    this.lHandler.init(this.lMain);
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
    // 活动判断
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
    // 玩家创建
    if(RV.GameData.Temp.gameSet) {
        RV.GameData.Temp.gameSet = false;
        wPlayer.createPlayers();
    }
    this.wLog.update();
    this.wCommand.update();
    this.wPlayer.update();
    this.wReation.update();
};

// 输入刷新
SceneMain.prototype.updateInput = function() {
    if(RV.GameData.Temp.selectCommand != 0) {
        this.lInputer.command();
    }
    if(RV.GameData.Temp.selectCard != 0) {
        this.lInputer.card();
    }
    if(RV.GameData.Temp.selectReact != 0) {
        this.lInputer.reaction();
    }
}

// 网络消息
SceneMain.prototype.netHandler = function(router, data) {
    if(this.lHandler==null) {
        return;
    }
    if(router==Protocol.Tcp.MainInitReq) {
        this.lHandler.initReq(data);
        return;
    }
    if(router==Protocol.Tcp.MainInitRsp) {
        this.lHandler.initRsp(data);
        return;
    }
    if(router==Protocol.Tcp.MainCommandReq) {
        this.lHandler.commandReq(data);
        return;
    }
    if(router==Protocol.Tcp.MainChallengeReq) {
        this.lHandler.challengeReq(data);
        return;
    }
    if(router==Protocol.Tcp.MainChallengeRsq) {
        this.lHandler.challengeRsq(data);
        return;
    }
    if(router==Protocol.Tcp.MainProcess100) {
        this.lHandler.process100(data);
        return;
    }
    if(router==Protocol.Tcp.MainProcess300) {
        this.lHandler.process300(data);
        return;
    }
};
