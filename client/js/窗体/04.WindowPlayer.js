/**
* 玩家窗体
*/ 
function WindowPlayer(x, y) {
	 WindowBase.call(this, x, y, 1440, 700);
     this.standardPadding = 0;
     this._ssPlayers = []; // <SpritesetPlayer>
};
WindowPlayer.prototype = new WindowBase();
WindowPlayer.prototype.constructor = WindowPlayer;
//================================
// 初始化
WindowPlayer.prototype.init = function() {
    WindowBase.prototype.init.call(this, true);
};

WindowPlayer.prototype.createPlayers = function() {
    for(var i=0; i<RV.GameData.Players.total(); i++) {
        if(this._ssPlayers[i] != null) continue;
        var viewport = new IViewport(i%3*480+this.x, parseInt(i/3)*350+this.y, 440, 280, null);
        viewport.z = this.z+2;
        this._ssPlayers[i] = new SpritesetPlayer(viewport, RV.GameData.Players.get(i+1));
    }
};

//---------------------------------
// 析构
WindowPlayer.prototype.dispose = function(){
    WindowBase.prototype.dispose.call(this);
    for(var i=0; i<this._ssPlayers.length; i++) {
        if(this._ssPlayers[i]!=null) this._ssPlayers[i].dispose();
    }
};
//---------------------------------
// 主循环
WindowPlayer.prototype.update = function(){
    WindowBase.prototype.update.call(this);
    for(var i=0; i<this._ssPlayers.length; i++) {
        if(this._ssPlayers[i]!=null) this._ssPlayers[i].update();
    }

    if(this.active==false) return;
    // 点击事件
    for(var i=0; i<this._ssPlayers.length; i++) {
        for(var j=0; j<this._ssPlayers[i].cards().length; j++) {
            var sc = this._ssPlayers[i].card(j);
            if(sc.isSelected() && IInput.up) {
                IInput.up = false;
                RV.GameData.Temp.selectCard = sc.cardIndex();
                RV.GameData.Temp.waitInput = false;
                RV.GameData.Cards.clearHint();
            }
        }
    }
};
