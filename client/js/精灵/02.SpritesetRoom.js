/** 
 * 精灵组-大厅房间
 * @param viewport  所属视窗
 * @param lobby    大厅数据
 */

function SpritesetRoom(viewport, lobby) {
    var _lobby = lobby;
    var spriteRooms = []; // <ISprite>
    var _viewport = viewport
    var _openColor = null; // <IColor>
    var _closeColor = null; // <IColor>
    var _rect1 = null; // <IRect>
    var _rect2 = null; // <IRect>

    this.update = function() {
        clearall();
        for(var i=0; i<_lobby.rooms.length; i++) {
            drawRoom(i);
        }
    };

    this.dispose = function() {
        for(var i=0; i<_lobby.rooms.length; i++) {
            if(_lobby.rooms[i]!=null) _lobby.rooms[i].dispose();
        }
    };

    var clearall = function() {
        for(var i=0; i<spriteRooms.length; i++) {
            if(spriteRooms[i]!=null) spriteRooms[i].clearBitmap();
        }
    };

    var drawRoom = function(i) {
        if(spriteRooms[i] == null) {
            var bitmap = new IBitmap.CBitmap(750,150);
            spriteRooms[i] = new ISprite(bitmap, viewport);
        }
        spriteRooms[i].drawRect(boardRect(), IColor.Black());
        var color = openColor();
        if(_lobby.rooms[i].state == 1) {
            color = closeColor();
        }
        spriteRooms[i].drawRect(contentRect(), color);
        spriteRooms[i].drawTextQ(_lobby.rooms[i].name, 27, 32,IColor.Black(),60);
        spriteRooms[i].drawTextQ(_lobby.rooms[i].name, 25, 30,IColor.White(),60);
        spriteRooms[i].x = i%2*860 + 30;
        spriteRooms[i].y = parseInt(i/2)*170;
    };

    var openColor = function() {
        if(_openColor==null) _openColor = new IColor(0,200,0,175);
        return _openColor;
    };

    var closeColor = function() {
        if(_closeColor==null) _closeColor = new IColor(200,0,0,175);
        return _closeColor;
    };

    var boardRect = function() {
        if(_rect1==null) _rect1 = new IRect(0,0,750,150);
        return _rect1;
    };

    var contentRect = function() {
        if(_rect2==null) _rect2 = new IRect(10,10,740,140);
        return _rect2;
    };
};
