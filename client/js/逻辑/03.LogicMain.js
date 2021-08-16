/**
 * 主逻辑
 * 用于游戏流程运算
 */ 
function LogicMain() {
    var isHost = true;

    // -------------------------------
    // 初始化
    this.init = function() {
        isHost = RV.GameData.User.isHost;
        RV.GameData.Players.init();
        RV.GameData.Deck.init();
        RV.GameData.Core.state = RV.State.GameInit;
        if(isHost) {
            RV.GameData.Core.playerOrder = shuffle(RV.GameData.Players.total()); // 分座位
            //RV.GameData.Core.playerOrder = [0, 1];
            RV.GameData.Core.deckOrder = shuffle(RV.GameData.Deck.total()); // 洗牌
            this.initProcess();
        } else {
            ISocketClient.sendHost(Protocol.Tcp.MainInitReq, TcpMessage.MainInitReq());
        }
    };

    // 初始化结算
    this.initProcess = function() {
        if(RV.GameData.Core.state != RV.State.GameInit) return;
        RV.GameData.Core.currentPlayer = 1;
        RV.GameData.Players.shuffle(RV.GameData.Core.playerOrder);
        RV.GameData.Deck.shuffle(RV.GameData.Core.deckOrder);
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
        RV.GameData.Core.state = RV.State.GameSet;
        RV.GameData.Temp.gameSet = true;
        this.turnStart();
    }
    // -------------------------------------
    // 回合开始
    this.turnStart = function() {
        RV.GameData.Core.state = RV.State.TurnStart;
        RV.GameData.Temp.selectCommand = 0;
        RV.GameData.Temp.selectCard = 0;
        RV.GameData.Temp.selectReact = 0;
        RV.GameData.Temp.waitInput = false;
        RV.GameData.Temp.inputMode = false;
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
            RV.GameData.Temp.mainLog += "等待对手行动\w";
        }
    };
    // -----------------------------------------
    // 指令运算
    this.doCommand = function() {
        if(RV.GameData.Core.state != RV.State.CommandSelect) return;
        switch(RV.GameData.Core.command) {
            case 1:
                this.do100();
                break;
            case 2:
                this.do200();
                break;
            case 3:
                this.do300();
                break;
            case 4:
                this.do400();
                break;
            case 5:
                this.do500();
                break;
            case 6:
                this.do600();
                break;
            case 7:
                this.do700();
                break;
        }
    };

    // 收入
    this.do100 = function() {
        // 直接结算
        this.process100();
        broadcast100();
    };

    var broadcast100 = function() {
        ISocketClient.sendGroup(Protocol.Tcp.MainProcess100, TcpMessage.MainProcess100());
    };

    // 外援
    this.do200 = function() {
        // todo:
    };

    // 政变
    this.do300 = function() {
        // 直接结算
        this.process300();
        broadcast300();
    };

    var broadcast300 = function() {
        var data = TcpMessage.MainProcess300();
        data.card = RV.GameData.Core.commandCard;
        ISocketClient.sendGroup(Protocol.Tcp.MainProcess300, data);
    };

    // 征税
    this.do400 = function() {
        RV.GameData.Core.challengeTarget = RV.GameData.Core.currentPlayer;
        RV.GameData.Core.challengeLabel = RV.Label.Duke;
        RV.GameData.Core.challengeCurrent = next(RV.GameData.Core.currentPlayer);
        this.challengeReq();
        broadcastChallengeReq();
    };

    // -----------------------------------------
    // 指令结算
    this.process100 = function() {
        var p = RV.GameData.Core.currentPlayer;
        RV.GameData.Players.get(p).gold += 1;
        RV.GameData.Temp.mainLog = RV.GameData.Players.get(p).name+" 收入 $+1\n";
        RV.GameData.Core.CurrentPlayer = nextPlayer();
        this.turnStart();
    };

    this.process300 = function() {
        var p = RV.GameData.Core.currentPlayer;
        var c = RV.GameData.Core.commandCard;
        RV.GameData.Players.get(p).gold -= 7;
        RV.GameData.Cards.get(c).die = true;
        var t = playerByCard(c);
        RV.GameData.Temp.mainLog = RV.GameData.Players.get(p).name+" 政变 " + RV.GameData.Players.get(t).name + "\n";
        if(gameover()) return;
        RV.GameData.Core.CurrentPlayer = nextPlayer();
        this.turnStart();
    };

    var gameover = function() {
        var dieNum = 0;
        for(var i=0; i<RV.GameData.Players.total(); i++) {
            var p = RV.GameData.Players.list()[i];
            if(p.hand(0).die && p.hand(1).die) {
                p.out = true;
                dieNum++;
            }
        }
        if(dieNum>=RV.GameData.Players.total()-1) {
            RV.GameData.Temp.mainLog += "游戏结束 ";
            if(me().out) {
                RV.GameData.Temp.mainLog += "败北";
            } else {
                RV.GameData.Temp.mainLog += "胜利";
            }
        }
        return true;
    };

    // ------------------------------------------------------------
    // 挑战
    this.challengeReq = function() {
        var t = RV.GameData.Players.get(RV.GameData.Core.challengeTarget);
        RV.GameData.Temp.mainLog = t.name + " 宣称 " + RV.GameData.Core.challengeLabel + " 等待挑战\w";
        if(RV.GameData.Core.challengeCurrent == RV.GameData.Temp.myIndex) {
            RV.GameData.Temp.reactLog = RV.GameData.Temp.mainLog;
            RV.GameData.Temp.waitInput = true;
            RV.GameData.Temp.inputMode = 3;
            RV.GameData.Temp.reactMode = 2;
        }
    };

    this.doChallenge = function(ok=false) {
        if(ok) {
            // 质疑
        } else {
            // 不质疑
            RV.GameData.Core.challengeCurrent = next(RV.GameData.Core.challengeCurrent);
            if(RV.GameData.Core.challengeCurrent == RV.GameData.Core.currentPlayer) {
                // 质疑结束 无人质疑
            } else {

            }
        }
    };

    var broadcastChallengeReq = function() {
        var data = TcpMessage.MainChallengeReq();
        data.t = RV.GameData.Core.challengeTarget;
        data.l = RV.GameData.Core.challengeLabel;
        data.c = RV.GameData.Core.challengeCurrent;
        ISocketClient.sendGroup(Protocol.Tcp.MainProcess300, data);
    };
    // -----------------------------------------------------------------
    // 乱序洗牌算法
    var shuffle = function(n) {
        var list = [];
        if(n<=0) return list;
        
        for(var i=0; i<n; i++) {
            list[i] = i;
        }
        for(var i=n-1; i>0; i--) {
            var rand = Math.floor(Math.random()*i);
            var t = list[rand];
            list[rand] = list[i];
            list[i] = t;
        }
        return list;
    };

    // 是否为自己的回合
    var isMyTurn = function() {
        return RV.GameData.Core.currentPlayer == RV.GameData.Temp.myIndex;
    };

    // 当前玩家
    var currentPlayer = function() {
        return RV.GameData.Players.get(RV.GameData.Core.currentPlayer);
    };

    // 下一玩家
    var nextPlayer = function(current=0) {
        if(current=0) current=RV.GameData.Core.currentPlayer;
        while(true) {
            current += 1;
            if(current > RV.GameData.Players.total()) {
                current = 1;
            }
            if(!RV.GameData.Players.get(current).die) {
                return current;
            }
        }
    };

    // 自己的信息
    var me = function() {
        return RV.GameData.Players.get(RV.GameData.Temp.myIndex);
    };

    // 获取卡片拥有者
    var playerByCard = function(card) {
        for(var i=0; i<RV.GameData.Players; i++) {
            var p = RV.GameData.Players.get(i+1);
            if(p.hand(0).index == card || p.hand(1).index == card) {
                return p.index;
            }
        }
        return 0;
    };
};




            
