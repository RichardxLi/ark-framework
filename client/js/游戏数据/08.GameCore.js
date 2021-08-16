/** 
 * 核心数据
 * 客户端无关数据
 * 由服务端广播更新
 */
function GameCore() {
    this.currentPlayer = 0; // 当前回合玩家 GamePlayer.index
    this.state = 0; // 状态机 RV.State
    this.playerOrder = []; // 用户排序
    this.deckOrder = []; // 卡组排序
    this.command = 0; // 当前指令
    this.commandCard = 0;  // 指令目标卡牌
    this.challengeTarget = 0; // 被质疑玩家
    this.challengePlayer = 0; //  质疑玩家
    this.challengeLabel = ""; // 质疑标签
    this.challengeCurrent = 0; // 当前质疑反应进行者
    this.gameover = false; // 游戏结束
};