/**
 * 主机房间逻辑
 */ 
function LogicRoomHost() {
	// 初始化
	this.init = function () {
		RV.GameData.Room.clear();
		RV.GameData.Room.addPlayer(RV.GameData.User.name);
		ISocketClient.sendGroup(Protocol.Tcp.RoomRejoin, TcpMessage.RoomRejoin()); // 通知客户端重连
	};

	// 退出
	this.exit = function() {
		ISocketClient.sendGroup(Protocol.Tcp.RoomClose, TcpMessage.RoomClose()); // 通知客户端退出
		ISocketClient.freeGroup();
		IVal.scene.goto(new SceneLobby());
	};

	// 开始游戏
	this.start = function() {
		IVal.scene.goto(new SceneMain());
		ISocketClient.sendGroup(Protocol.Tcp.RoomStart, TcpMessage.RoomStart());
	};

	// 玩家加入处理
	this.joinHandler = function(data) {
		RV.GameData.Room.addPlayer(data.name);
		sendInfo();
	};

	// 玩家离开处理
	this.leaveHandler = function(data) {
		RV.GameData.Room.delPlayer(data.name);
		sendInfo();
	};

	// 广播房间信息
	var sendInfo = function() {
		var data = TcpMessage.RoomInfo();
		data.players = RV.GameData.Room.players;
		ISocketClient.sendGroup(Protocol.Tcp.RoomInfo, data);
	};

	// 以下仅声明
	this.infoHandler = function(data) {};
	this.closeHandler = function(data) {};
	this.rejoinHandler = function(data) {};
	this.startHandler = function(data) {};
};


/**
 * 客机房间逻辑
 */ 
function LogicRoomGuest() {
	// 初始化
	this.init = function () {
		RV.GameData.Room.loading = true;
		var data = TcpMessage.RoomJoin();
		data.name = RV.GameData.User.name;
		ISocketClient.sendHost(Protocol.Tcp.RoomJoin, data);
	};

	// 退出
	this.exit = function() {
		var data = TcpMessage.RoomLeave();
		data.name = RV.GameData.User.name;
		ISocketClient.sendHost(Protocol.Tcp.RoomLeave, data);
		IVal.scene.goto(new SceneLobby());
	};

	// 房间信息处理
	this.infoHandler = function(data) {
		RV.GameData.Room.players = data.players
		RV.GameData.Room.loading = false;
		for(var i=0; i<RV.GameData.Room.players.length; i++) {
			if(RV.GameData.Room.players[i].name == RV.GameData.User.name) {
				return
			}
		}
		RV.GameData.User.isVisitor = true;
	};

	// 房间关闭处理
	this.closeHandler = function(data) {
		// todo: 提示框
		IVal.scene.goto(new SceneLobby());
	};

	// 主机重连处理
	this.rejoinHandler = function(data) {
		if(RV.GameData.User.isVisitor) {
			return
		}
		var data = TcpMessage.RoomJoin();
		data.name = RV.GameData.User.name;
		ISocketClient.sendHost(Protocol.Tcp.RoomJoin, data);
	};

	// 开始游戏
	this.startHandler = function(data) {
		IVal.scene.goto(new SceneMain());
	};

	// 以下仅声明
	this.start = function() {};
	this.joinHandler = function(data) {};
	this.leaveHandler = function(data) {};
};
