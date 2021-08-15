/** 
 * 精灵组-玩家
 * @param viewport  所属视窗
 * @param player   玩家数据
 */

function SpritesetPlayer(viewport, player) {
    var _player = player;
    var _viewport = viewport;
    var _sPlayer = null; // <ISprite>
    var _sCards = []; // <SpriteCard>
    var _rectFull = null; // <IRect>
    var _colorDealer = null; // <IColor>
    var _colorIdler = null; // <IColor>
    var _colorDollar = null; // <IColor>

    this.cards = function() {
        return _sCards;
    };

    this.card = function(i) {
        return _sCards[i];
    };

    this.update = function() {
        if(_player==null) {
            return;
        }
        drawPlayer();
        for(var i=0; i<_player.total(); i++) {
            drawCard(i);
        }
    };

    this.dispose = function() {
        if(_sPlayer!=null) _sPlayer.dispose();
        for(var i=0; i<_sPlayers.length; i++) {
            if(_sCards[i]!=null) _sPlayers[i].disposeMin();
        }
    };

    var drawPlayer = function() {
        if(_sPlayer==null) {
            var bitmap = new IBitmap.CBitmap(480,350);
            _sPlayer = new ISprite(bitmap, _viewport);
            _sPlayer.z = 1;
        }
        _sPlayer.clearBitmap();
        _sPlayer.drawRect(_sPlayer.GetRect(), playerColor())
        _sPlayer.drawTextQ(_player.name, 20, 30, IColor.Black(), 42);
        _sPlayer.drawTextQ("$"+_player.gold, 20, 130, dollarColor(), 42);
        if(_player.challenge) _sPlayer.drawTextQ("质疑", 300, 30, IColor.Red(), 42);
    };

    var drawCard = function(i) {
        if(_sCards[i] == null) {
            _sCards[i] = new SpriteCard(_viewport, _player.hand(i));
            _sCards[i].x = 150 + i*140;
            _sCards[i].y = 110;
            _sCards[i].z = 2;
        } else {
            _sCards[i].setCard(_player.hand(i));
        }
        _sCards[i].frameUpdate();
    };

    var playerColor = function() {
        if(_colorDealer==null) _colorDealer = new IColor(120,200,150);
        if(_colorIdler==null) _colorIdler = new IColor(200,120,0);
        if(RV.GameData.Core.currentPlayer==_player.index) return _colorDealer;
        else return _colorIdler;
    };

    var dollarColor = function() {
        if(_colorDollar==null) _colorDollar = new IColor(255,255,0);
        return _colorDollar;
    };
};
