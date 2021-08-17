/** 
 * 游戏数据-网络大厅
 */
function GameLobby() {
    this.loading = false; // 数据获取中
    this.newRoomName = ""; // 新建房间名称
    this.rooms = []; // <GameLobbyRoom>

    this.clear = function() {
        this.rooms = [];
    };
};

/**
 * 大厅房间
 */ 
function GameLobbyRoom(index, guid, name, state) {
    this.index = index;
    this.guid = guid;
    this.name = name;
    this.state = state;
};
