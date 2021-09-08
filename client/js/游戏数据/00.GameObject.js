/** 
 * 游戏数据-样例
 * @param dataId 数据库编号
 */
class GameObject {
    constructor(dataId) {
        // 绑定数据库
        this.dataId = dataId;
        this.index = 0; // 运行时刻索引
        this.picture = this.data.picture; // 图片
        this.moveX = 0; // 横向移动
        this.moveBaF = false; // 来回移动
        this.aniFrame = 60; // 默认动画速率
    }

    get data() {
        return RD.Object(this.dataId);
    }
}
