/** 
 * 游戏数据-用户
 * 本机用户账号相关
 */
function GameUser() {
    this.name = "";         // 用户名
    this.isHost = false;    // 是否为主机
    this.isVisitor = false; // 是否为旁观者
    this.inRoom = false;    // 是否在房间中
    this.playerIndex = 0;   // 玩家序号 GamePlayers内部使用
};