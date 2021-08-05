/**
 * 大厅
 */
function SceneLobby() {
    SceneBase.call(this);
    this.sRefresh = null;  // 刷新按钮
    this.sCreate = null;   // 创建按钮
    this.ssRoom = null;  // 房间列表 <SpritesetLobbyRoom>
    this.view1 = null;          // 房间列表视图
    this.logic = null;          // 大厅逻辑模块
};

SceneLobby.prototype = new SceneBase(); 
SceneLobby.prototype.constructor = SceneLobby;

// 初始化
SceneLobby.prototype.init = function() {
    SceneBase.prototype.init.call(this);
    this.initSprite();
    this.logic = new LogicLobby();
    this.logic.init();
    return true;
};

// 帧刷新
SceneLobby.prototype.update = function() {
    SceneBase.prototype.update.call(this);
    this.ssRoom.update();

    // 刷新
    if(this.sRefresh.isSelected() && IInput.up){
        IInput.up = false;
        this.logic.refresh();
    }

    // 创建
    if(this.sCreate.isSelected() && IInput.up){
        IInput.up = false;
        this.logic.create();
    }

    // 房间点击
    for(var i=0; i<this.ssRoom.rooms().length; i++) {
        if(this.ssRoom.room(i).isSelected() && IInput.up) {
             IInput.up = false;
             this.logic.join(i);
        }
    }
};

// 精灵初始化
SceneLobby.prototype.initSprite = function() {
    // 背景
    this.background.drawTextQ("大厅",800,80,IColor.Red(),60);
    this.background.drawTextQ("昵称:"+RV.GameData.User.name,1000,100,IColor.Red(),42);

    // 刷新按钮
    this.sRefresh = new ISprite(90,50,new IColor(0,0,0,175));
    this.sRefresh.x = 200;
    this.sRefresh.y = 80;
    this.sRefresh.z = 1001;
    this.sRefresh.drawTextQ("刷新",8,6,IColor.White(),32);

    // 创建按钮
    this.sCreate = new ISprite(90,50,new IColor(0,0,0,175));
    this.sCreate.x = 300;
    this.sCreate.y = 80;
    this.sCreate.z = 1001;
    this.sCreate.drawTextQ("创建",8,6,IColor.White(),32);

    // 房间列表
    this.view1 = new IViewport(100, 200, RV.System.Width-200, RV.System.Height-240);
    this.view1.z = 1001;
    this.ssRoom = new SpritesetLobbyRoom(this.view1, RV.GameData.Lobby);
};


SceneLobby.prototype.dispose = function() {
    SceneBase.prototype.dispose.call(this);
    if(this.sRefresh != null) this.sRefresh.dispose();
    if(this.sCreate != null) this.sCreate.dispose();
    if(this.ssRoom != null) this.ssRoom.dispose();
};
