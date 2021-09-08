/**
* 选择框窗体
* 所有选项窗体的父类，不提供实例化
* this._buttons 在子类中具体实现
*/
class WindowSelect extends WindowBase {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.keyboardEnable = true; // 键盘可用
        this.mouseEnable = true; // 鼠标可用
        this.keyboardMode = 1; // 按键模式 1-上下 2-左右

        this._index = 0; // 选项索引 0:未选择 -1:全选
        this._lastIndex = 0;
        this._buttons = []; // 按钮组
    };

    // 初始化
    init(noWindow=false) {
        super.init(noWindow);
        this.createButtons();
    };

    createButtons() {
        this._buttons = [];
    };

    // 析构
    dispose() {
        super.dispose();
        for (let i=0; i<this._buttons.length;i++) {
            if(this._buttons[i]!=null) {
                this._buttons[i].dispose()
            }
        }
    };

    // 主循环
    update() {
        super.update();
        if(!this.active) return;
        this.mouseUpdate();
        this.keyboardUpdate();
        this.updateIndex();
    };

    mouseUpdate() {
        if(this._index==-1 || !this.mouseEnable) {
            return;
        }
        for (let i=0; i<this._buttons.length;i++) {
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

    keyboardUpdate() {
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

    updateIndex() {
        if(this._index==this._lastIndex) {
            return;
        }
        if(this._lastIndex==-1) {
            for (let i=0; i<this._buttons.length;i++) {
                this._buttonUnfocused(i+1);
            }
        } else {
            this._buttonUnfocused(this._lastIndex);
        }
        if(this._index==-1) {
            for (let i=0; i<this._buttons.length;i++) {
                this._buttonFocus(i+1);
            }
        } else {
            this._buttonFocus(this._index);
        }
        this._lastIndex=this._index;
    }

    // 光标
    _buttonFocus(index) {
        if(index<=0) {
            return;
        }
        this._buttons[index-1].doFocus();
    }

    _buttonUnfocused(index) {
        if(index<=0) {
            return;
        }
        this._buttons[index-1].cancelFocus();
    }

    // 重置
    reset() {
        this._index = 0;
        this.updateIndex();
    }

    _processOK() {};
    _processCancel() {};
    _processRightClick() {};

    // 清空内容
    clear() {
        for (let i=0; i<this._buttons.length;i++) {
            if(this._buttons[i]!=null) {
                this._buttons[i].dispose()
            }
        }
        this._buttons = [];
        super.clear();
    }
}
