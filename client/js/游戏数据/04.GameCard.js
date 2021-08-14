/** 
 * 游戏数据-卡牌
 */
function GameCard(dataId) {
    // 绑定数据库
    this.dataId = dataId;
    Object.defineProperty(this, "data", {
        get: function () {
            return RD.Card(this.dataId);
        },
    });

    this.index = 0;
    this.name = this.data.name;
    this.label = this.data.label; // 标签-代码识别用
    this.fPicture = this.data.fPicture; // 正面图
    this.bPicture = this.data.bPicture; // 背面图
    this.dPicture = this.data.dPicture; // 死亡图
    this.hint = false; // 高亮
    this.faceUp = false; // 正面
    this.die = false; // 死亡
    this.inAnimation = false; // 动画处理中

    this.picture = function() {
        if(this.die) return this.dPicture;
        if(this.faceUp) return this.fPicture;
        return this.bPicture;
    };
};

/**
 * 全量卡牌集合
 */ 
function GameCards() {
    this._cards = []; // <GameCard>

    // 所有卡牌
    this.list = function() {
        return this._cards;
    };

    // 根据索引号获取
    this.get = function(index) {
        return this._cards[index-1];
    };

    // 初始化
    this.init = function() {
        this._cards = [];
        for(var i=0; i<15; i++) {
            var dataId = parseInt(i/3)+1;
            this._cards[i] = new GameCard(dataId);
            this._cards[i].index = i+1;
        }
    };

    // 清除高亮提示
    this.clearHint = function() {
        for(var i=0; i<this._cards.length; i++) {
            this._cards[i].hint = false;
        }
    };
};
