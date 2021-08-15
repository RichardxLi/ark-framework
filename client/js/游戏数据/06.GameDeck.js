/** 
 * 游戏数据-牌库
 */
function GameDeck() {
    this._cards = []; // GameCard.index

    // 取一张
    this.pop = function() {
        if(this.total()==0) return 0;
        var index = this._cards[0];
        this._cards.splice(0,1);
        return index;
    };

    // 放一张
    this.add = function(index) {
        this._cards[this.total()] = index;
    };

    // 总数
    this.total = function() {
        return this._cards.length;
    }

    // 初始化
    this.init = function() {
        this._cards = [];
        for(var i=0; i<RV.GameData.Cards.list().length; i++) {
            this._cards[i] = RV.GameData.Cards.list()[i].index;
        }
    };

    // 洗牌
    // param order 指定顺序
    this.shuffle = function(order=[]) {
        if(order.length==0) {
           return;
        }
        var __new = [];
        for(var i=0; i<order.length; i++) {
           __new[i] = this._cards[order[i]];
        }
        this._cards = __new;
    };

    // 设置
    this.set = function(cards=[]) {
        this._cards = cards;
    };
};
