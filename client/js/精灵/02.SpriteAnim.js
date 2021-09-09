/**
 * 精灵-动画
 * @param viewport  所属视窗
 * @param id        预置动画id
 */
class SpriteAnim extends ISprite {
    constructor(viewport, id, rect, isSingle, endFuc) {
        let data = RD.Set.findResAnim(id);
        let animation = data.anims[0];
        let cofBitmap = new IBCof(RF.LoadCache("Animation/"+data.file), animation.x, animation.y, animation.width, animation.height);
        super(cofBitmap, viewport);
        this.yx = 0.5;
        this.yy = 0.5;
        this.z = 5000 + id;

        //资源数据
        this.data = data;
        //动画执行
        this.animation = animation;
        //动画图片
        this.cofBitmap = cofBitmap;
        //播放间隔
        this.animationWait = 0;
        this.animationIndex = -1;
        //是否执行完毕
        this.end = false;
        this.endDo = endFuc;
        //动画行为
        this.doList = [];
        //是否循环
        this.isSingle = isSingle;
        //相对判断矩形
        this.userRect = rect;

        this.pointUpdate();
        if(animation != null && animation.sound != "" && data.anims.length === 1){
            RV.GameData.Set.playSE("Audio/"+this.animation.sound, this.animation.volume);
        }
    }

    updateBase() {
        if(this.data.point.type === 0){
            this.pointUpdate();
        }
        this.end = !this.isAnim() && this.animationIndex >= this.data.anims.length - 1;
        if(this.end && this.isSingle && this.endDo != null){
            this.endDo();
            this.endDo = null;
        }
        if(this.data.anims.length > 1){
            this.frameUpdate();
        }
    }

    /**
     * 序列帧刷新
     */
    frameUpdate() {
        if(this.animationWait <= 0){
            this.animationIndex += 1;
            if(this.animationIndex >=  this.data.anims.length){
                if(!this.isSingle || this.isAnim()){
                    this.animationIndex = 0;
                }else{
                    return;
                }
            }
            let tempR = this.data.anims[this.animationIndex];
            this.cofBitmap.x = tempR.x;
            this.cofBitmap.y = tempR.y;
            this.cofBitmap.width = tempR.width;
            this.cofBitmap.height = tempR.height;
            this.animationWait = tempR.time;

            if(tempR.sound != "" && this.data.anims.length > 1){
                RV.GameData.Set.playSE("Audio/" + tempR.sound,tempR.volume);
            }

            for(let i = 0;i<this.data.actionList.length;i++){
                if(this.doList.indexOf(this.animationIndex + 1) < 0 && this.data.actionList[i].index === this.animationIndex + 1){
                    let action = this.data.actionList[i];
                    if(action.isOpactiy){
                        this.fadeTo(action.opacity / 255,action.opacityTime);
                    }
                    if(action.isZoom){
                        this.scaleTo(action.zoomX / 100,action.zoomY / 100,action.zoomTime);
                    }
                    if(action.isFlash){
                        this.flash(new IColor(action.color[0],action.color[1],action.color[2],action.color[3]),action.flashTime);
                    }
                    if(this.isSingle){
                        this.doList.push(this.animationIndex + 1);
                    }

                }

            }
        }else{
            this.animationWait -= 1;
        }
    }

    // 位置刷新
    pointUpdate() {
        let x = 0;
        let y = 0;
        let point = this.data.point;

        if(point.type === 0) { //相对坐标
            let rect = new IRect(1,1,1,1);
            if(this.userRect != null){
                rect = this.userRect;
            }
            if(this.data.anims.length > 0){
                let animation = this.data.anims[0];
                if(point.dir === 0){//中心
                    x = rect.x + (rect.width) / 2;
                    y = rect.y + (rect.height) / 2;
                }else if(point.dir === 1){//上
                    x = rect.x + (rect.width) / 2;
                    y = rect.y + (animation.height * this.zoomY);
                }else if(point.dir === 2){//下
                    x = rect.x + rect.width / 2;
                    y = rect.bottom - (animation.height * this.zoomY);
                }else if(point.dir === 3){//左
                    x = rect.x + (animation.width * this.zoomX);
                    y = rect.y + (rect.height) / 2;
                }else if(point.dir === 4){//右
                    x = rect.right - (animation.width * this.zoomX);
                    y = rect.y + (rect.height) / 2;
                }else if(point.dir === 5){//画面
                    x = RD.Project.gameWidth / 2;
                    y = RD.Project.gameHeight / 2;
                }
                if(this.animationIndex >= 0 && this.animationIndex < this.data.anims.length){
                    x += this.data.anims[this.animationIndex].dx;
                    y += this.data.anims[this.animationIndex].dy;
                }else if(this.animationIndex == -1 && this.data.anims.length > 0){
                    x += this.data.anims[0].dx;
                    y += this.data.anims[0].dy;
                }
            }
        } else { //绝对坐标
            x = point.x;
            y = point.y;
        }
        this.x = x;
        this.y = y;
    }
}