# Ark-Framework
IFAction + Golang Server

多人联机框架

___

## Server

由于暂不了解IFAction封装的TCP包头协议， 采用HTTP注册服务+TCP广播服务架构。

广播服务对于任意客户端请求做全量广播转发(包括请求者)，无其他处理。

注册服务内部管理组群(Group)数据，对外提供创建、加入、离开等接口，
创建新组群时，启动一个TCP广播服务，监听独立端口，负责该组消息广播。

___

## Client

基于IFAction引擎，总体分为数据层、逻辑层、展示层，具体结构参考*client/js/帮助文档.js*

代码以数据层驱动，逻辑层和展示层互不侵染。
逻辑模块提供游戏算法，数据模块提供数据结构及基本操作，展示模块处理图形渲染，场景作为最小执行单元。

网络层连接封装在SocketClient中，实例化ISocketClient作全局唯一使用。
后续参照TCP广播服务，加入SocketServer，作局域网服务端使用。

___

## TCP协议

由于服务端仅作广播，客户端与客户端直接在应用层可视为函数请求与回调，函数声明如下

*function(type, xuid, router, data)*

type - 消息类型
+ Protocol.Type.System = 0;  // 系统消息(预留)
+ Protocol.Type.Global = 1;  // 全局消息
+ Protocol.Type.Group = 2;   // 群组消息
+ Protocol.Type.Private = 3; // 私聊消息

xuid - 广播编号 客户端收到非对应编号消息时，直接丢弃
+ 组群消息，对应guid，标识分组
+ 私聊消息，对应uuid，标识目标

router - 业务路由 通常对应logic类名+函数名

data - json结构，数据对象，业务层根据router约定