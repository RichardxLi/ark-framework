/**
* 指令窗体
*/ 
function WindowCommand(x, y) {
	 WindowSelect.call(this, x, y, 380, 800);
     this._colorBackgroud = new IColor(240, 240, 150);
};
WindowCommand.prototype = new WindowSelect();
WindowCommand.prototype.constructor = WindowCommand;
//================================
// 初始化
WindowCommand.prototype.init = function() {
    WindowSelect.prototype.init.call(this, false);
};

WindowCommand.prototype.createButtons = function() {
    var menu = ["收入+$1", "外援+$2", "政变-$7", "征税*公爵", "刺杀*刺客", "交换*大使", "勒索*队长"];
    var y = 0;
    for (var i = 0; i < menu.length; i++) {
        var txt = menu[i];
        var bt = new SpriteButton(this._viewport, txt);
        bt.x = 40;
        bt.y = y;
        y += 100;
        this._buttons[i] = bt;
    }
};
//---------------------------------
// 析构
WindowCommand.prototype.dispose = function(){
    WindowSelect.prototype.dispose.call(this);
    for(var i=0; i<this._buttons.length; i++) {
    	this._buttons[i].disposeMin();
    }
};
//---------------------------------
// 主循环
WindowCommand.prototype.update = function(){
    WindowSelect.prototype.update.call(this);
    for(var i=0; i<this._buttons.length; i++) {
        this._buttons[i].updateFrame();
    }
    if(this.active==false) return;
    return true;
};
//---------------------------------
// 选择指令
WindowCommand.prototype._processOK = function() {
    this.selectCommand = this._index;
    this.waitInput = false;
};

