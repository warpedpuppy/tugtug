import Assets from '../utils/assetCreation';
import Utils from '../utils/utils';
export default {
    line: undefined,
    cont: Assets.Container(),
    radialGrow: 0.01,
    radialIncrease: 0.0025,
    animationCounter: 0,
    animationLength: 120,
    done: false,
    utils: Utils,
    wh: {},
    runAnimation: false,
    colors: [0xFF00FF, 0xFF0000, 0xFFFF00, 0xFF9900, 0x33FF00],
    colorCounter: 0,
    init: function (parent) {
        this.parent = parent;
        this.particleContainer = Assets.ParticleContainer();
        this.cont.addChild(this.particleContainer);
        this.circle = Assets.Sprite('circleMask.png');
        
        this.circle.scale.set(0);
        this.circle.alpha = 0.5;
        this.circle.anchor.set(0.5);

        this.halfAnimationLength = this.animationLength / 2;
        
        this.cont.addChildAt(this.circle, 0)
        return this;
    },
    setUp: function () {
        this.lines = Assets.returnFirstHalfObjectPool('line.png');
        this.dots = Assets.returnSecondHalfObjectPool('pellet.png');
        this.loopingQ = this.dots.length;
        for (let i = 0; i < this.loopingQ; i ++) {

            let l = this.lines[i];
            l.x = l.y = 0;
            l.width = 1;
            l.height = l.storeHeight = this.utils.randomNumberBetween(100, 500);
            l.alpha = this.utils.randomNumberBetween(0.2, 0.8);
            l.anchor.set(0);
            l.variance = this.utils.randomNumberBetween(20, 50);
            l.rotation = this.utils.deg2rad(i*(360 / this.loopingQ));
            l.speed = this.utils.randomNumberBetween(.0003, .003);
            l.tint = 0xFFFF00;
            this.particleContainer.addChild(l);

            let e = this.dots[i];
            e.anchor.set(0.5)
            e.radius = 0;
            e.maxRadius = this.utils.randomNumberBetween(this.utils.canvasWidth * 0.15, this.utils.canvasWidth * 0.25);
            e.increaseVariant = this.utils.randomNumberBetween(0.005, 2.5);
            e.rotate = this.utils.randomNumberBetween(2, 5);
            e.tint = this.utils.randomColor();
            this.particleContainer.addChild(e);
        }
        this.cont.x = this.utils.canvasWidth / 2;
        this.cont.y = this.utils.canvasHeight / 2;
        let contIndex = this.utils.app.stage.getChildIndex(this.utils.hero.cont);
        this.utils.app.stage.addChildAt(this.cont, contIndex - 3);

        this.circle.tint = this.colors[this.colorCounter];
        this.colorCounter ++;
        if(this.colorCounter === this.colors.length){
            this.colorCounter = 0;
        }
    },
    resize: function (wh) {
        this.wh = wh;
    },
    start: function (newActiveMode, grid) {
        this.newActiveMode = newActiveMode;
        this.setUp();
        this.runAnimation = true;
    },
    reset: function () {

        this.radialGrow = 0.01;
        this.particleContainer.scale.set(0);
        this.animationCounter = 0;
        this.done = false;
        //this.cont.visible = false;
        this.circle.scale.set(0);
        for (let i = 0; i < this.explosionQ; i ++) {
            //fade out
            let e = this.explosions[i];
            e.radius = 0;
        }
        this.parent.transitionAnimationPlaying = false;
        this.utils.app.stage.removeChild(this.cont);

        this.parent.action = true;
        this.parent.hero.switchPlayer(this.parent.activeMode);
        this.parent.activeAction = this.newActiveMode.addToStage();

        this.parent.grid.setAction(this.parent.activeAction);

        let index = this.parent[this.parent.activeMode].background.gridIndex + 1;
            console.log("index = ", index)
        this.parent.stage.setChildIndex(this.parent.grid.cont, index) 

    },
    startWithMasking: function (newBackground, oldBackground) {
        this.oldBackground = oldBackground;
        this.newBackground = newBackground;
        console.log(newBackground.maskedItems);
       
        newBackground.maskedItems.forEach(item => {
            item.mask = this.circle;
        })
       
        // this.cont.visible = true;
        this.runAnimation = true;
    },
    resetWithMasking: function () {
        console.log("RESET")
        this.radialGrow = 0.01;
        this.radialCont.scale.set(0);
        this.animationCounter = 0;
        this.done = false;
        //this.cont.visible = false;
        this.circle.scale.set(0);
        this.newBackground.maskedItems.forEach(item => {
            item.mask = null;
        })
        for (let i = 0; i < this.explosionQ; i ++) {
            //fade out
            let e = this.explosions[i];
            e.radius = 0;
        }
        this.parent.transitionAnimationPlaying = false;
        //this.oldBackground.removeFromStage();
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

            this.circle.scale.x += 0.01;
            this.circle.scale.y += 0.01;
            if (this.animationCounter <= this.halfAnimationLength) {
                    this.radialGrow += this.radialIncrease;
                    this.particleContainer.scale.x += this.radialGrow;
                    this.particleContainer.scale.y += this.radialGrow;
                
            } else {
                    //this.radialGrow += this.radialIncrease;
                    if(this.particleContainer.scale.x < 0){
                        this.radialGrow = 0;
                        this.particleContainer.scale.set(0);
                    } else {
                        this.particleContainer.scale.x -= this.radialGrow;
                        this.particleContainer.scale.y -= this.radialGrow;
                    }
            }
        }
        

        this.particleContainer.rotation += this.utils.deg2rad(0.5);
        for (let i = 0; i < this.loopingQ; i ++) {

            let l = this.lines[i];
            l.height = this.utils.cosWave(l.storeHeight, l.variance, l.speed);

            let d = this.dots[i];
            if (this.animationCounter <= this.halfAnimationLength) {
                d.radius += d.increaseVariant;
                if(d.radius > d.maxRadius)d.radius = 0;
            } else {
                d.radius = 0;
            }
            d.x = d.radius * Math.cos( ( 2 * Math.PI) * i / this.loopingQ);
            d.y = d.radius * Math.sin( ( 2 * Math.PI) * i / this.loopingQ);

        }
    }

}