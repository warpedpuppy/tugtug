import Utils from './utils/utils';
import Assets from './utils/assetCreation';
import Clock from './supportingClasses/clock';

import Swim from './supportingClasses/swim/indexSwim';
import Bounce from './supportingClasses/bounce/indexBounce';
import Fly from './supportingClasses/fly/indexFly';
import Jump from './supportingClasses/jump/indexJump';



import Pellets from './supportingClasses/pellets';
import Treasure from '../animations/supportingClasses/treasure';
import MagicPills from './supportingClasses/magicPills';

import TransitionItems from './supportingClasses/transitionItems';
import FilterAnimation from './supportingClasses/filterAnimation';

import Gears from './supportingClasses/gears';
import Hero from './supportingClasses/hero';



import Score from '../animations/supportingClasses/score';
import PixiFps from "pixi-fps";
import Config from './animationsConfig';


export default function(obj) {
    return {
        idle: true,
        vx: 0,
        vy: 5,
        rotateLeftBoolean: false,
        rotateRightBoolean: false,
        renderTextureTestBoolean: false,
        inc: 90,
        mode: ['swim','fly','bounce','jump'],
        activeModeIndex: 0,
        activeMode: undefined,
        backgroundCont: Assets.Container(),
        foregroundCont: Assets.Container(),
        filterContainer: Assets.Container(),
        ripples: undefined,
        action: true,
        spriteSheet: undefined,
        gears: Gears,
        clock: Clock,
        pellets: Pellets(),
        magicPills: MagicPills(),
        filterAnimation: FilterAnimation(),
        hero: Hero(),
        transitionItems: TransitionItems(),
        utils: Utils,
        treasure: Treasure(),
        score: Score(),
        loader: Assets.Loader(),
        activeAction: undefined,
        config: Config,
        swim: Swim(),
        bounce: Bounce(),
        fly: Fly(),
        jump: Jump(),
        init: function () {


     

            this.canvasWidth =  this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();

            var app = this.app = Assets.Application();
            document.getElementById('homeCanvas').appendChild(app.view);

            this.stage = app.stage;
        
            const fpsCounter = new PixiFps();
            app.stage.addChild(fpsCounter);

            this.stage.addChild(this.backgroundCont);
            this.stage.addChild(this.filterContainer);
            this.stage.addChild(this.foregroundCont);

            this.keyDown = this.keyDown.bind(this);
            this.keyUp = this.keyUp.bind(this);
            window.addEventListener('keydown', this.keyDown);
            window.addEventListener('keyup', this.keyUp);

            window.onresize = this.resizeHandler.bind(this);

            this.start = this.start.bind(this);
            if (!this.loader.resources["/ss/ss.json"]) {
                 this.loader
                    .add("/ss/ss.json")
                    .add("Hobo", "/fonts/hobostd.xml")
                    .load(this.start);
            } else {
                this.start();
            }

        },
        start: function () {

        
            this.spritesheet = this.loader.resources["/ss/ss.json"].spritesheet;

            this.utils.setProperties({
                spritesheet: this.spritesheet,
                canvasWidth: this.canvasWidth,
                canvasHeight: this.canvasHeight,
                app: this.app
            })

            Assets.init();

            this.hero.init(undefined, this.stage).switchPlayer(this.mode[this.activeModeIndex]);

            this.utils.setHero(this.hero);
        

            this.gears.init(this.stage);

            this.clock.init(this.stage);

            //this.pellets.init(this.app, this.wh, this.stage, this.activeMode, this.spritesheet);

            this.magicPills.init(this.filterTest.bind(this), this.backgroundCont);

            this.filterAnimation.init(this.filterContainer);

            this.transitionItems.init(
                this.mode, 
                this.stage, 
                this.switchPlayer.bind(this)).build();

            this.treasure.init(this.stage);
            
            this.swim.init(this.stage);

            this.bounce.init(this.stage);

            this.fly.init(this.stage);

            this.jump.init(this.stage);
            
            this.switchPlayer(this.mode[this.activeModeIndex]);

            this.app.ticker.add(this.animate.bind(this));
        },
        stop: function () {
            window.onresize = undefined;
            if(this.app)this.app.destroy(true);
            window.removeEventListener('keydown', this.keyDown);
            window.removeEventListener('keyup', this.keyUp);
        },
        switchPlayer: function (str) {
            if (this[this.activeMode]) this[this.activeMode].removeFromStage();
            
            if (str) {
                this.activeMode = str;
            } else {
                this.activeModeIndex ++;
                if(this.activeModeIndex >= this.mode.length)this.activeModeIndex = 0;
                this.activeMode = this.mode[this.activeModeIndex];
            }
            this.activeAction = this[this.activeMode].addToStage();

            this.hero.switchPlayer(this.activeMode);
            this.pellets.changeMode(this.activeMode);
        },
        resizeHandler: function () {
            this.canvasWidth =  this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();

            this.utils.resize(this.canvasWidth, this.canvasHeight);

            this.clock.resize();
            this.gears.resize();
            this.hero.resize();
            this.swim.resize();
            this.bounce.resize();
            this.fly.resize();
            this.jump.resize();
            // if(this.platforms)this.platforms.resize(wh);
            // this.magicPills.resize(wh);
            // this.treasure.resize(wh);
            // this.transitionItems.resize(wh);
            // this.filterAnimation.resize(wh);
            // this.pellets.resize(wh);
            // this.hero.resize(wh);
            // if(this.jumpAction)this.jumpAction.resize(wh);
            // if(this.bouncePlatform)this.bouncePlatform.resize(wh);
            // if(this.bounceAction)this.bounceAction.resize(wh);

            this.app.renderer.resize(this.canvasWidth, this.canvasHeight);
        },
        nightMode: function () {
            this.pellets.change();
            this.app._options.backgroundColor = '0x000000';
            console.log(this.app._options.backgroundColor)
        },
        filterTest: function () {
            this.filterAnimation.filterToggle();
        },
        rotate: function (str) {

            if (this.activeMode === 'jump') {
                this.jumpAction.move(str);
                return;
            }

            if (str === 'right') {
                this.idle = false;
                this.activeAction.radius += 0.25;
                this.velocity = this.utils.randomNumberBetween(
                    this.config.swimVelocities[0], 
                    this.config.swimVelocities[1]);
                this.vx = this.velocity * Math.sin(this.activeAction.radius);
                this.vy = -this.velocity * Math.cos(this.activeAction.radius);
                this.activeAction.storeRadius = this.activeAction.radius;
                let obj = {vx: -this.vx, vy: -this.vy};
                this.pellets.rotate(obj);
                //this.transitionItems.rotate(obj);
                this.activeAction.rotate(obj);
            
            } else if (str === 'left') {
                this.idle = false;
                this.activeAction.radius -= 0.25;
                this.velocity = this.utils.randomNumberBetween(
                    this.config.swimVelocities[0], 
                    this.config.swimVelocities[1]);
                this.vx = this.velocity * Math.sin(this.activeAction.radius);
                this.vy = -this.velocity * Math.cos(this.activeAction.radius);
                this.activeAction.storeRadius = this.activeAction.radius;
                let obj = {vx: -this.vx, vy: -this.vy};
                this.pellets.rotate(obj);
                //this.transitionItems.rotate(obj);
                this.activeAction.rotate(obj);
            }
        },
        keyDown: function (e) {
            //e.preventDefault();
            this.hero.heroJump.look();
            switch (e.keyCode) {
                case 32:
                // space
                    if(this.jumpAction)this.jumpAction.jump();
                    if(this.activeMode === 'fly')this.activeAction.fire(true);
                    break;
                case 37:
                    // left
                    if(this.activeMode === 'bounce')break;
                    if(this.swimAction)this.swimAction.spinning = true;
                    this.rotateLeftBoolean = true;
                    
                    //this.rotate('left');
                    break;
                case 38:
                    // up
                    this.rotate('up');
                    this.hero.heroJump.look('up');
                    break;
                case 39:
                    // right
                    if(this.activeMode === 'bounce')break;
                    if(this.swimAction)this.swimAction.spinning = true;
                    this.rotateRightBoolean = true;
                    //this.rotate('right');
                    break;
                case 40:
                    break;
                default:
                    this.vy = 0;
            }
        },
        keyUp: function (e) {
            e.preventDefault();
            if(this.swimAction)this.swimAction.spinning = false;
            this.rotateLeftBoolean = false;
            this.rotateRightBoolean = false;
            this.idle = true;
           if(this.activeMode === 'fly')this.activeAction.fire(false);
        },
        animate: function () {

            this.score.animate();

            if (this.treasure.hit || this.transitionItems.hit) {
                if(this.action){
                    this.filterAnimation.shutOff();
                    this.action = false;
                }
                if (this.treasure.hit) {
                    this.score.increase(100);
                    this.treasure.animateSpecial();
                } else {
                    this.transitionItems.animateSpecial();
                }

            } else {
                this.action = true;
            }

            if (this.action) {
                if(this.rotateLeftBoolean)this.rotate('left');
                if(this.rotateRightBoolean)this.rotate('right');
                this.clock.animate();
                this.filterAnimation.animate();
                
                this.gears.animate();
                this.activeAction.animate();
                this.pellets.animate(this.activeAction.vx, this.activeAction.vy);
                this.treasure.animate(this.activeAction.vx, this.activeAction.vy);
                this.transitionItems.animate(this.activeAction.vx, this.activeAction.vy);
                this.magicPills.animate(this.activeAction.vx, this.activeAction.vy);
                
                this[this.activeMode].animate();
            
            }
            
            


        }
    }
}