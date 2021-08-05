/** 
 * 精灵组-房间玩家
 * @param viewport  所属视窗
 * @param room      房间数据
 */

function SpritesetRoomPlayer(viewport, room) {
    var _room = room;
    var _spritePlayers = []; // <ISprite>
    var _viewport = viewport;
    var _rect1 = null; // <IRect>
    var _rect2 = null; // <IRect>

    this.players = function() {
        return _spritePlayers;
    }

    this.player = function(i) {
        return _spritePlayers[i];
    }

    this.update = function() {
        clearall();
        for(var i=0; i<_room.max(); i++) {
            drawPlayer(i);
        }
    };

    this.dispose = function() {
        for(var i=0; i<_spritePlayers.length; i++) {
            if(_spritePlayers[i]!=null) _spritePlayers[i].dispose();
        }
    };

    var clearall = function() {
        for(var i=0; i<_spritePlayers.length; i++) {
            if(_spritePlayers[i]!=null) _spritePlayers[i].clearBitmap();
        }
    };

    var drawPlayer = function(i) {
        if(_spritePlayers[i] == null) {
            var bitmap = new IBitmap.CBitmap(400,150);
            _spritePlayers[i] = new ISprite(bitmap, viewport);
        }
        _spritePlayers[i].drawRect(boardRect(), IColor.Black());
        _spritePlayers[i].drawRect(contentRect(), IColor.White());
        _spritePlayers[i].x = i%3*450;
        _spritePlayers[i].y = parseInt(i/3)*250;
        if(_room.players[i] !=null) {
            _spritePlayers[i].drawTextQ(_room.players[i].name, 27, 32,IColor.Black(),60);
            _spritePlayers[i].drawTextQ(_room.players[i].name, 25, 30,IColor.Blue(),60);
        }
    };

    var boardRect = function() {
        if(_rect1==null) _rect1 = new IRect(0,0,400,150);
        return _rect1;
    };

    var contentRect = function() {
        if(_rect2==null) _rect2 = new IRect(10,10,390,140);
        return _rect2;
    };
};
