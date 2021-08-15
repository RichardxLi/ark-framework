/**
* 响应窗体
* [质疑/不质疑] [阻挡/不阻挡]
*/ 
function WindowReaction(x, y) {
    WindowSelect.call(this, x, y, 1150, 320);
    this._colorBackgroud = new IColor(150, 150, 240, 245);
};
WindowReaction.prototype = new WindowSelect();
WindowReaction.prototype.constructor = WindowReaction;
// //================================
// 初始化
WindowReaction.prototype.init = function() {
    WindowSelect.prototype.init.call(this, false);
    this.hide();
};

WindowReaction.prototype.createButtons = function() {
    for (var i = 0; i < 2; i++) {
        var bt = new SpriteButton(this._viewport, " ");
        bt.x = 250 + i*200;
        bt.y = 190;
        this._buttons[i] = bt;
    }
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
    this.drawLog();
    for(var i=0; i<this._buttons.length; i++) {
        this._buttons[i].updateFrame();
    }
    if(this.active==false) return;
    return true;
};

WindowReaction.prototype.drawLog = function() {
    this._content.clearBitmap();
    if(RV.GameData.Temp.reactLog != "") {
        this.drawTextEx(RV.GameData.Temp.reactLog, 80, 20, IColor.Black());
    }
    if(RV.GameData.Core.state == RV.State.Block) {
        this._buttons[0].setTitle("阻挡");
        this._buttons[1].setTitle("不阻挡");
    } else if (RV.GameData.Core.state == RV.State.Challenge) {
        this._buttons[0].setTitle("质疑");
        this._buttons[1].setTitle("不质疑");
    }
};
//---------------------------------
// 选择
WindowReaction.prototype._processOK = function() {
    RV.GameData.Temp.selectReact = this._index;
    RV.GameData.Temp.waitInput = false;
};
