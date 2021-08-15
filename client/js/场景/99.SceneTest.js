/** 
 * 调试用
 */
function SceneTest() {
    var viewport1 = new IViewport(100,100,1000,400);
    viewport1.z = 100;
    var bitmap1 = new IBitmap.CBitmap(1000, 400);
    var sprite1 = new ISprite(bitmap1, viewport1);
    sprite1.drawRect(sprite1.GetRect(), IColor.White());

    var viewport2 = new IViewport(0,0,100,100);
    viewport2.z = 101;
    var bitmap2 = new IBitmap.CBitmap(100, 100);
    var sprite2 = new ISprite(bitmap2, viewport2);
    sprite2.drawRect(sprite2.GetRect(), IColor.Red());

    this.update = function() {
        if(sprite2.isSelected() && IInput.up) {
            IInput.up = false;
            log(shuffle(10));
        }
    };

    // 乱序洗牌算法
    var shuffle = function(n) {
        var list = [];
        if(n<=0) return list;
        
        for(var i=0; i<n; i++) {
            list[i] = i;
        }
        for(var i=n-1; i>0; i--) {
            var rand = Math.floor(Math.random()*i);
            var t = list[rand];
            list[rand] = list[i];
            list[i] = t;
        }
        return list;
    }
};
