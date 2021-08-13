/**
 * 通用函数
 */
function RF(){}

/**
 * 读取图片
 * @param path 图片地址
 */
RF.LoadBitmap = function(path){
    return IBitmap.WBitmap("Graphics/Picture/" + path);
};

/**
 * 读取缓存
 * @param path 图片地址
 * @param func 读取完毕后回调
 * @param tag 读取过程中tag
 * @returns {*} 缓存中图片
 */
RF.LoadCache = function(path,func,tag){
    if(RV.Cache.Picture[path] == null){
        RV.Cache.Picture[path] = RF.LoadBitmap(path);
        RV.Cache.Picture[path].loadTexture();
        if(RV.Cache.Picture[path].complete){
            if(func != null) func(RV.Cache.Picture[path],tag)
        }else if(func != null){
            RV.Cache.Picture[path].onload = function(){
                func(RV.Cache.Picture[path],tag);
            };
            RV.Cache.Picture[path].onerror = function(){
                func(null,tag);
            };
        }
        return RV.Cache.Picture[path];
    }else{
        if(func != null){
            func(RV.Cache.Picture[path],tag);
        }
        return RV.Cache.Picture[path];
    }
};

/**
 * 空位图缓存
 * 用于初始化精灵
 */ 
RF.DefaultBitmap = function() {
    if(RV.Cache.Default==null) {
        RV.Cache.Default = new IBitmap.CBitmap(1,1);
    }
    return RV.Cache.Default;
};


/**
 *  加载数据库
 */ 
RF.LoadDatabase = function() {
    RD.LoadObjects();
    RD.LoadCards();
};

/**
 * 初始化游戏数据
 */ 
RF.InitGameData = function() {
    RV.GameData.User = new GameUser();
    RV.GameData.Lobby = new GameLobby();
    RV.GameData.Room = new GameRoom();
    RV.GameData.Cards = new GameCards();
    RV.GameData.Players = new GamePlayers();
};

/**
 * 周期定时器
 */
RF.IntervalSprite = [];
RF.IntervalId = 1;
RF.SetInterval = function(code, sec) {
    RF.IntervalSprite[RF.IntervalId] = new ISprite(RF.DefaultBitmap());
    RF.intervalRecursion(code, sec, RF.IntervalId);
    return RF.IntervalId++;
}

RF.intervalRecursion = function(code, sec, id) {
    RF.IntervalSprite[id].slideTo(0, 0, sec*IVal.FPS);
    RF.IntervalSprite[id].setOnEndSlide(function(){
        code();
        RF.intervalRecursion(code, sec, id);
    });
};

RF.ClearInterval = function(id) {
    if(RF.IntervalSprite[id] != null) {
        RF.IntervalSprite[id].disposeMin();
    }
};
