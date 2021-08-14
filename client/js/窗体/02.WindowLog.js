/**
* 信息窗体
*/ 
function WindowLog(x, y) {
	 WindowBase.call(this, x, y, 1920, 200);
     this._colorBackgroud = new IColor(150, 150, 240);
};
WindowLog.prototype = new WindowBase();
WindowLog.prototype.constructor = WindowLog;
// ===========================
// 初始化
WindowLog.prototype.init = function() {
    WindowBase.prototype.init.call(this, false);
};
//---------------------------------
// 析构
WindowLog.prototype.dispose = function(){
    WindowBase.prototype.dispose.call(this);
};
//---------------------------------
// 主循环
WindowLog.prototype.update = function(){
    WindowBase.prototype.update.call(this);
    this.drawLog();
    if(this.active==false) return;
    return true;
};

WindowLog.prototype.drawLog = function() {
    this.clear();
    if(RV.GameData.Temp.mainLog != "") {
        this.drawTextEx(RV.GameData.Temp.mainLog, 40, 0, IColor.Black());
    }
};