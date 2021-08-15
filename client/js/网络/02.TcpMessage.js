/**
 *  TCP消息定义
 *  函数名对应Protocol中的路由常量
 *  返回值为data结构
 */
function TcpMessage (){};

TcpMessage.RoomJoin = function() {
    return {name:""};
};

TcpMessage.RoomLeave = function() {
    return {name:""};
};

TcpMessage.RoomInfo = function() {
    return {players:[]};
};

TcpMessage.RoomClose = function() {
    return {};
};

TcpMessage.RoomRejoin = function() {
    return {};
};

TcpMessage.RoomStart = function() {
    return {};
};

TcpMessage.MainSetReq = function() {
    return {};
};

TcpMessage.MainSetRsp = function() {
    return {po:[], do:[]};
};

TcpMessage.MainCommand = function() {
    return {player:0, command:0, card:0};
};

TcpMessage.MainDo01 = function() {
    return {player:0, gold: 0, next:0};
};
