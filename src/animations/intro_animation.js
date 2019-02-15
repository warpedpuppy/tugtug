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
import ControlPanel from './supportingClasses/controlPanel';
import LevelSlots from './supportingClasses/level/levelSlots';
//import IntroScreen from './supportingClasses/introScreen';
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
        mode: ['jump','bounce','fly','swim'],
        activeModeIndex: 0,
        activeMode: undefined,
        backgroundCont: Assets.Container(),
        foregroundCont: Assets.Container(),
        filterContainer: Assets.Container(),
        ripples: undefined,
        action: false,
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
        levelSlots: LevelSlots(),
        screen: Assets.Graphics(),
        controlPanel: ControlPanel(),
        init: function (isMobile, isMobileOnly) {
            this.cropHeight = 100;
            this.isMobile = isMobile;
            this.isMobileOnly = isMobileOnly;
            this.mobileModifier = isMobileOnly?1:1;
            console.log(window.screen)
            if (!this.isMobileOnly) {
                this.canvasWidth = this.utils.returnCanvasWidth(isMobileOnly);
                this.canvasHeight = this.utils.returnCanvasHeight(isMobileOnly);
            } else {
                var scale = window.devicePixelRatio;
                console.log('scale = ', scale)
                this.testWidth =  this.utils.returnCanvasWidth(this.isMobileOnly);
                this.testHeight = this.utils.returnCanvasHeight(this.isMobileOnly);

                if (this.testWidth > this.testHeight) {
                    //landscape
                    console.log('make landscape')
                    document.getElementById('testOrientation').innerHTML = "landscape";
                    this.canvasWidth = window.screen.height * scale;
                    this.canvasHeight = window.screen.width * scale;
                    
                } else {
                    // portrait
                    console.log('make portrait')
                    document.getElementById('testOrientation').innerHTML = "portrait";
                    this.canvasWidth = window.screen.width * scale;
                    this.canvasHeight = window.screen.height * scale;
                    this.canvasHeight -= this.cropHeight;
                }
            }
           
            // this.canvasWidth =  this.utils.returnCanvasWidth(isMobileOnly);
            // this.canvasHeight =  this.utils.returnCanvasHeight(isMobileOnly);
           

            console.log('here', this.canvasWidth, this.canvasHeight)

            var app = this.app = Assets.Application( this.canvasWidth,  this.canvasHeight, false);
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

            this.orientationChangeHandler = this.orientationChangeHandler.bind(this);
         

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
            
            //this.switchPlayer(this.mode[this.activeModeIndex]);

            this.levelSlots.init(this.stage).addToStage();
            this.startGame = this.startGame.bind(this);
            //this.introScreen.init(this.stage, this.startGame).addToStage();

            // if(this.isMobile){
            //     console.log("mobile")
            // } else {
            //     console.log("not mobile")
            // }
            this.upHit = this.upHit.bind(this);
            this.downHit = this.downHit.bind(this);
            this.rightHit = this.rightHit.bind(this);
            this.leftHit = this.leftHit.bind(this);
            this.spaceHit = this.spaceHit.bind(this);
            this.keyRelease = this.keyRelease.bind(this);

            this.screen.beginFill(0x000000).drawRect(0,0,this.utils.canvasWidth, this.utils.canvasHeight);
            this.stage.addChild(this.screen);

            
            this.controlPanel.init(this);

            this.startGame();
            
            if(this.isMobileOnly){
                window.addEventListener("orientationchange", this.orientationChangeHandler);
            } else {
                 window.onresize = this.resizeHandler.bind(this);
            }
        },
        startGame: function () {
            this.mode = this.utils.shuffle(this.mode);
            //this.introScreen.removeFromStage();
            this.switchPlayer(this.mode[this.activeModeIndex]);
            this.app.ticker.add(this.animate.bind(this));
             this.stage.removeChild(this.screen);
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
            

            this.hero.switchPlayer(this.activeMode);
            this.activeAction = this[this.activeMode].addToStage();
            this.pellets.changeMode(this.activeMode);

            if(this.activeMode === 'bounce'){
                this.controlPanel.removeFromStage();
            } else {
                this.controlPanel.addToStage();
            }
        },
        orientationChangeHandler: function (e) {
            //console.log("the orientation of the device is now ", window.screen.orientation.angle);
            if(window.screen){
                console.log("1", window.screen)
            }
            let scale = window.devicePixelRatio;
            
            this.testWidth =  this.utils.returnCanvasWidth(this.isMobileOnly);
            this.testHeight = this.utils.returnCanvasHeight(this.isMobileOnly);

            this.val1 = window.screen.availHeight * scale;
            this.val2 = window.screen.availWidth * scale;

            if(this.testHeight > this.testWidth ){
                //landscape
                console.log('make landscape')
                this.canvasWidth = (this.val1 > this.val2)?this.val1:this.val2;
                this.canvasHeight = (this.val1 > this.val2)?this.val2:this.val1;
                console.log('width', this.canvasWidth, 'height', this.canvasHeight)
                document.getElementById('testOrientation').innerHTML = "landscape";
            } else {
                // portrait
                console.log('make portrait')
                this.canvasWidth = (this.val1 > this.val2)?this.val2:this.val1;
                this.canvasHeight = (this.val1 > this.val2)?this.val1:this.val2;
                this.canvasHeight -= this.cropHeight; 
                console.log('width', this.canvasWidth, 'height', this.canvasHeight)
                document.getElementById('testOrientation').innerHTML = "portrait";
            }
            this.utils.setWidthAndHeight(this.canvasWidth, this.canvasHeight)
            this.resizeBundle();
            this.app.renderer.resize(this.canvasWidth, this.canvasHeight);
        },
        resizeBundle: function () {
            this.clock.resize();
            this.gears.resize();
            this.hero.resize();
            this.swim.resize();

            if(!this.bounce.started){
                this.bounce.init(this.stage);
            }
            this.bounce.resize();
            this.fly.resize();
            this.jump.resize();
            this.levelSlots.resize();
            this.controlPanel.resize();
        },
        resizeHandler: function () {
            this.canvasWidth =  this.utils.returnCanvasWidth(this.isMobileOnly);
            this.canvasHeight = this.utils.returnCanvasHeight(this.isMobileOnly) * this.mobileModifier;;

            this.utils.resize(this.canvasWidth, this.canvasHeight);

            this.resizeBundle();
           
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
                this.activeAction.move(str);
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
        spaceHit: function () {
            if(this.activeAction.jump)this.activeAction.jump();
            if(this.activeMode === 'fly')this.activeAction.fire(true);
        },
        upHit: function () {
            this.rotate('up');
            this.hero.heroJump.look('up');
        },
        downHit: function () {
            this.vy = 0;
        },
        leftHit: function () {
            //if(this.activeMode === 'bounce')break;
            if(this.swimAction)this.swimAction.spinning = true;
            this.rotateLeftBoolean = true;
        },
        rightHit: function (){
            //if(this.activeMode === 'bounce')break;
            if(this.swimAction)this.swimAction.spinning = true;
            this.rotateRightBoolean = true;
        },
        keyRelease: function () {
            if(this.swimAction)this.swimAction.spinning = false;
            this.rotateLeftBoolean = false;
            this.rotateRightBoolean = false;
            this.idle = true;
            if(this.activeMode === 'fly')this.activeAction.fire(false);
        },
        keyDown: function (e) {
            //e.preventDefault();
            //this.hero.heroJump.look();
            switch (e.keyCode) {
                case 32:
                // space
                    this.spaceHit();
                    break;
                case 37:
                    // left
                    this.leftHit();
                    break;
                case 38:
                    // up
                    this.upHit();
                    break;
                case 39:
                    // right
                    this.rightHit();
                    break;
                case 40:
                    break;
                default:
                    this.downHit();
            }
        },
        keyUp: function (e) {
            e.preventDefault();
            this.keyRelease();
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