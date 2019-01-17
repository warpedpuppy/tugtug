import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';

export default {
    line: undefined,
    radialQ: undefined,
    explosionQ: undefined,
    radials: [],
    explosions: [],
    doors: [],
    radialCont: new PIXI.Container(),
    explosionCont: new PIXI.Container(),
    doorCont: new PIXI.Container(),
    radialGrow: 0.01,
    radialIncrease: 0.0025,
    animationCounter: 0,
    animationLength: 120,
    done: false,
    utils: Utils,
    init: function (app, wh, spritesheet) {
        this.halfAnimationLength = this.animationLength / 2;
        this.radialCont.scale.set(0);
        this.canvasHeight = wh.canvasHeight;
        this.canvasWidth = wh.canvasWidth;

        this.radialQ = this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 1000 : 10;

        this.explosionQ = this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 1000 : 10;

        for(let i = 0; i < this.radialQ; i ++){
            let r = new PIXI.Sprite(spritesheet.textures['line.png']);
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

            let e = new PIXI.Sprite(spritesheet.textures['line.png']);
            e.width = 5;
            e.height = 5;
            e.radius = 0;
            e.maxRadius = this.utils.randomNumberBetween(this.canvasWidth * 0.15, this.canvasWidth * 0.25);
            e.increaseVariant = this.utils.randomNumberBetween(1, 10);
            e.rotate = this.utils.randomNumberBetween(2, 5);
            e.tint = this.utils.randomColor();
            this.explosions.push(e);
            this.explosionCont.addChild(e);
        }

                    
        return this;
    },
    addAnimations: function (cont, hero) {
        this.radialCont.x = this.canvasWidth / 2;
        this.radialCont.y = this.canvasHeight / 2;
        this.explosionCont.x = this.canvasWidth / 2;
        this.explosionCont.y = this.canvasHeight / 2;
        let contIndex = cont.getChildIndex(hero);
    
        cont.addChildAt(this.radialCont, contIndex - 2);
        cont.addChildAt(this.explosionCont, contIndex - 1);
    },
    swimTransition: function () {

        //radial line

        //explosion of wave icons

        //shower down of water

    },
    bounceTransition: function () {

        //exposion of balls

        //shower down and bounce of springs

    },
    jumpTransition: function () {

        //explosion of something

        //shower down of something else
    },
    flyTransition: function () {



    },
    reset: function () {
        this.radialGrow = 0.01;
        this.radialCont.scale.set(0);
        this.animationCounter = 0;
        this.done = false;
        for (let i = 0; i < this.explosionQ; i ++) {
            //fade out
            let e = this.explosions[i];
            e.radius = 0;
        }
    },
    animate: function () {

        

        this.animationCounter ++;
        if(this.animationCounter >= this.animationLength){
            this.done = true;
        }

        if(!this.done){
            if (this.animationCounter <= this.halfAnimationLength) {
                    this.radialGrow += this.radialIncrease;
                    this.radialCont.scale.x += this.radialGrow;
                    this.radialCont.scale.y += this.radialGrow;
                
            } else {
                    //this.radialGrow += this.radialIncrease;
                    if(this.radialCont.scale.x < 0){
                        this.radialGrow = 0;
                        this.radialCont.scale.set(0);
                    } else {
                        this.radialCont.scale.x -= this.radialGrow;
                        this.radialCont.scale.y -= this.radialGrow;
                    }
            }
        }
        

        this.radialCont.rotation += this.utils.deg2rad(0.5);
        for (let i = 0; i < this.radialQ; i ++) {

            let r = this.radials[i];
            r.height = this.utils.cosWave(r.storeHeight, r.variance, r.speed);

            let e = this.explosions[i];
            e.rotation = this.utils.deg2rad(e.rotate)
            if (this.animationCounter <= this.halfAnimationLength) {
                e.radius += e.increaseVariant;
                if(e.radius > e.maxRadius)e.radius = 0;
            } else {
                e.radius = 0;
            }
            e.x = e.radius * Math.cos( ( 2 * Math.PI) * i / this.explosionQ);
            e.y = e.radius * Math.sin( ( 2 * Math.PI) * i / this.explosionQ);

        }
    }
}