/**
 * Created by 七夕小雨 on 2019/3/17.
 * 通用控制部分
 */
function RC(){}

//默认按键配置
RC.Key = {
    up        : 38,
    down      : 40,
    left      : 37,
    right     : 39,
    skip      : 16,
    auto      : 65,
    cancel    : 27
};

RC.IsKeyOK = function(){
    return IInput.isKeyDown(32) || IInput.isKeyDown(13)
};

RC.IsKeyExit = function() {
    return IInput.isKeyPress(18) && IInput.isKeyPress(115)
};

/**
 * 输入按键code获得对应字符串
 * @param code
 * @returns string
 */
RC.CodeToSting = function(code) {
    switch (code) {
        case 8:
            return "Back";
        case 9:
            return "Tab";
        case 12:
            return "Clear";
        case 13:
            return "Ent";
        case 16:
            return "Shift";
        case 17:
            return "Ctrl";
        case 18:
            return "Alt";
        case 19:
            return "Pause";
        case 20:
            return "Caps";
        case 27:
            return "Esc";
        case 32:
            return "Space";
        case 33:
            return "Prior";
        case 34:
            return "Next";
        case 35:
            return "End";
        case 36:
            return "Home";
        case 37:
            return "Left";
        case 38:
            return "Up";
        case 39:
            return "Right";
        case 40:
            return "Down";
        case 41:
            return "Select";
        case 42:
            return "Print";
        case 43:
            return "Execute";
        case 45:
            return "Ins";
        case 46:
            return "Del";
        case 47:
            return "Help";
        case 48:
            return "0";
        case 49:
            return "1";
        case 50:
            return "2";
        case 51:
            return "3";
        case 52:
            return "4";
        case 53:
            return "5";
        case 54:
            return "6";
        case 55:
            return "7";
        case 56:
            return "8";
        case 57:
            return "9";
        case 65:
            return "A";
        case 66:
            return "B";
        case 67:
            return "C";
        case 68:
            return "D";
        case 69:
            return "E";
        case 70:
            return "F";
        case 71:
            return "G";
        case 72:
            return "H";
        case 73:
            return "I";
        case 74:
            return "J";
        case 75:
            return "K";
        case 76:
            return "L";
        case 77:
            return "M";
        case 78:
            return "N";
        case 79:
            return "O";
        case 80:
            return "P";
        case 81:
            return "Q";
        case 82:
            return "R";
        case 83:
            return "S";
        case 84:
            return "T";
        case 85:
            return "U";
        case 86:
            return "V";
        case 87:
            return "W";
        case 88:
            return "X";
        case 89:
            return "Y";
        case 90:
            return "Z";
        case 96:
            return "Kp0";
        case 97:
            return "Kp1";
        case 98:
            return "Kp2";
        case 99:
            return "Kp3";
        case 100:
            return "Kp4";
        case 101:
            return "Kp5";
        case 102:
            return "Kp6";
        case 103:
            return "Kp7";
        case 104:
            return "Kp8";
        case 105:
            return "Kp9";
        case 106:
            return "Kp*";
        case 107:
            return "Kp+";
        case 108:
            return "KpEnt";
        case 109:
            return "Kp-";
        case 110:
            return "Kp.";
        case 111:
            return "Kp/";
        case 112:
            return "F1";
        case 113:
            return "F2";
        case 114:
            return "F3";
        case 115:
            return "F4";
        case 116:
            return "F5";
        case 117:
            return "F6";
        case 118:
            return "F7";
        case 119:
            return "F8";
        case 120:
            return "F9";
        case 121:
            return "F10";
        case 122:
            return "F11";
        case 123:
            return "F12";
        case 187:
            return "+";
        case 189:
            return "_";
        case 219:
            return "{";
        case 221:
            return "}";
        case 220:
            return "\\";
        case 186:
            return ";";
        case 222:
            return "\"";
        case 188:
            return "<";
        case 190:
            return ">";
        case 191:
            return "/";
        case 192:
            return "~";
        default:
            return "无效";
    }
};
