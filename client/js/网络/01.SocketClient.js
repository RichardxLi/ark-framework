/**
 * 客户端连接
 */ 
function SocketClient() {
    // <ISocket>
    var _socket = null;
    
    this.guid = ""; // 群组唯一编号(游戏id)
    this.uuid = ""; // 用户唯一编号(用户名)
    this.isHost = false;
    this.hostUUid = "";
    this.hbId = 0; // http心跳-Interval ID

    this.dialTcp = function(ip, port) {
        if(_socket != null) {
            _socket.closeSocket();
        }
        _socket = new ISocket();
        _socket.startClientSocket(ip,port);
        _socket.setCallMessage("ISocketClient.onRecv");
    };

    this.closeTcp = function() {
        if(_socket != null) {
            _socket.closeSocket();
            _socket = null;
        }
    }

    this.tcpSend = function(type, xuid, router, data) {
        if(_socket == null) {
            return
        }
        var str = JSON.stringify(data);
        var str2 = str.replace(/\"/gm, "\\\"");
        _socket.sendToServer(type, xuid, router, str2);
    };

    this.onRecv = function(type, xuid, router, data){
        if(type == Protocol.Type.System) {
            // 系统消息
            return;
        }
        if(type == Protocol.Type.Group && (xuid=="" || xuid!=this.guid)) {
            // 非所在组消息，自动丢弃
            return;
        }
        if(type == Protocol.Type.Private && (xuid=="" || xuid!=this.uuid)) {
            // 非自己消息，自动丢弃
            return;
        }
        var obj = JSON.parse(data);
        IVal.scene.netHandler(router, obj);
    };

    // 广播给群组
    this.sendGroup = function(router, data) {
        if(this.guid == "") {
            return;
        }
        this.tcpSend(Protocol.Type.Group, this.guid, router, data)
    };

    // 发送给主机
    this.sendHost = function(router, data) {
        if(this.hostUUid == "") {
            return;
        }
        this.tcpSend(Protocol.Type.Private, this.hostUUid, router, data);
    }

    // 创建群组
    this.createGroup = function(name) {
        url = "http://"+RV.System.ServerIp+":"+RV.System.HttpPort+"/group/create?name="+name+"&uuid="+this.uuid
        resp = IWeb.getUrl(url)
        var obj = JSON.parse(resp);
        if(obj==null) return false;
        if(obj.code != Protocol.Http.OK) return false;
        this.guid = obj.guid;
        this.isHost = true;
        this.dialTcp(RV.System.ServerIp, obj.port);
        this.stopHeartbeat();
        this.hbId = RF.SetInterval(heartbeat, 15);
        return true;
    };

    // 停止http心跳
    this.stopHeartbeat = function() {
        RF.ClearInterval(this.hbId);
    };

    var heartbeat = function() {
        url = "http://"+RV.System.ServerIp+":"+RV.System.HttpPort+"/group/heartbeat?guid="+ISocketClient.guid;
        IWeb.getUrl(url);
    };

    // 查询群组
    this.listGroup = function() {
        url = "http://"+RV.System.ServerIp+":"+RV.System.HttpPort+"/group/list"
        resp = IWeb.getUrl(url)
        var obj = JSON.parse(resp);
        if(obj==null) return false;
        if(obj.code != Protocol.Http.OK) return false;
        return obj.list;
    };

    // 删除群组
    this.freeGroup = function() {
        this.stopHeartbeat();
        this.closeTcp();
        url = "http://"+RV.System.ServerIp+":"+RV.System.HttpPort+"/group/free?guid="+this.guid;
        IWeb.getUrl(url);
        this.guid = 0;
    };

    // 加入群组
    this.joinGroup = function(guid) {
        url = "http://"+RV.System.ServerIp+":"+RV.System.HttpPort+"/group/join?guid="+guid;
        resp = IWeb.getUrl(url);
        var obj = JSON.parse(resp);
        if(obj==null) return false;
        if(obj.code != Protocol.Http.OK) return false;
        this.guid = guid;
        this.dialTcp(RV.System.ServerIp, obj.port);
        if(obj.host==this.uuid) {
            // 主机连回
            this.isHost = true;
            RV.GameData.User.isHost = true;
            this.stopHeartbeat();
            this.hbId = RF.SetInterval(heartbeat, 15);
        } else {
            this.isHost = false;
            this.hostUUid = obj.host;
        }
        return true;
    };

    // 设置群组参数
    this.setGroup = function(state) {
        url = "http://"+RV.System.ServerIp+":"+RV.System.HttpPort+"/group/join?guid="+this.guid+"&state="+state;
        resp = IWeb.getUrl(url);
    };

    // 用户登录
    this.login = function(name, passwd) {
        url = "http://"+RV.System.ServerIp+":"+RV.System.HttpPort+"/group/join?name="+this.name+"&passwd="+passwd;
        resp = IWeb.getUrl(url);
        var obj = JSON.parse(resp);
        if(obj==null) return false;
        if(obj.code != Protocol.Http.OK) return false;
        this.uuid = name;
        return true;
    };
};

ISocketClient = new SocketClient();
