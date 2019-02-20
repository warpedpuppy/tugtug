import Assets from '../utils/assetCreation';
import Utils from '../utils/utils';
export default {
    line: undefined,
    radialQ: undefined,
    explosionQ: undefined,
    radials: [],
    explosions: [],
    doors: [],
    radialCont: Assets.Container(),
    explosionCont: Assets.Container(),
    cont: Assets.Container(),
    radialGrow: 0.01,
    radialIncrease: 0.0025,
    animationCounter: 0,
    animationLength: 240,
    done: false,
    utils: Utils,
    wh: {},
    runAnimation: false,
    init: function () {

        //first add concentric circles one layer beneath hero
        // let heroIndex = this.utils.app.stage.getChildIndex(this.utils.hero.cont);
        // console.log(heroIndex)


        //mask the new background to those concentric circles

        this.radialCont.x = this.utils.canvasWidth / 2;
        this.radialCont.y = this.utils.canvasHeight / 2;
        this.explosionCont.x = this.utils.canvasWidth / 2;
        this.explosionCont.y = this.utils.canvasHeight / 2;
        this.cont.x = this.utils.canvasWidth / 2;
        this.cont.y = this.utils.canvasHeight / 2;
        //this.cont.visible = false;
        let contIndex = this.utils.app.stage.getChildIndex(this.utils.hero.cont);
        this.utils.app.stage.addChildAt(this.cont, contIndex - 3);
        this.utils.app.stage.addChildAt(this.radialCont, contIndex - 2);
        this.utils.app.stage.addChildAt(this.explosionCont, contIndex - 1);
        
        this.circle = Assets.Sprite('circleAlpha1.png');
        this.circle.tint = 0x000000;
        this.circle.anchor.set(0.5);

        this.halfAnimationLength = this.animationLength / 2;
        this.radialCont.scale.set(0);


        this.radialQ = this.pelletQ = Assets.webgl ? 1000 : 10;

        this.explosionQ = this.pelletQ = Assets.webgl ? 1000 : 10;

        for(let i = 0; i < this.radialQ; i ++){
            let r = Assets.Sprite('line.png');
            r.width = 1;
            r.height = this.utils.randomNumberBetween(100, 500);
            r.alpha = this.utils.randomNumberBetween(0.2, 0.8);
            r.anchor.x = 0;
            r.anchor.y = 0;
            r.storeHeight = r.height;
            r.variance = this.utils.randomNumberBetween(20, 50);
            r.rotation = this.utils.deg2rad(i*(360 / this.radialQ));
            r.speed = this.utils.randomNumberBetween(.0003, .003);
            r.tint = 0xFFFF00;
            this.radials.push(r);
            this.radialCont.addChild(r);

            let e = Assets.Sprite('line.png');
            e.width = 5;
            e.height = 5;
            e.radius = 0;
            e.maxRadius = this.utils.randomNumberBetween(this.utils.canvasWidth * 0.15, this.utils.canvasWidth * 0.25);
            e.increaseVariant = this.utils.randomNumberBetween(1, 10);
            e.rotate = this.utils.randomNumberBetween(2, 5);
            e.tint = this.utils.randomColor();
            this.explosions.push(e);
            this.explosionCont.addChild(e);
        }

        this.cont.addChildAt(this.circle, 0)
        return this;
    },
    resize: function (wh) {
        this.wh = wh;
    },
    start: function (newBackground, oldBackground) {
        this.oldBackground = oldBackground;
        this.newBackground = newBackground;
        //console.log(newBackground.maskedItems);
       
        newBackground.maskedItems.forEach(item => {
            item.mask = this.circle;
        })
       
        // this.cont.visible = true;
        this.runAnimation = true;
    },
    reset: function () {
        console.log("RESET")
        this.radialGrow = 0.01;
        this.radialCont.scale.set(0);
        this.animationCounter = 0;
        this.done = false;
        //this.cont.visible = false;
        this.circle.scale.set(0);
        this.newBackground.maskedItems.forEach(item => {
            item.mask = undefined;
        })
        for (let i = 0; i < this.explosionQ; i ++) {
            //fade out
            let e = this.explosions[i];
            e.radius = 0;
        }
        this.oldBackground.removeFromStage();
        //console.log('remove old background')
    },
    animate: function () {

        if(!this.runAnimation)return;

        this.animationCounter ++;
        if(this.animationCounter >= this.animationLength){
            this.done = true;
            this.runAnimation = false;
        }

        if(!this.done){

            this.circle.scale.x += 0.05;
            this.circle.scale.y += 0.05;
            // if (this.animationCounter <= this.halfAnimationLength) {
            //         this.radialGrow += this.radialIncrease;
            //         this.radialCont.scale.x += this.radialGrow;
            //         this.radialCont.scale.y += this.radialGrow;
                
            // } else {
            //         //this.radialGrow += this.radialIncrease;
            //         if(this.radialCont.scale.x < 0){
            //             this.radialGrow = 0;
            //             this.radialCont.scale.set(0);
            //         } else {
            //             this.radialCont.scale.x -= this.radialGrow;
            //             this.radialCont.scale.y -= this.radialGrow;
            //         }
            // }
        }
        

        // this.radialCont.rotation += this.utils.deg2rad(0.5);
        // for (let i = 0; i < this.radialQ; i ++) {

        //     let r = this.radials[i];
        //     r.height = this.utils.cosWave(r.storeHeight, r.variance, r.speed);

        //     let e = this.explosions[i];
        //     e.rotation = this.utils.deg2rad(e.rotate)
        //     if (this.animationCounter <= this.halfAnimationLength) {
        //         e.radius += e.increaseVariant;
        //         if(e.radius > e.maxRadius)e.radius = 0;
        //     } else {
        //         e.radius = 0;
        //     }
        //     e.x = e.radius * Math.cos( ( 2 * Math.PI) * i / this.explosionQ);
        //     e.y = e.radius * Math.sin( ( 2 * Math.PI) * i / this.explosionQ);

        // }
    }

}