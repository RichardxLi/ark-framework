/**
 * 网络处理逻辑
 */ 
function LogicHandler() {
    var lMain = null;
    var isHost = false;

    // 初始化
    this.init = function(l) {
        lMain = l;
        isHost = RV.GameData.User.isHost;
    };

    // 初始化请求 host处理
    this.initReq = function(data) {
        if(!isHost) return;
        var rsp = TcpMessage.MainInitRsp();
        rsp.po = RV.GameData.Core.playerOrder;
        rsp.do = RV.GameData.Core.deckOrder;
        ISocketClient.sendGroup(Protocol.Tcp.MainSetRsp, rsp);
    };

    // 初始化响应 guest处理
    this.initRsp = function(data) {
        if(isHost) return;
        if(RV.GameData.Core.state != RV.State.GameInit) return;
        RV.GameData.Core.playerOrder = data.po;
        RV.GameData.Core.deckOrder = data.do;
        lMain.initProcess();
    };

    // 命令请求 host处理
    this.commandReq = function(data) {
        if(!isHost) return;
        if(data.player != RV.GameData.Core.currentPlayer) return;
        RV.GameData.Core.command = data.command;
        RV.GameData.Core.commandCard = data.card;
        RV.GameData.Core.state = RV.State.GameInit.CommandSelect;
        lMain.doCommand();
    };

    // 挑战请求 guest处理
    this.challengeReq = function(data) {
        if(isHost) return;
        RV.GameData.Core.challengeTarget = data.t;
        RV.GameData.Core.challengeLabel = data.l;
        RV.GameData.Core.challengeCurrent = data.c;
        lMain.challengeReq();
    };

    //  挑战响应 host处理
    this.challengeRsp = function(data) {
        if(!isHost) return;
        lMain.doChallenge(data.ok);
    };

    // -----------------------------------
    // 指令结算 guest处理
    this.process100 = function(data) {
        if(isHost) return;
        lMain.process100();
    };

    this.process300 = function(data) {
        if(isHost) return;
        RV.GameData.Core.commandCard = data.card;
        lMain.process300();
    };
};
