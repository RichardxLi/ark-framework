/** 
 * 基础场景
 * 所有场景的父类，不提供实例化
 */
function SceneBase() {
    // 准备完毕
    this.ready = false;
    // 加载中
    this.loading = false;
    // logo<ISprite>
    this.background = null;
};

// 主循环 - 每帧自动请求
SceneBase.prototype.update = function() {
    // alt+F4 强制退出
    if(RC.IsKeyExit()) {
        gameClose();
    }

    // 加载中 - 不执行循环
    if(this.loading) return;

    // 未就绪 - 初始化场景
    if(!this.ready) {
        this.loading = true;
        if(this.init()) {
            this.ready = true;
            this.loading = false;
        }
    }
};

// 初始化 - 资源加载
// false：等待其他资源
SceneBase.prototype.init = function() {
    // 设置背景
    this.background = new ISprite(IVal.GWidth, IVal.GHeight, IColor.White());
    this.background.z = 1000;
    return true;
};

// 析构 - 释放资源
SceneBase.prototype.dispose = function(transform=true) {
    if(transform) {
        this.background.fadeTo(0,40);
        var __bg = this.background;
        this.background.setOnEndFade(function(){
            __bg.dispose();
        });
    } else {
        this.background.dispose();
    }
};

// 场景跳转
// @param transform 渐变
SceneBase.prototype.goto = function(scene, transform=true) {
    this.dispose();
    IVal.scene = scene;
};

// 网络消息
SceneBase.prototype.netHandler = function(router, data) {};
