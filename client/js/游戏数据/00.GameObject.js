/** 
 * 游戏数据-样例
 * @param dataId 数据库编号
 */
function GameObject(dataId) {
    // 绑定数据库
    this.dataId = dataId;
    Object.defineProperty(this, "data", {
        get: function () {
            return RD.Object(this.dataId);
        },
    });
    
    this.index = 0; // 运行时刻索引
    this.picture = this.data.picture; // 图片
    this.inAnimation = false; // 动画播放中
};
