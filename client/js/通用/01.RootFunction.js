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
        RV.Default = new IBitmap.CBitmap(1,1);
    }
    return RV.Default;
};


/**
 *  加载数据库
 */ 
RF.LoadDatabase = function() {
    RD.LoadObjects();
};

/**
 * 初始化游戏数据
 */ 
RF.InitGameData = function() {
};

/**
 * 周期定时器
 */
RF._sIntervals = [];
RF._intervalId = 1;
RF.SetInterval = function(code, sec) {
    RF._sIntervals[RF._intervalId] = new ISprite(RF.DefaultBitmap());
    RF._ir(code, sec, RF._intervalId);
    return RF._intervalId++;
}

RF._ir = function(code, sec, id) {
    RF._sIntervals[id].slideTo(0, 0, sec*IVal.FPS);
    RF._sIntervals[id].setOnEndSlide(function(){
        code();
        RF.intervalRecursion(code, sec, id);
    });
};

RF.ClearInterval = function(id) {
    if(RF._sIntervals[id] != null) {
        RF._sIntervals[id].disposeMin();
    }
};
