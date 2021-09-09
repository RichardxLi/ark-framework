/**
 * 数据库-项目设置
 * 架构基于AVG框架
 */
class DataSet {
    constructor() {
        //设置数据版本号
        this.code = 0;
        //总设
        this.setAll = null;
        //CG鉴赏
        this.setCG = [];
        //BGM鉴赏
        this.setBGM = [];
        //动画
        this.setAnim = [];
        //通用触发器
        this.setEvent = [];
    };

    // onload 加载完成回调
    load(onload) {
        let rd = new IRWFile("Setting.ifset");
        let _sf = this;
        rd.onload = function(){
            _sf.code = rd.readShort();
            _sf.setAll = new DSetAll(rd);
        }
        let length = rd.readInt();
        for(let i = 0;i<length;i++){
            let temp = new DSetCG(rd);
            _sf.setCG[temp.id] = temp;
        }
        length = rd.readInt();
        for(let i = 0;i<length;i++){
            let temp = new DSetBGM(rd);
            _sf.setBGM[temp.id] = temp;
        }
        length = rd.readInt();
        for(let i = 0;i<length;i++){
            let type = rd.readShort();
            if(type == -3310){
                let temp = new DResAnimFrame(rd);
                _sf.setAnim[temp.id] = temp;
            }else if(type == -2801){
                let temp = new DResAnimParticle(rd);
                _sf.setAnim[temp.id] = temp;
            }
        }
        length = rd.readInt();
        for(let i = 0;i<length;i++){
            let temp = new DSetEvent(rd);
            _sf.setEvent[temp.id] = temp;
        }
        onload();
    };

    /**
     * 寻找动画配置数据
     * @param id
     * @returns DResAnimFrame
     */
    findResAnim(id) {
        return this.setAnim[id];
    }
}

/**
 * Created by 七夕小雨 on 2019/1/8.
 * 设置·总设数据结构
 */
function DSetAll(rd){

    //按键映射
    this.key = new Array(30);

    rd.readShort();rd.readShort();
    rd.readShort();rd.readShort();
    rd.readShort();
    rd.readBool();

    //标题文件
    this.titleFile = rd.readString();

    new DSetSound(rd);rd.readBool();
    rd.readShort();rd.readShort();new DSetSound(rd);
    rd.readBool();rd.readShort();rd.readShort();rd.readShort();
    rd.readBool();rd.readShort();


    //音效相关
    this.enterSound = new DSetSound(rd);
    this.cancelSound = new DSetSound(rd);
    this.selectSound = new DSetSound(rd);
    new DSetSound(rd);new DSetSound(rd);

    for(var i = 0; i < 30;i++){
        this.key[i] = rd.readShort();
    }

    this.fontSize = rd.readInt();
    this.fontColor = new DColor(rd);

    this.talkUIid = rd.readInt();
    this.MsgUIid = rd.readInt();
    this.MsgIfid = rd.readInt();
    this.Menuid = rd.readInt();
}

/**
 * Created by 七夕小雨 on 2020/7/15.
 */
function DSetBGM(rd){
    this.id = rd.readInt();
    this.name = rd.readString();
    this.text = rd.readString();
    this.cover = rd.readString();
    this.music = rd.readString();
    this.speed = rd.readInt();
}

/**
 * Created by 七夕小雨 on 2020/7/15.
 */
function DSetCG(rd){
    this.id = rd.readInt();
    this.name = rd.readString();
    this.text = rd.readString();
    this.cover = rd.readString();
    this.type = rd.readInt();
    this.pic = rd.readString();
    this.mapId = rd.readInt();
    this.autoTimes = rd.readInt();
}

/**
 * Created by 七夕小雨 on 2019/1/8.
 * 设置·公共触发器
 */
function DSetEvent(rd){
    this.id = rd.readInt();
    this.name = rd.readString();

    //执行逻辑
    this.logic = new DIf(rd);
    //是否同步执行
    this.isParallel = rd.readBool();
    //是否自动执行
    this.autoRun = rd.readBool();

    //触发器内容
    this.events = [];

    var length = rd.readInt();
    for(var i = 0;i<length;i++){
        var et = new DEvent();
        et.read(rd);
        this.events.push(et);
    }

    /**
     * 执行触发器
     */
    this.doEvent = function(){
        if(this.logic.result()){
            //释放在地图的自动执行并行通用触发器
            if(this.autoRun && this.isParallel && !RF.FindOtherEvent("public_event_" + this.id)){
                RF.AddOtherEvent(this.events , "public_event_" + this.id , -1);
            }else if(!this.autoRun && this.isParallel){//通过物品、敌人死亡，怪物，或者在通用触发器中间执行的触发器
                RF.AddOtherEvent(this.events , null , -1);
            }else if(!this.isParallel){//合并在主循环执行的
                RV.InterpreterMain.addEvents(this.events);
            }
        }
    }
}

