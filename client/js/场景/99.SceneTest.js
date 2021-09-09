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
        this.wSelect = null;
        this.sAnim = null;
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

        // 测试-基础精灵
        this.sObject = new SpriteObject(this.background.viewport, this.object);
        this.sObject.x = 100;
        this.sObject.y = 100;
        this.sObject.z = 1001;

        // 测试-动画精灵
        let rect = new IRect(500, 0, 600, 140);
        this.sAnim = new SpriteAnim(this.background.viewport, 1, rect, false, null);

        // 测试-基础窗体
        this.window = new WindowBase(0, 200, 400, 100);
        this.window.z = 2000;
        this.window.init();

        // 测试-选项窗体
        this.wSelect = new WindowSelect(0, 350, 400, 150);
        this.wSelect.z = 2000;
        this.wSelect.init();
        let menu = ["选项1", "选项2"];
        for (let i = 0; i < menu.length; i++) {
            let bt = new SpriteButton(this.wSelect._viewport, menu[i]);
            bt.x = 0;
            bt.y = i*50;
            this.wSelect._buttons[i] = bt;
        }
        return true;
    };

    update() {
        super.update();
        if(this.loading) return;
        this.sObject.updateBase();
        this.window.update();
        this.wSelect.update();
        this.sAnim.updateBase();

        this.window.clear();
        let msg = "图片当前坐标 ("+parseInt(this.sObject.x)+","+parseInt(this.sObject.y)+")\n换行测试";
        this.window.drawTextEx(msg, 0, 0, IColor.Blue());

        for(let i=0; i<this.wSelect._buttons.length; i++) {
            this.wSelect._buttons[i].update();
            this.wSelect._buttons[i].updateBase();
        }

        if(this.sprite.isSelected() && IInput.up){
            IInput.up = false;
            this.object.moveBaF = !this.object.moveBaF;
        }

        if(this.sObject.isSelected()) {
            this.object.moveX = 100;
        }

        if(this.sprite2.isSelected() && IInput.up) {
            IInput.up = false;
            this.playAnim(9, new IRect(500, 150, 600, 350));
        }
    };
}
