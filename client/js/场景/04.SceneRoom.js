/**
 * 房间
 */
function SceneRoom() {
    SceneBase.call(this);
    this.spriteStart = null;    // 开始按钮
    this.spriteExit = null;     // 退出按钮
    this.spritesetPlayer = null; // 玩家列表 <SpritesetRoomPlayer>
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
    this.spritesetPlayer.update();

    // 开始
    if(this.spriteStart.isSelected() && IInput.up){
        IInput.up = false;
        this.logic.start();
    }

    // 退出
    if(this.spriteExit.isSelected() && IInput.up){
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
    this.spriteStart = new ISprite(90,50,new IColor(0,0,0,175));
    this.spriteStart.x = 200;
    this.spriteStart.y = 80;
    this.spriteStart.z = 1001;
    this.spriteStart.drawTextQ("开始",8,6,IColor.White(),32);
    if(!RV.GameData.User.isHost) {
        this.spriteStart.visible = false;
    }

    // 退出按钮
    this.spriteExit = new ISprite(90,50,new IColor(0,0,0,175));
    this.spriteExit.x = 300;
    this.spriteExit.y = 80;
    this.spriteExit.z = 1001;
    this.spriteExit.drawTextQ("退出",8,6,IColor.White(),32);

    // 玩家列表
    this.view1 = new IViewport(100, 400, 1400, 500);
    this.view1.z = 1001;
    this.spritesetPlayer = new SpritesetRoomPlayer(this.view1, RV.GameData.Room);
};

SceneRoom.prototype.dispose = function() {
    SceneBase.prototype.dispose.call(this);
    if(this.spriteStart != null) this.spriteStart.dispose();
    if(this.spriteExit != null) this.spriteExit.dispose();
    if(this.spritesetPlayer != null) this.spritesetPlayer.dispose();
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

