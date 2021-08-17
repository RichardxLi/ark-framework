/**
 * 大厅逻辑处理
 */ 
function LogicLobby() {
	// 初始化
	this.init = function() {
		RV.GameData.User.inRoom = false;
		RV.GameData.User.isHost = false;
		RV.GameData.User.isVisitor = false;
		this.refresh();
	};

	// 创建房间
	this.create = function() {
		if(RV.GameData.Lobby.loading || RV.GameData.User.inRoom) {
			// todo: 提示框
			return;
		}
		RV.GameData.Room.name = RV.GameData.User.name+"的游戏房间"
		var ret = ISocketClient.createGroup(RV.GameData.Room.name);
		if(ret==false) {
			// todo: 提示框
			return;
		}
		RV.GameData.User.inRoom = true;
		RV.GameData.User.isHost = true;
		RV.GameData.User.isVisitor = false;
		IVal.scene.goto(new SceneRoom());
	};

	// 刷新
	this.refresh = function() {
		if(RV.GameData.Lobby.loading) {
			return;
		}
		RV.GameData.Lobby.loading = true;
		var rooms = ISocketClient.listGroup();
		if(rooms==false) {
			RV.GameData.Lobby.loading = false;
			// todo: 提示框
			RV.GameData.Lobby.rooms = [];
			return;
		}
		RV.GameData.Lobby.clear();
		for(var i=0;i<rooms.length;i++) {
			var v = rooms[i];
			room = new GameLobbyRoom(i, v.guid, v.name, v.state);
			RV.GameData.Lobby.rooms[i] = room;
		}
		RV.GameData.Lobby.loading = false;
	};


	// 加入房间
	this.join = function(i) {
		if(RV.GameData.Lobby.loading || RV.GameData.User.inRoom) {
			// todo: 提示框
			return;
		}
		var r = RV.GameData.Lobby.rooms[i];
		var ret = ISocketClient.joinGroup(r.guid);
		if(ret==false) {
			// todo: 提示框
			return;
		}
		RV.GameData.User.inRoom = true;
		RV.GameData.Room.name = r.name;
		IVal.scene.goto(new SceneRoom());
	};
};

