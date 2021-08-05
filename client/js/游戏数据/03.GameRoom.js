/** 
 * 游戏数据-房间
 */
function GameRoom() {
    this.loading = false; // 数据获取中
    this.name = "";     // 房间名
    this.players = []; // <GameRoomPlayer>

    // 最大玩家数
    this.max = function() {
        return 6;
    };

    // 满员
    this.isFull = function() {
        return this.players.length>=this.max();
    };

    // 添加玩家
    this.addPlayer = function(name) {
        if(!this.isFull()) {
            var p = new GameRoomPlayer(this.players.length+1, name);
            this.players[this.players.length] = p;
        }
    };

    // 删除玩家
    this.delPlayer = function(name) {
        var list = [];
        var j = 0;
        for(var i=0; i<this.players.length; i++) {
            if(this.players[i].name==name) {
                continue;
            }
            list[j] = this.players[i];
            j++;
        }
        this.players = list;
    };

    // 清空
    this.clear = function() {
        this.players = [];
    };
};

function GameRoomPlayer(index, name) {
    this.name = name;
    this.index = index;
};
