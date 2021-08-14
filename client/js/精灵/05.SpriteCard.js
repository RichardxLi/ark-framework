/** 
 * 精灵-卡牌
 * @param viewport  所属视窗
 * @param card      卡片数据
 */
function SpriteCard(viewport, card) {
    ISprite.call(this, RF.DefaultBitmap(), viewport);
    var _card = card; // <GameCard>

    this.frameUpdate = function() {
        if(_card.inAnimation) {
            return;
        }
        this.clearBitmap();
        var bitmap = RF.LoadCache(_card.picture());
        this.setBitmap(bitmap);
        if(_card.hint) {
            _card.inAnimation = true;
            this.flash(new IColor(225,225,225,225), 120);
            this.slideTo(this.x, this.y, 160);
            this.setOnEndSlide(function(){
                _card.inAnimation = false;
            });
        } else {
            this.setOnEndSlide(function(){});
            _card.inAnimation = false
        }
    };

    this.setCard = function(card) {
        _card = card;
    };
};
