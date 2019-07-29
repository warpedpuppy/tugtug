import Assets from '../../../../utils/assetCreation';
import Utils from '../../../../utils/utils';
import Tweens from '../../../../utils/Tweens';
import Config from '../../../../animationsConfig';
export default function () {
    return {
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
    init: function () {
        this.parent = this.utils.root;
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
        this.utils.app.stage.addChildAt(this.cont, contIndex - 1);
       // this.utils.app.stage.addChildAt(this.cont, contIndex - 3);
        this.circle.tint = this.colors[this.colorCounter];
        this.colorCounter ++;
        if(this.colorCounter === this.colors.length){
            this.colorCounter = 0;
        }
       
    },
    resize: function (wh) {
        this.wh = wh;
    },
    start: function (oldActiveModeString, newActiveModeString) {

  
        let newMode = this.utils.root.activeMode;

        if (newMode !== 'bounce' && oldActiveModeString !== 'bounce') {
    
            let block = this.utils.root.grid.gridAction.storeCurrent;
            let xPos = block.block.x + this.utils.root.grid.gridBuild.blockWidth / 2;
            let yPos = block.block.y + this.utils.root.grid.gridBuild.blockHeight / 2;
            this.utils.root.grid.gridBuild.cont.pivot = Assets.Point(xPos, yPos);

            this.utils.root.grid.gridBuild.cont.x = this.utils.canvasWidth / 2;
            this.utils.root.grid.gridBuild.cont.y = this.utils.canvasHeight / 2;
            let currentScale = this.utils.root.grid.gridBuild.cont.scale.x;

            let newScale = Config[`${newActiveModeString}BlockSize`][0]/Config[`${oldActiveModeString}BlockSize`][0];

            Tweens.tween(this.utils.root.grid.gridBuild.cont.scale, 2, 
                {
                    x: [currentScale, newScale], 
                    y: [currentScale, newScale]}, 
                 this.continueAnimation.bind(this),
                 'easeOutBounce'
                 )
            
        } else {

            this.continueAnimation();
        }
       

        //tween the proportions
        this.newActiveMode = this.utils.root[newActiveModeString];//newActiveMode;
        // this.newActiveMode = newActiveMode;
        // this.setUp();
        // this.runAnimation = true;

    },
    continueAnimation: function () {
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
        
        this.utils.app.stage.removeChild(this.cont);

        this.utils.root.switchPlayer(this.utils.root.activeMode);

    },
    animate: function () {

        if (!this.runAnimation) return;
        
        this.animationCounter ++;
        if (this.animationCounter >= this.animationLength) {
            this.done = true;
            this.runAnimation = false;
            this.reset();
        }

        if (!this.done) {

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
}