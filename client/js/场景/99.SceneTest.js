/**
 * 调试用
 */
class SceneTest extends SceneBase {
    constructor() {
        super();
        this.sprite = null;
        this.object = new GameObject(1);
        this.sObject = null;
        this.window = null;
    }

    init() {
        super.init();
        this.sprite = new ISprite(80,30,IColor.Red());
        this.sprite.drawTextQ("Test1",10,10,IColor.Blue(),18);
        this.sprite.z = 1001;

        this.sprite2 = new ISprite(80,30,IColor.Red());
        this.sprite2.drawTextQ("Test2",10,10,IColor.Blue(),18);
        this.sprite2.x = 100;
        this.sprite2.z = 1001;

        this.sObject = new SpriteObject(this.background.viewport, this.object);
        this.sObject.x = 100;
        this.sObject.y = 100;
        this.sObject.z = 1001;

        this.window = new WindowBase(0, 200, 400, 100);
        this.window.init();
        this.window.z = 2000;
    };

    update() {
        super.update();
        this.sObject.updateBase();
        this.window.update();
        this.window.clear();
        let msg = "图片当前坐标 ("+parseInt(this.sObject.x)+","+parseInt(this.sObject.y)+")\n换行测试";
        this.window.drawTextEx(msg, 0, 0, IColor.Blue());

        if(this.sprite.isSelected() && IInput.up){
            IInput.up = false;
            this.object.moveBaF = !this.object.moveBaF;
        }

        if(this.sprite2.isSelected() && IInput.up){
            IInput.up = false;
        }

        if(this.sObject.isSelected()) {
            this.object.moveX = 100;
        }
    };
}
