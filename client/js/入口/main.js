/**
 * 程序入口
 */
function iFActionGameStart(){
    // 设置DEBUG模式
    IVal.DEBUG = RV.System.Debug;
    // 设置默认文字颜色
    IVal.FontColor = IColor.White();
    // 设置默认文字大小
    IVal.FontSize = 18;
    // 设置首个Scene
    IVal.scene = new SceneStart();
    // 全屏
    if(!IVal.DEBUG) {
        setWindowStatus(1);
    }
}

// IF框架解释器用静态队列，仅预留，不使用
function IM(){}

// IF框架首个场景，仅预留，不使用
function SStart(){}
