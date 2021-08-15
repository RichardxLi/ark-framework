/**
 * 全局变量
 */
function RV(){};

// 系统数据
RV.System = {};
RV.System.Platform = "PC";
RV.System.Version = "EA 1.0.0"
RV.System.Width = 1920;
RV.System.Height = 1080;
RV.System.Debug = true;
RV.System.ServerIp = "139.196.187.232"
RV.System.HttpPort = 8080

// 缓存
RV.Cache = {};
RV.Cache.Picture = [];
RV.Cache.Default =  null;

// 游戏数据
RV.GameData = {};

// 标签
RV.Label = {
    Duke        : "DUKE",
    Assassin    : "ASS",
    Countess    : "CTS",
    Ambassador  : "AMB",
    Captain     : "CAP"
};

// 状态机
RV.State = {};
RV.State.GameInit = 1;
RV.State.GameSet = 2;
RV.State.TurnInit = 3;
RV.State.CommandSelect = 4;
RV.State.CommandSelect2 = 5;
RV.State.Block = 100;
RV.State.Challenge = 101;
