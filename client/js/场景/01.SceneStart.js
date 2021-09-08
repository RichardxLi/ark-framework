/** 
 * 启屏
 * 游戏启动首个场景
 */
class SceneStart extends SceneBase {
    constructor() {
        super();
        // logo<ISprite>
        this.logo = null;
    }

    init() {
        super.init();
        // 加载数据库
        RF.LoadDatabase();
        // 数据初始化
        RF.InitGameData();

        // 设置logo
        let logoBmp = RF.LoadBitmap("game_logo.png");
        this.logo = new ISprite(logoBmp);
        this.logo.z = 2000;
        this.logo.yx = 0.5;
        this.logo.yy = 0.5;
        this.logo.x = IVal.GWidth / 2;
        this.logo.y = IVal.GHeight / 2;
        this.logo.opacity = 0;

        // 版本信息
        let w = IFont.getWidth(RV.System.Version,18);
        this.background.drawTextQ(RV.System.Version,
            RV.System.Width - w - 10,RV.System.Height - 30,
            IColor.CreatColor(87,87,87),18);
        return true;
    }

    dispose() {
        super.dispose();
        if(this.logo!=null) this.logo.dispose();
    }

    update() {
        super.update()
        if(this.logo.opacity==0) {
            this.logo.fadeTo(1, 60);
            let logo = this.logo;
            this.logo.setOnEndFade(function(){
                logo.fadeTo(0.01,80);
                logo.setOnEndFade(function(){
                    IVal.scene.goto(new SceneTest());
                })
            });
        }
    }
}
