/** 
 * 启屏
 * 游戏启动首个场景
 */
function SceneStart() {
    SceneBase.call(this);
    // logo<ISprite>
    this.logo = null;
};

SceneStart.prototype = new SceneBase(); 
SceneStart.prototype.constructor = SceneStart;
//================================
// 初始化
SceneStart.prototype.init = function() {
    SceneBase.prototype.init.call(this);

    // 加载数据库
    RF.LoadDatabase();
    // 数据初始化
    RF.InitGameData();

    // 设置logo
    var logoBmp = RF.LoadBitmap("game_logo.png");
    this.logo = new ISprite(logoBmp);
    this.logo.z = 2000;
    this.logo.yx = 0.5;
    this.logo.yy = 0.5;
    this.logo.x = IVal.GWidth / 2;
    this.logo.y = IVal.GHeight / 2;
    this.logo.opacity = 0;

    // 版本信息
    var w = IFont.getWidth(RV.System.Version,18);
    this.background.drawTextQ(RV.System.Version,
            RV.System.Width - w - 10,RV.System.Height - 30,
            IColor.CreatColor(87,87,87),18);
    return true;
};

// 析构
SceneStart.prototype.dispose = function() {
    SceneBase.prototype.dispose.call(this);
    this.logo.dispose();
};

// 帧更新
SceneStart.prototype.update = function() {
    SceneBase.prototype.update.call(this);
    if(this.logo.opacity==0) {
        this.logo.fadeTo(1, 60);
        var __logo = this.logo;
        this.logo.setOnEndFade(function(){
            __logo.fadeTo(0.01,80)
            __logo.setOnEndFade(function(){
                IVal.scene.goto(new SceneLogin())
            })
        });
    }
};