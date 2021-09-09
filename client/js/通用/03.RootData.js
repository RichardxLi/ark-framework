/**
 * 全局数据库
 */
function RD(){};

// DataObject
RD._objects = [];
RD.LoadObjects = function() {
    // 缺省
    RD._objects[0] = new DataObject();
    // 测试
    RD._objects[1] = {id:1, picture:"ifaction_logo.png"};
};
RD.Object = function(id) {
   if(RD._objects[id] == null) {
        return RD._objects[0];
    }
    return RD._objects[id];
};

// DataSet
RD.Set = null;
RD.LoadSet = function(onload) {
    RD.Set = new DataSet();
    RD.Set.load(onload);
}

// DataProject
RD.Project = null;
RD.LoadProject = function(onload) {
    RD.Project = new DataProject();
    RD.Project.load(onload);
}