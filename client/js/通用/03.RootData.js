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

// ----------------------
// TEST
RD._objects[1] = {id:1, picture:"demo/1.png"};