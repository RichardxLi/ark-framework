/** 
 * 临时数据
 * 客户端相关数据
 * 仅本机独立运算使用
 */
function GameTemp() {
    this.mainLog = "";  // 游戏信息 windowLog展示
    this.myIndex = 0;   // 本机玩家索引 GamePlayer.index
    this.selectCommand = 0; // 选中的指令索引
    this.selectCard = 0;    // 选中的卡片索引
    this.waitInput = false;     // 等待本机玩家输入
    this.waitHost = false;      // 等待主机广播
    this.waitGuest = false;     // 等待客机输入
};
