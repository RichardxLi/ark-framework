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

TcpMessage.MainInitReq = function() {
    return {};
};

TcpMessage.MainSetRsp = function() {
    return {po:[], do:[]};
};

TcpMessage.MainCommandReq = function() {
    return {player:0, command:0, card:0};
};

TcpMessage.MainProcess100 = function() {
    return {};
};

TcpMessage.MainProcess300 = function() {
    return {card:0};
};

TcpMessage.MainChallengeReq = function() {
    return {t:0, l:"", c:0};
};

TcpMessage.MainChallengeRsq = function() {
    return {ok:false};
};