/**
 * Created by 七夕小雨 on 2019/3/14.
 * 音效音乐数据结构
 */
function DSetSound(rd){
    //文件
    this.file = "";
    //音量
    this.volume = 80;

    if(rd != null){
        this.file = rd.readString();
        this.volume = rd.readShort();
    }

    /**
     * 播放
     * @param type 0、播放BGM 1、播放BGS 2、播放SE
     */
    this.play = function(type){
        if(this.file == "") return;
        if(type == null) type = 2;
        if(type == 0){
            RV.GameData.Set.playBGM("Audio/" + this.file , this.volume);
        }else if(type == 1){
            RV.GameData.Set.playBGS("Audio/" + this.file , this.volume);
        }else if(type == 2){
            RV.GameData.Set.playSE("Audio/" + this.file , this.volume);
        }
    }
}

/**
 * Created by 七夕小雨 on 2019/1/4.
 * 地图数据
 */
function DStory(rd){
    var _sf = this;
    //地图ID
    this.id = 0;
    //地图名称
    this.name = "";
    //是否是指令模式
    this.isHard = false;
    //地图的父ID（游戏无效）
    this.fid = -1;
    //队列排序
    this.order = 0;
    //事件集合
    this.events = [];
    //区域集合
    this.regions = [];

    //读取数据
    this.id = rd.readShort();
    this.name = rd.readString();
    this.isHard = rd.readBool();
    this.fid = rd.readShort();
    this.order = rd.readShort();

    var length = rd.readInt();
    if(this.isHard){
        for(var i = 0;i<length;i++){
            var e = new DEvent();
            e.read(rd);
            this.events.push(e);
        }
    }else{
        for(i = 0;i<length;i++){
            e = new DRegion(null);
            e.read(rd);
            this.regions.push(e);
        }
        regionsToEvents();
    }


    function regionsToEvents(){
        for(var i = 0;i< _sf.regions.length;i++){
            _sf.events = _sf.events.concat(regionOne(_sf.regions[i], null));
        }
    }

    function regionOne(region,event){
        var events = [];
        if(region.events.length > 0){
            events = events.concat(region.events);
        }else{
            var e = new DEvent(event);
            e.code = region.code;
            e.args = region.args;
            e.events = [];
            for(var i = 0;i<region.regions.length;i++){
                e.events = e.events.concat(regionOne(region.regions[i],e));
            }
            events.push(e);
        }
        return events;
    }
}

/**
 * Created by 七夕小雨 on 2019/1/4.
 * 变量的数据结构
 */
function DValue(rd){
    //变量ID
    this.id = rd.readInt();
    //变量名称
    this.name = rd.readString();
    //变量类型
    this.type = rd.readInt();
    //变量默认值
    this.defValue = rd.readString();
    //是否是多周目变量
    this.staticValue = rd.readBool();
}

/**
 * Created by 七夕小雨 on 2019/3/14.
 * 关键帧动画
 */
function DResAnimFrame(rd){
    //动画组
    this.anims = [];
    //关键帧动作集合
    this.actionList = [];

    //动画ID
    this.id = rd.readShort();
    //动画名称
    this.name = rd.readString();
    //动画说明
    this.msg = rd.readString();
    //动画出现位置
    this.point = new DResAnimPoint(rd);
    //动画文件
    this.file = rd.readString();

    //读入动画组与关键帧动作合计
    var length = rd.readInt();
    for(var i = 0;i<length;i++){
        this.anims.push(new DAnimRect(rd));
    }

    length = rd.readInt();
    for(i = 0;i<length;i++){
        this.actionList.push(new DResAnimFrameAction(rd));
    }
}

/**
 * Created by 七夕小雨 on 2019/3/14.
 * 关键帧动画动作数据结构
 */
