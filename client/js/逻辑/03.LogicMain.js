/**
 * 游戏主处理逻辑
 * 仅主机端使用
 * 用于游戏流程计算，消息广播
 */ 
function LogicMain() {
    var isHost = true;

    // 初始化
    this.init = function() {
        isHost = RV.GameData.User.isHost;
        if(!isHost) return;
        RV.GameData.Cards.init();
        RV.GameData.Players.init();
        RV.GameData.Deck.init();
        // 分座位
        RV.GameData.Core.playerOrder = shuffle(RV.GameData.Players.total());
        //RV.GameData.Core.playerOrder = [0, 1];
        // 洗牌
        RV.GameData.Core.deckOrder = shuffle(RV.GameData.Deck.total());
    };

    // 开局信息
    this.gamesetHandler = function(data) {
        if(!isHost) return;
        var rsp = TcpMessage.MainSetRsp();
        rsp.po = RV.GameData.Core.playerOrder;
        rsp.do = RV.GameData.Core.deckOrder;
        ISocketClient.sendGroup(Protocol.Tcp.MainSetRsp, rsp);
    };

    this.commandHandler = function(data) {
        if(!isHost) return;
        if(data.player != RV.GameData.Core.currentPlayer) {
            return
        }
        switch(data.command) {
            case 1:
                this._do01(data.player);
                break;
            case 2:
                break;
            case 3:
                this._do03(data.player, data.card);
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
        }
    };

    this._do01 = function(player) {
        RV.GameData.Players.get(player).gold += 1
        var data = TcpMessage.MainDo01();
        data.player = player;
        data.gold = RV.GameData.Players.get(player).gold;
        data.next = next();
        ISocketClient.sendGroup(Protocol.Tcp.MainDo01, data);
    };

    this._do03 = function(player, card) {
        RV.GameData.Players.get(player).gold -= 7;
        RV.GameData.Cards.get(card).die = true;
        //todo: lixiang
    };

    var next = function() {
        while(true) {
            RV.GameData.Core.currentPlayer += 1;
            if(RV.GameData.Core.currentPlayer > RV.GameData.Players.total()) {
                RV.GameData.Core.currentPlayer = 1;
            }
            if(!currentPlayer().die) {
                return RV.GameData.Core.currentPlayer;
            }
        }
    }

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
    }

    var currentPlayer = function() {
        return RV.GameData.Players.get(RV.GameData.Core.currentPlayer);
    };

    // 卡片拥有者
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
