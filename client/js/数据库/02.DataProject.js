/**
 * 数据库-工程数据
 */
class DataProject {
    constructor() {
        //工程名称
        this.name = "";
        //工程唯一Key
        this.key = "";
        //工程数据版本号
        this.code = 0;
        //工程分辨率·宽度
        this.gameWidth = 960;
        //工程分辨率·高度
        this.gameHeight = 540;
        //工程游戏类型 0、ACT 1、ARPG 2、AVG
        this.gameType = 0;
        //起始地图编号
        this.startId = 1;
        //工程所属用户
        this.owner = "";
        //工程是否被锁定
        this.isLock = false;
    }

    load(onload) {
        let file = "Game.ifaction";
        let rd = new IRWFile(file);
        let ms = rd.readMS(8);
        if(ms == "IFACTION"){
            this.name = rd.readString();
            this.key = rd.readString();
            this.code = rd.readInt();rd.readInt();
            this.gameWidth = rd.readInt();
            this.gameHeight = rd.readInt();
            this.gameType = rd.readInt();
            this.startId = rd.readInt();rd.readInt();rd.readInt();
            this.owner = rd.readString();
            this.isLock = rd.readBool();
            onload();
        }
    }
}