/**
 * 房间
 */
function SceneRoom() {
    SceneBase.call(this);
    this.sStart = null;    // 开始按钮
    this.sExit = null;     // 退出按钮
    this.ssPlayer = null; // 玩家列表 <SpritesetRoomPlayer>
    this.view1 = null;           // 玩家列表视图
    this.logic = null;           // 房间逻辑模块
};

SceneRoom.prototype = new SceneBase(); 
SceneRoom.prototype.constructor = SceneRoom;

// 初始化
SceneRoom.prototype.init = function() {
    SceneBase.prototype.init.call(this);
    this.initSprite();
    if(RV.GameData.User.isHost) {
        this.logic = new LogicRoomHost();
    } else {
        this.logic = new LogicRoomGuest();
    }
    this.logic.init();
    return true;
};

// 帧刷新
SceneRoom.prototype.update = function() {
    SceneBase.prototype.update.call(this);
    this.ssPlayer.update();

    // 开始
    if(this.sStart.isSelected() && IInput.up){
        IInput.up = false;
        this.logic.start();
    }

    // 退出
    if(this.sExit.isSelected() && IInput.up){
        IInput.up = false;
        this.logic.exit();
    }
};


// 精灵初始化
SceneRoom.prototype.initSprite = function() {
    // 背景
    this.background.drawTextQ(RV.GameData.Room.name,800,80,IColor.Red(),60);
    this.background.drawTextQ("玩家:",120,300,IColor.Red(),42);

    // 开始按钮
    this.sStart = new ISprite(90,50,new IColor(0,0,0,175));
    this.sStart.x = 200;
    this.sStart.y = 80;
    this.sStart.z = 1001;
    this.sStart.drawTextQ("开始",8,6,IColor.White(),32);
    if(!RV.GameData.User.isHost) {
        this.sStart.visible = false;
    }

    // 退出按钮
    this.sExit = new ISprite(90,50,new IColor(0,0,0,175));
    this.sExit.x = 300;
    this.sExit.y = 80;
    this.sExit.z = 1001;
    this.sExit.drawTextQ("退出",8,6,IColor.White(),32);

    // 玩家列表
    this.view1 = new IViewport(100, 400, 1400, 500);
    this.view1.z = 1001;
    this.ssPlayer = new SpritesetRoomPlayer(this.view1, RV.GameData.Room);
};

SceneRoom.prototype.dispose = function() {
    SceneBase.prototype.dispose.call(this);
    if(this.sStart != null) this.sStart.dispose();
    if(this.sExit != null) this.sExit.dispose();
    if(this.ssPlayer != null) this.ssPlayer.dispose();
};

SceneRoom.prototype.netHandler = function(router, data) {
    if(router==Protocol.Tcp.RoomJoin) {
        this.logic.joinHandler(data);
        return;
    }
    if(router==Protocol.Tcp.RoomLeave) {
        this.logic.leaveHandler(data);
        return;
    }
    if(router==Protocol.Tcp.RoomInfo) {
        this.logic.infoHandler(data);
        return;
    }
};

