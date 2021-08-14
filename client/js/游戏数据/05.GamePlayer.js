/** 
 * 游戏数据-玩家
 */
function GamePlayer() {
     this.index = 0;
     this.name = "";     // 昵称
     this.gold = 0;      // 金币
     this._hand = [];    // 手牌 GameCard.index
     this.out = false;       // 出局
     this.challenge = false; // 质疑

     // 是否为自己
     this.isSelf = function() {
          return RV.GameData.Temp.myIndex == this.index;
     };

     // 设置手牌
     this.setHand = function(i, index) {
          this._hand[i] = index;
     };

     // 获取所有手牌
     this.hands = function() {
          var h = [];
          for(var i=0; i<this._hand.length; i++) {
               var index = this._hand[i];
               h[i] = RV.GameData.Cards.get(index);
          }
          return h;
     };

     // 获取指定手牌
     this.hand = function(i) {
          var index = this._hand[i];
          return RV.GameData.Cards.get(index);
     };

     // 手牌数
     this.total = function() {
          return this._hand.length;
     };
};

/**
 * 游戏内玩家集合
 */ 
function GamePlayers() {
     this._players = []; // <GamePlayer>

     // 所有玩家
     this.list = function() {
          return this._players;
     };

     // 根据索引号获取
     this.get = function(index) {
          return this._players[index-1];
     };

     this.total = function() {
          return this._players.length;
     };

     this.init = function() {
          this._players = [];
          for(var i=0; i<RV.GameData.Room.players.length; i++) {
               var p = new GamePlayer();
               p.index = i+1;
               p.name = RV.GameData.Room.players[i].name;
               p.gold = 2;
               this._players[i] = p;
          }
     };
};
