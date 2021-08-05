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