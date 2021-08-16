/**
 * 本机输入逻辑
 */ 
function LogicInputer() {
    var lMain = null;
    var isHost = false;

    // 初始化
    this.init = function(l) {
        lMain = l;
        isHost = RV.GameData.User.isHost;
    };

    // 选择指令
    this.command = function() {
        if(RV.GameData.Core.state != RV.State.TurnStart) return;
        RV.GameData.Core.command = RV.GameData.Temp.selectCommand;
        RV.GameData.Temp.selectCommand = 0;
        switch(RV.GameData.Core.command) {
            case 3:
                if(me().gold<7) {
                    RV.GameData.Temp.selectCommand = 0;
                    RV.GameData.Temp.waitInput = true;
                    // todo: 提示框
                    return;
                }
            case 5:
                if(me().gold<3) {
                    RV.GameData.Temp.selectCommand = 0;
                    RV.GameData.Temp.waitInput = true;
                    // todo: 提示框
                    return;
                }
            case 7: 
                RV.GameData.Players.coupHint();
                RV.GameData.Temp.waitInput = true;
                RV.GameData.Temp.inputMode = 2;
                break;
            default:
                RV.GameData.Core.state = RV.State.CommandSelect;
                commandReq();
        }
    };

    // 选择卡牌
    this.card = function() {
        if(RV.GameData.Core.state == RV.State.TurnStart) {
            cardWithCommand();
            return;
        }
        // todo:
    };

    // 选择响应
    this.reaction = function() {
        // 阻挡
        if(RV.GameData.Temp.reactMode == 1) {
            block();
        }
        // 质疑
        if(RV.GameData.Temp.reactMode == 2) {
            challenge();
        }
    };

    var challenge = function() {
        var ok = RV.GameData.Temp.selectReact;
        if(ok==1) ok = true;
        RV.GameData.Temp.selectReact = 0;
        if(isHost) {
            lMain.processChallenge(ok);
        } else {
            var data = TcpMessage.MainChallengeRsq();
            data.ok = ok;
            ISocketClient.sendHost(Protocol.Tcp.MainChallengeRsp, data);
        }
    };

    var block = function() {

    };

    // 指令->卡牌
    var cardWithCommand = function() {
        RV.GameData.Core.commandCard = RV.GameData.Temp.selectCard;
        RV.GameData.Temp.selectCard = 0;
        RV.GameData.Core.state = RV.State.CommandSelect;
        commandReq();
    };

    // 发送指令
    var commandReq = function() {
        if(isHost) {
            lMain.doCommand();
        } else {
            var data = TcpMessage.MainCommandReq();
            data.player = RV.GameData.Temp.myIndex;
            data.command = RV.GameData.Temp.selectCommand;
            data.card = RV.GameData.Temp.selectCard;
            ISocketClient.sendHost(Protocol.Tcp.MainCommandReq, data);
        }
    };

    // 自己的信息
    var me = function() {
        return RV.GameData.Players.get(RV.GameData.Temp.myIndex);
    };
};