function DResAnimFrameAction(rd){
    //闪烁颜色
    this.color = [0,0,0,0];
    //角色闪烁颜色
    this.actorColor = [0,0,0,0];

    //帧数
    this.index = rd.readShort();
    //是否存在判定区域
    this.isAtk = rd.readBool();
    //区域X
    this.AtkX = rd.readShort();
    //区域Y
    this.AtkY = rd.readShort();
    //区域宽度
    this.AtkWidth = rd.readShort();
    //区域高度
    this.AtkHeight = rd.readShort();
    //是否闪烁
    this.isFlash = rd.readBool();
    this.color[0] = rd.readShort();
    this.color[1] = rd.readShort();
    this.color[2] = rd.readShort();
    this.color[3] = rd.readShort();

    //闪烁完成时间
    this.flashTime = rd.readShort();
    //是否透明
    this.isOpactiy = rd.readBool();
    //不透明度
    this.opacity = rd.readShort();
    //透明完成时间
    this.opacityTime = rd.readShort();

    //是否缩放
    this.isZoom = rd.readBool();
    //缩放X坐标
    this.zoomX = rd.readShort();
    //缩放Y坐标
    this.zoomY = rd.readShort();
    //缩放完成时间
    this.zoomTime = rd.readShort();
    //是否角色闪烁
    this.isActorFlash = rd.readBool();
    this.actorColor[0] = rd.readShort();
    this.actorColor[1] = rd.readShort();
    this.actorColor[2] = rd.readShort();
    this.actorColor[3] = rd.readShort();
    //角色闪烁完成时间
    this.actorFlashTime = rd.readShort();
}

/**
 * Created by 七夕小雨 on 2019/3/14.
 * 粒子动画数据结构
 */
function DResAnimParticle(rd){
    //粒子文件组
    this.files = [];
    //动画ID
    this.id = rd.readShort();
    //动画名称
    this.name = rd.readString();
    //动画说明
    this.msg = rd.readString();
    //动画出现位置
    this.point = new DResAnimPoint(rd);

    //发射类型
    this.launchType = rd.readShort();
    //发射半径
    this.radius = rd.readShort();
    //是否拥有重力
    this.isGravity = rd.readBool();
    //区域宽度
    this.width = rd.readShort();
    //区域高度
    this.height = rd.readShort();
    //发射距离
    this.distance = rd.readShort();
    //发射方向
    this.dir = rd.readShort();
    //衰弱时间
    this.time = rd.readShort();
    //粒子数量
    this.number = rd.readShort();
    //储存结构文件
    this.file = rd.readString();

    var length = rd.readInt();
    for(var i = 0;i<length;i++){
        this.files.push(rd.readString());
    }
    //粒子音效
    this.sound = new DSetSound(rd);
}

/**
 * Created by 七夕小雨 on 2019/3/14.
 * 动画显示位置数据结构
 */
function DResAnimPoint(rd){
    //位置类型，相对、绝对
    this.type = rd.readShort();
    //X坐标
    this.x = rd.readShort();
    //Y坐标
    this.y = rd.readShort();
    //相对方向
    this.dir = rd.readShort();
}

/**
 * Created by 七夕小雨 on 2019/1/7.
 * 动画组单个动画帧数据结构
 */
function DAnimRect(rd){
    var _sf = this;
    //相对原图X
    this.x = 0;
    //相对原图Y
    this.y = 0;
    //裁剪宽度
    this.width = 0;
    //裁剪高度
    this.height = 0;
    //偏移X
    this.dx = 0;
    //偏移Y
    this.dy = 0;
    //等待时间
    this.time = 0;
    //是否工具判定
    this.effective = false;
    //音效
    this.sound = "";
    //以你下音量
    this.volume = 80;
    //发射点
    this.points = [];
    //读取数据
    this.x = rd.readInt();
    this.y = rd.readInt();
    this.width = rd.readInt();
    this.height = rd.readInt();
    this.dx = rd.readInt();
    this.dy = rd.readInt();
    this.time = rd.readInt();

    this.effective = rd.readBool();

    var length = rd.readInt();
    for(var i = 0;i<length;i++){
        this.points.push(new APoint(rd));
    }

    this.sound = rd.readString();
    this.volume = rd.readShort();

    this.getRect = function(){
        return new IRect(_sf.x,_sf.y , _sf.x + _sf.width, _sf.y + _sf.height);
    };

    this.collisionRect = new ARect(rd);

}
/**
 * 动画帧发射位置
 */
function APoint(rd){
    this.x = 0;
    this.y = 0;

    this.x = rd.readInt();
    this.y = rd.readInt();
}
/**
 * 动画帧碰撞矩形
 */
function ARect(rd){
    //自动检测碰撞局域
    this.auto = rd.readBool();
    this.x = rd.readInt();
    this.y = rd.readInt();
    this.width = rd.readInt();
    this.height = rd.readInt();
}
