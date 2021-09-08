/**
 * 基础场景
 * 所有场景的父类，不提供实例化
 */
class SceneBase {
    constructor() {
        // 准备完毕
        this.ready = false;
        // 加载中
        this.loading = false;
        // 背景精灵 <ISprite>
        this.background = null;
    }

    update() {
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
    }

    init() {
        // 设置背景
        this.background = new ISprite(IVal.GWidth, IVal.GHeight, IColor.White());
        this.background.z = 1000;
        return true;
    }

    // transform: 是否渐变
    dispose(transform=true) {
        if(transform) {
            this.background.fadeTo(0,40);
            let __bg = this.background;
            this.background.setOnEndFade(function(){
                __bg.dispose();
            });
        } else {
            this.background.dispose();
        }
    }

    // transform: 是否渐变
    goto(scene, transform=true) {
        this.dispose();
        IVal.scene = scene;
    }
}
