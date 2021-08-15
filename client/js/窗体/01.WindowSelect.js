/**
* 选择框窗体
* 所有选项窗体的父类，不提供实例化
* this._buttons 在子类中具体实现
*/ 
function WindowSelect(x, y, width, height) {
    // 继承 WindowBase
    WindowBase.call(this, x, y, width, height);
    this.keyboardEnable = false; // 键盘可用
    this.mouseEnable = true; // 鼠标可用
    this.keyboardMode = 1; // 按键模式 1-上下 2-左右

    this._index = 0; // 选项索引 0:未选择 -1:全选
    this._lastIndex = 0;
    this._buttons = []; // 按钮组
};
WindowSelect.prototype = new WindowBase(); 
WindowSelect.prototype.constructor = WindowSelect;
//================================
// 初始化
WindowSelect.prototype.init = function(noWindow=false) {
    WindowBase.prototype.init.call(this, noWindow);
    this.createButtons();
};

WindowSelect.prototype.createButtons = function() {
    this._buttons = [];
};
//---------------------------------
// 析构
WindowSelect.prototype.dispose = function(){
    WindowBase.prototype.dispose.call(this);
};
//---------------------------------
// 主循环
WindowSelect.prototype.update = function(){
    WindowBase.prototype.update.call(this);
    if(this.active==false) return;
    this.mouseUpdate();
    this.keyboardUpdate();
    this.updateIndex();
};

// 鼠标
WindowSelect.prototype.mouseUpdate = function(){
    if(this._index==-1 || !this.mouseEnable) {
        return;
    }
    for (var i=0; i<this._buttons.length;i++) {
        if(this._buttons[i].isSelected() && i+1!=this._index) {
            this._index=i+1;
        }
        if(this._buttons[i].isClick()){
            this._index=i+1;
            this._processOK();
        }
    }
    if(IInput.up && IInput.mouseButton==1) {
        this._processRightClick();
    }
};

// 键盘
WindowSelect.prototype.keyboardUpdate = function(){
    if(this._index==-1 || !this.keyboardEnable) {
        return;
    }
    if((this.keyboardMode==1 && IInput.isKeyDown(RC.Key.down)) ||
        this.keyboardMode==2 && IInput.isKeyDown(RC.Key.right)) {
        this._index += 1;
        if(this._index > this._buttons.length) this._index = 1;
    }
    if((this.keyboardMode==1 && IInput.isKeyDown(RC.Key.up)) ||
        this.keyboardMode==2 && IInput.isKeyDown(RC.Key.left)) {
        this._index -= 1;
        if(this._index <= 0) this._index = this._buttons.length;
    }
    if(RC.IsKeyOK()) {
        this._processOK();
    }
    if(IInput.isKeyDown(RC.Key.cancel)) {
        this._processCancel();
    }
};

// 刷新选中框
WindowSelect.prototype.updateIndex = function(){
    if(this._index==this._lastIndex) {
        return;
    }
    if(this._lastIndex==-1) {
         for (var i=0; i<this._buttons.length;i++) {
            this._buttonUnfocus(i+1);
         }
    } else {
        this._buttonUnfocus(this._lastIndex);
    }
    if(this._index==-1) {
         for (var i=0; i<this._buttons.length;i++) {
            this._buttonFocus(i+1);
         }
    } else {
        this._buttonFocus(this._index);
    }
    this._lastIndex=this._index;
};
//---------------------------------
// 按钮操作
WindowSelect.prototype._buttonFocus = function(index) {
    if(index<=0) {
        return;
    }
    this._buttons[index-1].doFocus();
};

WindowSelect.prototype._buttonUnfocus = function(index) {
    if(index<=0) {
        return;
    }
    this._buttons[index-1].doUnfocus();
};

WindowSelect.prototype.reset = function() {
    this._index = 0;
    this.updateIndex();
};

WindowSelect.prototype.set = function(index) {
    if(index<=0) {
        return;
    }
    this._index = index;
    this.updateIndex();
};
//---------------------------------
// 事件处理
WindowSelect.prototype._processOK = function() {};
WindowSelect.prototype._processCancel = function() {};
WindowSelect.prototype._processRightClick = function() {};
//---------------------------------
// 清空
WindowSelect.prototype.clear = function() {
    for (var i=0; i<this._buttons.length;i++) {
        if(this._buttons[i]!=null) {
            this._buttons[i].disposeMin()
        }
    }
    this._buttons = [];
    WindowBase.prototype.clear.call(this);
};