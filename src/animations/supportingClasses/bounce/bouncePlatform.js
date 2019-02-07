import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
    return {
        line: new PIXI.Sprite(),
        dot1: new PIXI.Sprite(),
        dot2: new PIXI.Sprite(),
        mouseDown:false, 
        startMode: true,
        utils: Utils,
        init: function (cont) {
            let spritesheet = this.utils.spritesheet;
            this.cont = cont;
            this.line.height = 2;
            this.line.anchor.y = 0.5;
            this.line.tint = 0x000000;

            this.line.texture = spritesheet.textures['bouncePlatformLine.png'];
            this.dot1.texture = spritesheet.textures['bouncePlatformBall.png'];
            this.dot2.texture = spritesheet.textures['bouncePlatformBall.png'];

            cont.addChild(this.line);
            this.dot1.anchor.x = this.dot1.anchor.y = 0.5;
            cont.addChild(this.dot1);
            this.dot2.anchor.x = this.dot2.anchor.y = 0.5;
            cont.addChild(this.dot2);
            this.on = this.on.bind(this);
            this.on(true);
            
        },
        resize: function (wh) {
            if(this.startMode){
                this.start(wh.canvasWidth, wh.canvasHeight)
            }
        },
        start: function (canvasWidth, canvasHeight) {

            canvasWidth = this.utils.canvasWidth;
            canvasHeight = this.utils.canvasHeight;

            let halfWidth = canvasWidth / 2;
            let halfHeight = canvasHeight / 2;
            let point1 = new PIXI.Point(halfWidth - 100, halfHeight + 100);
            let point2 = new PIXI.Point(halfWidth + 100, halfHeight + 100);

            this.dot1.x = point1.x;
            this.dot1.y = point1.y;
            this.dot2.x = point2.x;
            this.dot2.y = point2.y;
            this.line.x = this.dot1.x;
            this.line.y = this.dot1.y;
            let disAngle = this.utils.distanceAndAngle(new PIXI.Point(this.dot1.x, this.dot1.y), new PIXI.Point(this.dot2.x, this.dot2.y));
                this.line.rotation = disAngle[1];
                this.line.width = disAngle[0];
        },
        on: function (trueFalse) {
            this.placeFirstDot = this.placeFirstDot.bind(this);
            this.onMouseMove = this.onMouseMove.bind(this)
            this.releaseMouse = this.releaseMouse.bind(this)
             this.line.visible = this.dot1.visible = this.dot2.visible = trueFalse;
             this.cont.interactive = trueFalse;
                this.cont.buttonMode = trueFalse;
            if (trueFalse) {
                this.cont.mousedown = this.cont.touchstart =  this.placeFirstDot;
                this.cont.mousemove = this.cont.touchmove = this.onMouseMove;
                this.cont.mouseup =  this.cont.touchend = this.releaseMouse;
            } else {
                this.cont.mousedown = this.cont.touchstart =  null;
                this.cont.mousemove = this.cont.touchmove = null;
                this.cont.mouseup =  this.cont.touchend = null;
            }
        },
        placeFirstDot: function(touchData) {
            console.log('place first dot')
            this.startMode = false;
            let mouse = touchData.data.global,
                mouseX = mouse.x,
                mouseY = mouse.y;
            this.line.width = 0;
            this.line.x = mouseX;
            this.line.y = mouseY;
            this.line.visible = true;
            this.dot1.x = mouseX;
            this.dot1.y = mouseY;
            this.dot1.visible = true;
            this.dot2.x = mouseX;
            this.dot2.y = mouseY;
            this.dot2.visible = true;
            this.mouseDown = true;
            //cont.removeChild(gv.swipeText);
        },
        onMouseMove: function(touchData){
            if (this.mouseDown === true) {
                let mouse = touchData.data.global,
                    mouseX = mouse.x,
                    mouseY = mouse.y;
                this.dot2.x = mouseX;
                this.dot2.y = mouseY;
                let disAngle = this.utils.distanceAndAngle(new PIXI.Point(this.dot1.x, this.dot1.y), new PIXI.Point(this.dot2.x, this.dot2.y));
                this.line.rotation = disAngle[1];
                this.line.width = disAngle[0];
            }
        },
        releaseMouse: function(data) {
            this.mouseDown = false;
        },
        animate: function() {
            if (this.dot2.visible === true) {
                this.dot1.rotation += 0.25;
                this.dot2.rotation += 0.25;
            }
        }
    }
}
