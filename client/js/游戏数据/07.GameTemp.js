/** 
 * 临时数据
 * 客户端相关数据
 * 仅本机独立运算使用
 */
function GameTemp() {
    this.mainLog = "";  // 游戏信息 windowLog展示
    this.reactLog = ""; // 响应信息 windowReaction展示
    this.myIndex = 0;   // 本机玩家索引 GamePlayer.index
    this.selectCommand = 0; // 选中的指令索引
    this.selectCard = 0;    // 选中的卡片索引 GameCard.index
    this.selectReact = 0;   // 选中的响应索引 1-确定 2-否定
    this.waitInput = false;     // 等待本机玩家输入
    this.inputMode = 0;         // 输入模式 1-指令 2-卡牌 3-响应
    this.waitHost = false;      // 等待主机广播
    this.waitGuest = false;     // 等待客机输入
    this.commandIndex = 0;      // 设置当前指令光标
    this.commandReset = false;  // 光标重置
};
