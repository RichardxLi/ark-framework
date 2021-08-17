/**
 * 登录
 */
function SceneLogin() {
    SceneBase.call(this);
    this.sUserName = null;
    this.sOK = null;
};

SceneLogin.prototype = new SceneBase(); 
SceneLogin.prototype.constructor = SceneLogin;

// 初始化
SceneLogin.prototype.init = function() {
    SceneBase.prototype.init.call(this);
    this.initSprite();
    return true;
};

// 帧刷新
SceneLogin.prototype.update = function() {
	SceneBase.prototype.update.call(this);
	// 输入框
	if(this.sUserName.isSelected() && IInput.up){
		IInput.up = false;
		gameInput("输入昵称", "昵称", "", function(text){
            RV.GameData.User.name = text
            ISocketClient.uuid = text
        });
	}

	// 确认
	if(this.sOK.isSelected() && IInput.up){
		IInput.up = false;
		if(RV.GameData.User.name!="") {
			IVal.scene.goto(new SceneLobby())
		} else {
			// todo: 提示窗
		}
	}
};

// 精灵初始化
SceneLogin.prototype.initSprite = function() {
	// 背景
	this.background.drawTextQ("游戏名",800,200,IColor.Red(),72);
	this.background.drawTextQ("输入昵称",550,400,IColor.Blue(),42);

	// 用户名输入框
 	this.sUserName = new SpriteNameInput(null, RV.GameData.User);
	this.sUserName.x = 520;
 	this.sUserName.y = 450;
 	this.sUserName.z = 1001;


    // 确认按钮
    this.sOK = new ISprite(200,100,new IColor(0,0,0,175));
    this.sOK.x = 950;
 	this.sOK.y = 460;
 	this.sOK.z = 1001;
 	this.sOK.drawTextQ("确认",50,30,IColor.White(),45);
};

// 析构
SceneLogin.prototype.dispose = function() {
    SceneBase.prototype.dispose.call(this);
    if(this.sUserName != null) this.sUserName.dispose();
    if(this.sOK != null) this.sOK.dispose();
};
