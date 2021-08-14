/**
* 响应窗体
* [质疑/不质疑] [阻挡/不阻挡]
*/ 
function WindowReaction(x, y) {
    WindowSelect.call(this, x, y, 1150, 320);
    this._colorBackgroud = new IColor(150, 150, 240, 225);
};
WindowReaction.prototype = new WindowSelect();
WindowReaction.prototype.constructor = WindowReaction;
//================================
// 初始化
WindowReaction.prototype.init = function() {
    WindowSelect.prototype.init.call(this, false);
    this.hide();
};

WindowReaction.prototype.createButtons = function() {
    this._buttons = [];
};
//---------------------------------
// 析构
WindowReaction.prototype.dispose = function(){
    WindowSelect.prototype.dispose.call(this);
    for(var i=0; i<this._buttons.length; i++) {
        this._buttons[i].dispose();
    }
};
//---------------------------------
// 主循环
WindowReaction.prototype.update = function(){
    WindowSelect.prototype.update.call(this);
    if(this.active==false) return;
    return true;
};
