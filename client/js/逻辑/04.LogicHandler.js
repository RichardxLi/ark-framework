/**
 * 输入处理逻辑
 * 所有端端使用
 * 响应本机输入发送请求，响应网络输入更新数据
 */ 
function LogicHandler() {
    // 初始化
    this.init = function() {
        isHost = RV.GameData.User.isHost;
        if(!isHost) {
            RV.GameData.Cards.init();
            RV.GameData.Players.init();
            RV.GameData.Deck.init();
        }
        RV.GameData.Core.currentPlayer = 1;
        RV.GameData.Core.state = RV.State.GameInit;
        RV.GameData.Temp.waitHost = true;
        ISocketClient.sendHost(Protocol.Tcp.MainSetReq, TcpMessage.MainSetReq());
        // todo:轮询请求
    };

    // 开局设置
    this.gamesetHandler = function(data) {
        if(RV.GameData.Core.state != RV.State.GameInit || !RV.GameData.Temp.waitHost) {
            return;
        }
        RV.GameData.Core.state = RV.State.GameSet;
        RV.GameData.Temp.waitHost = false;
        RV.GameData.Players.shuffle(data.po);
        RV.GameData.Deck.shuffle(data.do);
        // 用户设置
        for(var i=0; i<RV.GameData.Players.total(); i++) {
            var p = RV.GameData.Players.list()[i];
            if(p.name == RV.GameData.User.name) {
                RV.GameData.Temp.myIndex = p.index
            }
            // 发牌
            for(var j=0; j<2; j++) {
                 var c = RV.GameData.Deck.pop();
                 p.setHand(j, c);
                 if(p.isSelf()) {
                    p.hand(j).face = true;
                 }
            }
        }
    };

    // 回合开始
    this.turnStart = function() {
        RV.GameData.Core.state = RV.State.TurnInit;
        RV.GameData.Temp.selectCommand = 0;
        RV.GameData.Temp.selectCard = 0;
        RV.GameData.Temp.selectReact = 0;
        RV.GameData.Temp.waitInput = false;
        RV.GameData.Temp.inputMode = false;
        RV.GameData.Temp.waitHost = false;
        RV.GameData.Temp.commandReset = true;
        RV.GameData.Temp.mainLog += currentPlayer().name + " 回合开始\n";
        if(isMyTurn()) {
            if(me().gold>=10) {
                RV.GameData.Temp.mainLog += "资金大于10 强制政变";
                RV.GameData.Temp.selectCommand = 3;
                RV.GameData.Temp.commandIndex = 3;
                return;
            }
            RV.GameData.Temp.mainLog += "请选择行动\w";
            RV.GameData.Temp.waitInput = true;
            RV.GameData.Temp.inputMode = 1;
        } else {
            RV.GameData.Temp.mainLog += "等待行动";
            RV.GameData.Temp.waitHost = true;
        }
    };

    // 指令选择
    this.commandSelect = function() {
        if(RV.GameData.Core.state != RV.State.TurnInit) return;
        switch(RV.GameData.Temp.selectCommand) {
            case 3:
                if(me().gold<7) {
                    RV.GameData.Temp.selectCommand = 0;
                    RV.GameData.Temp.waitInput = true;
                    return;
                }
            case 5:
                if(me().gold<3) {
                    RV.GameData.Temp.selectCommand = 0;
                    RV.GameData.Temp.waitInput = true;
                    return;
                }
            case 7:
                RV.GameData.Players.coupHint();
                RV.GameData.Temp.waitInput = true;
                RV.GameData.Temp.inputMode = 2;
                break;
            default:
                commandSend();
        }
        RV.GameData.Core.state = RV.State.CommandSelect;
    }

    // 卡牌选择
    this.cardSelect = function() {
        if(RV.GameData.Core.state == RV.State.CommandSelect) {
            RV.GameData.Core.state = RV.State.CommandSelect2
            commandSend();
            return;
        }
    }

    // 收入
    this.do01Handler = function(data) {
        if(RV.GameData.Core.state != RV.State.TurnInit && 
            RV.GameData.Core.state != RV.State.CommandSelect) {
            return;
        }
        if(!isHost) {
            RV.GameData.Players.get(data.player).gold = data.gold;
            RV.GameData.Core.currentPlayer = data.next;
        }
        RV.GameData.Temp.mainLog = RV.GameData.Players.get(data.player).name+" 收入 $+1\n";
        this.turnStart();
    }

    var commandSend = function() {
        var data = TcpMessage.MainCommand();
        data.player = RV.GameData.Temp.myIndex;
        data.command = RV.GameData.Temp.selectCommand;
        data.card = RV.GameData.Temp.selectCard;
        ISocketClient.sendHost(Protocol.Tcp.MainCommand, data);
        RV.GameData.Temp.selectCommand = 0;
        RV.GameData.Temp.selectCard = 0;
    }

    var isMyTurn = function() {
        return RV.GameData.Core.currentPlayer == RV.GameData.Temp.myIndex;
    };

    var currentPlayer = function() {
        return RV.GameData.Players.get(RV.GameData.Core.currentPlayer);
    };

    var me = function() {
        return RV.GameData.Players.get(RV.GameData.Temp.myIndex);
    }
};