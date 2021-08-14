/**
*  =====================================================
*  ARK-Framework
*  @author R01an
*  =====================================================
*  目录结构
*  --init 					入口
*  --root	通用				全局定义
*  --scenc	场景 			最小运行单元，管理各类资源，不处理业务，update()由框架调用
*  --window	窗体 			功能封装、定制，作为scene的内部模块使用，update()需手动调用
*  --sprite	精灵 			ISprite的继承，最小渲染单元，处理展示层业务，可绑定<game>对象，update()由框架调用
*    --spriteset 精灵集合 	精灵集合，一组关联精灵的展示处理，作为window或scene的内部模块使用，update()需手动调用
*  --logic	逻辑 			算法的封装，处理逻辑层业务，操作<game>对象，提供接口由外部进行输入，原则上不封装数据
*  --game	游戏数据 		运行时的数据结构，一般定义为全局对象，存放在RV.GameData中，可用dataId内联<data>
*  --data	数据库 			数据库静态数据结构，统一由RD加载管理，作为<game>的内部使用
*  --net	网络				管理各类socket，封装网络通讯
* 
* 重要说明1：由于使用原型链模型，必须保证父类在子类之前执行，故采用00-99编号
* 重要说明2：构造函数不允许加载ISprite及其子类！！！
* 
* 变量说明：
*     大写字母开头为常定义，对象new之后不可改变堆栈
*     _开头为私有成员，字母开头为公共成员
*     __开头为临时定义
* 
* IFAction API：
*     http://www.cedong.com.cn/document/
*/