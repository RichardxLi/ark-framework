/**
 *  网络协议
 */
function Protocol (){};

// 消息类型
Protocol.Type = {};
Protocol.Type.System = 0; // 系统消息(预留)
Protocol.Type.Global = 1; // 全局消息
Protocol.Type.Group = 2; // 群组消息
Protocol.Type.Private = 3; // 私聊消息

// HTTP协议
Protocol.Http = {};
Protocol.Http.OK = 100;

// TCP路由
Protocol.Tcp = {};
Protocol.Tcp.RoomJoin = "room.join";
Protocol.Tcp.RoomLeave = "room.leave";
Protocol.Tcp.RoomInfo = "room.info";
Protocol.Tcp.RoomRejoin = "room.rejoin";
Protocol.Tcp.RoomClose = "room.close";
Protocol.Tcp.RoomStart = "room.start";
Protocol.Tcp.MainSetReq = "main.gameset";
Protocol.Tcp.MainSetRsp = "handler.gameset";
Protocol.Tcp.MainCommand = "main.command";
Protocol.Tcp.MainDo01 = "handler.do01";

