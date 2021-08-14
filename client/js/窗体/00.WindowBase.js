/**
* 基础窗体
* 所有窗体的父类，不提供实例化
*/
function WindowBase(x, y, width, height){
    this.x = x;
    this.y = y;
    this.z = 1000;
    this.width = width;
    this.height = height;
    this.standardPadding = 24;
    this.fontSize = 32;
    this.active = false;

    // 背景色
    this._colorBackgroud = new IColor(0,0,0,180);
    // 窗口精灵
    this._window = null;
    // 主视窗
    this._viewport = null; 
    // 内容精灵
    this._content = null; 
    // 无窗口模式
    this._noWindow = false;
};
//---------------------------------
// 初始化
WindowBase.prototype.init = function(noWindow=false) {
    this._noWindow = noWindow;
    this.createWindow(noWindow);
    this.createViewport();
    this.createContent();
}

WindowBase.prototype.createWindow = function(noWindow){
    if(this._window!=null) this._window.dispose();
    this._window = new ISprite(this.width, this.height, this._colorBackgroud);
    this._window.x = this.x;
    this._window.y = this.y;
    this._window.z = this.z;
    if(noWindow) {
        this._window.opacity = 0;
    }
};

WindowBase.prototype.createViewport = function(){
    this._viewport = new IViewport(0, 0, this.contentWidth(), this.contentHeight());
    this._viewport.x = this.x + this.standardPadding;
    this._viewport.y = this.y + this.standardPadding;
    this._viewport.z = this.z+1;
};

WindowBase.prototype.createContent = function(){
    if(this._content != null) this._content.dispose();
    var bitmap = null
    if(this.contentWidth()>0 && this.contentHeight()>0) {
        bitmap = new IBitmap.CBitmap(this.contentWidth(), this.contentHeight())
    } else {
        bitmap = new IBitmap.CBitmap(1, 1)
    }
    this._content = new ISprite(bitmap, this._viewport);
    this._content.z = 1;
};
//---------------------------------
// 析构
WindowBase.prototype.dispose = function(){
    if(this._window != null) this._window.dispose();
    if(this._content != null) this._content.dispose();
    if(this.endDo != null) this.endDo();
};
//---------------------------------
// 主循环
WindowBase.prototype.update = function(){
    this.updateWindow();
    this.updateViewport();
    return true;
};

WindowBase.prototype.updateWindow = function(){
    if(this._window == null) return;
    this._window.width = this.width;
    this._window.height = this.height;
    this._window.x = this.x;
    this._window.y = this.y;
 };

WindowBase.prototype.updateViewport = function(){
    if(this._viewport == null) return;
    this._viewport.width = this.contentWidth();
    this._viewport.height = this.contentHeight();
    this._viewport.x = this.x + this.standardPadding;
    this._viewport.y = this.y + this.standardPadding;
};
//---------------------------------
// 长度计算
WindowBase.prototype.contentWidth = function() {
    return this.width - 2 * this.standardPadding;
};

WindowBase.prototype.contentHeight = function() {
    return this.height - 2 * this.standardPadding;
};

WindowBase.prototype.fittingHeight = function(lineNum) {
    return lineNum * this.fontSize + this.standardPadding * 2;
};
//---------------------------------
// 基础操作
WindowBase.prototype.open = function() {
    if(this._window.visible==false) {
        this._window.opacity = 0;
        this._window.visible = true;
    }
    if(this._viewport.visible==false) {
        this._viewport.opacity = 0 ;
        this._viewport.visible = true;
    }
    if(!this._noWindow) {
        this._window.fadeTo(1, 6);
        this._window.setOnEndFade(function(){
            w.visible = true;
        });
    }
    this._viewport.fadeTo(1, 6);
    this._viewport.setOnEndFade(function(){
        v.visible = true;
    });
};

WindowBase.prototype.close = function() {
    this._window.fadeTo(0, 6);
    var w = this._window;
    this._window.setOnEndFade(function(){
        w.visible = false;
    });
    var v = this._viewport;
    this._viewport.fadeTo(0, 6);
    this._viewport.setOnEndFade(function(){
        v.visible = false;
    });
    this.active = false;
};

WindowBase.prototype.hide = function() {
    this._window.visible = false;
    this._viewport.visible = false;
    this.active = false;
};

WindowBase.prototype.show = function() {
    this._window.visible = true;
    this._viewport.visible = true;
    
};
//---------------------------------
// 文本操作
WindowBase.prototype.drawText = function(text,x,y,color) {
    this._content.drawTextQ(text,x,y,color,this.fontSize);
};

WindowBase.prototype.drawTextEx = function(text,x,y,color) {
    var height = IFont.getHeight(text, this.fontSize)
    var pos = {x:x, y:y, new_x:x, lineHeight:height}
    while(true) {
        var c = text.substring(0,1);
        text = text.substring(1 , text.length);
        this._processCharacter(c, pos, text, color);
        if(text.length<=0) {
            break;            
        }
    }
};

WindowBase.prototype._processCharacter = function(c, pos, text, color) {
    switch(c) {
        case '\n': // new line
             this._processNormalLine(text, pos);
            break;
        case '\f': //  new page
            this._processNormalPage(text, pos);
            break;
        default:
            this._processNormalCharacter(c, pos, color);
    }
};

WindowBase.prototype._processNormalCharacter = function(c, pos, color) {
    this.drawText(c, pos.x, pos.y, color);
    pos.x += IFont.getWidth(c, this.fontSize)
};

WindowBase.prototype._processNormalLine = function(text, pos) {
    pos.x  = pos.new_x;
    pos.y =  pos.lineHeight;
    pos.lineHeight = IFont.getHeight(text,this.fontSize);
};

WindowBase.prototype._processNormalPage = function(text, pos) {};
//---------------------------------
// 清空
WindowBase.prototype.clear = function() {
    this._content.clearBitmap();
}