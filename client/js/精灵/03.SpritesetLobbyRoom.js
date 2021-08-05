/** 
 * 精灵组-大厅房间
 * @param viewport  所属视窗
 * @param lobby    大厅数据
 */

function SpritesetLobbyRoom(viewport, lobby) {
    var _lobby = lobby;
    var _sRooms = []; // <ISprite>
    var _viewport = viewport
    var _colorOpen = null; // <IColor>
    var _colorClose = null; // <IColor>
    var _rect1 = null; // <IRect>
    var _rect2 = null; // <IRect>

    this.rooms = function() {
        return _sRooms;
    };

    this.room = function(i) {
        return _sRooms[i];
    };

    this.update = function() {
        clearall();
        for(var i=0; i<_lobby.rooms.length; i++) {
            drawRoom(i);
        }
    };

    this.dispose = function() {
        for(var i=0; i<_sRooms.length; i++) {
            if(_sRooms[i]!=null) _sRooms[i].dispose();
        }
    };

    var clearall = function() {
        for(var i=0; i<_sRooms.length; i++) {
            if(_sRooms[i]!=null) _sRooms[i].clearBitmap();
        }
    };

    var drawRoom = function(i) {
        if(_sRooms[i] == null) {
            var bitmap = new IBitmap.CBitmap(750,150);
            _sRooms[i] = new ISprite(bitmap, viewport);
        }
        _sRooms[i].drawRect(rectBoard(), IColor.Black());
        var color = colorOpen();
        if(_lobby.rooms[i].state == 1) {
            color = colorClose();
        }
        _sRooms[i].drawRect(rectContent(), color);
        _sRooms[i].drawTextQ(_lobby.rooms[i].name, 27, 32,IColor.Black(),60);
        _sRooms[i].drawTextQ(_lobby.rooms[i].name, 25, 30,IColor.White(),60);
        _sRooms[i].x = i%2*860 + 30;
        _sRooms[i].y = parseInt(i/2)*170;
    };

    var colorOpen = function() {
        if(_colorOpen==null) _colorOpen = new IColor(0,200,0,175);
        return _colorOpen;
    };

    var colorClose = function() {
        if(_colorClose==null) _colorClose = new IColor(200,0,0,175);
        return _colorClose;
    };

    var rectBoard = function() {
        if(_rect1==null) _rect1 = new IRect(0,0,750,150);
        return _rect1;
    };

    var rectContent = function() {
        if(_rect2==null) _rect2 = new IRect(10,10,740,140);
        return _rect2;
    };
};
