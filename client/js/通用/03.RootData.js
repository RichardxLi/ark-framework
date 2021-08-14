/**
 * 全局数据库
 */
function RD(){};

// DataObject
RD._objects = [];
RD.LoadObjects = function() {
    // 缺省元素
    this._objects[0] = new DataObject();
};
RD.Object = function(id) {
   if(this._objects[id] == null) {
        return this._objects[0];
    }
    return this._objects[id];
};

// DataCard
RD._cards = [];
RD.LoadCards = function() {
    this._cards[0] = new DataCard();
    this._cards[1] = {id:1, name:"公爵", label:"DUKE", fPicture:"card/duke.jpg", bPicture:"card/back.jpg", dPicture:"card/duke_die.jpg",};
    this._cards[2] = {id:2, name:"刺客", label:"ASS", fPicture:"card/assassin.jpg", bPicture:"card/back.jpg", dPicture:"card/assassin_die.jpg"};
    this._cards[3] = {id:3, name:"女伯爵", label:"CTS", fPicture:"card/countess.jpg", bPicture:"card/back.jpg", dPicture:"card/countess_die.jpg"};
    this._cards[4] = {id:4, name:"大使", label:"AMB", fPicture:"card/ambassador.jpg", bPicture:"card/back.jpg", dPicture:"card/ambassador_die.jpg"};
    this._cards[5] = {id:5, name:"队长", label:"CAP", fPicture:"card/captain.jpg", bPicture:"card/back.jpg", dPicture:"card/captain_die.jpg"};
};
RD.Card = function(id) {
   if(this._cards[id] == null) {
        return this._cards[0];
    }
    return this._cards[id];
};

// ----------------------
// TEST
RD._objects[1] = new DataObject();
RD._objects[1].id = 1;
RD._objects[1].picture = "demo/1.jpg";
