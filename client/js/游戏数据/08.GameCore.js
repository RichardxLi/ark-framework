/** 
 * 核心数据
 * 客户端无关数据
 * 由服务端广播更新
 */
function GameCore() {
    this.currentPlayer = 0; // 当前回合玩家 GamePlayer.index
    this.state = 0; // 状态机 RV.State
    this.playerOrder = []; // 用户座次
    this.deckOrder = []; // 卡组顺序
    this.command = 0; // 指令
    this.challengeTarget = 0; // 被质疑玩家
    this.challengePlayer = []; //  质疑玩家
};