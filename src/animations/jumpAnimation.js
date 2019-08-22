import Utils from './utils/utils';
import Assets from './utils/assetCreation';
import Tweens from './utils/Tweens';
import OrientationChange from './utils/orientationChange';
import Clock from './supportingClasses/universal/clock';
import MobileMask from './supportingClasses/universal/mobileMask';
import LoadingAnimation from './supportingClasses/universal/loadingAnimation';
import Jump from './supportingClasses/jump/indexJump';
import FilterAnimation from './supportingClasses/grid/items/magic/filterAnimation';
import Gears from './supportingClasses/universal/gears';
import Hero from './supportingClasses/universal/hero';
import Score from '../animations/supportingClasses/universal/score/scoreIndex';
import ControlPanel from './supportingClasses/universal/controlPanel';
import LevelComplete from './supportingClasses/universal/levelComplete';
import Tokens from './supportingClasses/universal/tokens/tokenIndex';
import PixiFps from "pixi-fps";
import Config from './animationsConfig';
import KeyHandler from './supportingClasses/universal/keyHandler';

export default function(obj) {
    return {
        activeModeIndex: 0,
        activeMode: undefined,
        filterContainer: Assets.Container(),
        action: true,
        gears: Gears(),
        clock: Clock(),
        filterAnimation: FilterAnimation(),
        hero: Hero(),
        transitionAnimationPlaying: false,
        utils: Utils,
        score: Score(),
        loader: Assets.Loader(),
        activeAction: undefined,
        jump: Jump(),
        tokens: Tokens(),
        controlPanel: ControlPanel(),
        dbData: {},
        storeAction: true,
        timeOut: undefined,
        levelComplete: LevelComplete(),
        fullStop: false,
        keyHandler: KeyHandler(),
        kingCont: Assets.Container(),
        frame: Assets.Graphics(),
        kingContBackground: Assets.Graphics(),
        init: function (isMobile, isMobileOnly) {
            
            Tweens.killAll();

            if (Config.testingBounce) {
                this.mode = ['bounce'];
            }

            this.isMobile = isMobile;
            this.isMobileOnly = isMobileOnly;

            this.levelComplete.init();

         
            if (!this.isMobileOnly) {
                this.utils.getWidthAndHeight();
            } else {
                let test1 = this.utils.returnCanvasWidth(),
                    test2 = this.utils.returnCanvasHeight();

                if (test1 > test2) {
                    //landscape
                    OrientationChange.makeLandscape();
                    
                } else {
                    // portrait
                    OrientationChange.makePortrait();
                }
            }

            var app = this.app = Assets.Application( 
                this.utils.canvasWidth,  
                this.utils.canvasHeight, 
                false
            );
            document.getElementById('homeCanvas').appendChild(app.view);
            this.stage = app.stage;

             this.stage.addChild(this.kingCont);
            
          
         
        
            LoadingAnimation.start(this.kingCont);

            this.fpsCounter = new PixiFps();
            
            this.stage.addChild(this.filterContainer);

            this.buildGame = this.buildGame.bind(this);
            this.startGame = this.startGame.bind(this);
            this.switchPlayer = this.switchPlayer.bind(this);
            this.animate = this.animate.bind(this);
            this.animateDesktopIpad = this.animateDesktopIpad.bind(this);
            this.animateMobile = this.animateMobile.bind(this)

            if (!this.loader.resources["/ss/ss.json"]) {
                 this.loader
                    .add("/ss/ss.json")
                    .add("Hobo", "/fonts/hobostd.xml")
                    .load(this.buildGame)
            } else {
                this.buildGame();
            }
           
        },
        pause: function (boolean) {
            this.action = boolean
        },
        buildGame: function () {
            
            let spritesheet = this.loader.resources["/ss/ss.json"].spritesheet;

              this.utils.setProperties({
                isMobileOnly: this.isMobileOnly,
                isMobile: this.isMobile,
                spritesheet,
                canvasWidth: this.utils.canvasWidth,
                canvasHeight: this.utils.canvasHeight,
                app: this.app,
                root: this
            })

               if (this.isMobileOnly) {
                this.mobileMask = MobileMask();
                this.backgroundColor = 0x000000;
                this.mobileMask.setMask();
            }
            Assets.init();

            this.hero.init(undefined, this.stage).switchPlayer('jump');
            if (this.isMobileOnly) {
                this.hero.cont.scale.set(Config.mobileOnlyScaling)
            }

            this.utils.setHero(this.hero);

            this.jump.init(this.kingCont);
            
            this.gears.init().addToStage();

            this.clock.init().addToStage();
            
            this.keyHandler.init(this);
            if (this.isMobile) {
                //ipad and mobile
                this.controlPanel.init(this);
            } 
               
            if (this.isMobileOnly) {
                //mobile
                OrientationChange.init(this);
            } else {
                 window.onresize = this.resizeHandler.bind(this);
            }
            
            this.startGame();
        },
        startGame: function () {

            this.switchPlayer('jump');

            if (!this.isMobile) {
                this.app.ticker.add(this.animateDesktopIpad);
                this.keyHandler.addToStage();
            } else {
                this.app.ticker.add(this.animateMobile); 
            }
          
            this.makeJumpActive();
           
            LoadingAnimation.stop(this.kingCont);
            //this.animations.circles({start: true, expand: true});
        },
        stop: function () {
            window.onresize = undefined;
            if(this.app)this.app.destroy(true);
             if (!this.isMobile && this.keyHandler) {
                this.keyHandler.removeFromStage();
            }
        },
        switchPlayer: function (str) {
           
            if (str) {
                this.activeMode = str;
            } else {
                this.increaseIndex();
            }
 
           this.hero.switchPlayer(this.activeMode);

           if (this.activeMode === 'jump') {
                this.activeAction = this.jump.jumpAction;
            } else {
                this.activeAction = this[this.activeMode].addToStage();   
            }

            if (this.isMobile) {
                if (this.activeMode === 'bounce') {
                    this.controlPanel.removeFromStage();
                } else {
                    this.controlPanel.addToStage();
                }
            }
          
            this.transitionAnimationPlaying = false;
            this.action = true;

        },
        resizeBundle: function () {
            this.clock.resize();
            this.gears.resize();
            this.hero.resize();
            this.jump.resize();
            if (this.isMobile) {
                this.controlPanel.resize();
            }    
        },
        resizeHandler: function () {
            this.canvasWidth =  this.utils.returnCanvasWidth(this.isMobileOnly);
            this.canvasHeight = this.utils.returnCanvasHeight(this.isMobileOnly) - 60;

            this.utils.resize(this.canvasWidth, this.canvasHeight);

            this.resizeBundle();
           
            this.app.renderer.resize(this.canvasWidth, this.canvasHeight);

            this.action = false;

            if(this.timeOut){
                clearTimeout(this.timeOut);
            }
            this.timeOut = setTimeout(this.resized.bind(this), 200)

        },
        resized: function () {
            this.action = true;
            clearTimeout(this.timeOut);
        },
        makeJumpActive: function () {
            this.jump.addToStage();
            this.jump.jumpBackground.pause = false;
            this.jump.jumpAction.pause = false;
            this.hero.cont.visible = true;
 
            this.switchPlayer("jump");

             if (Config.testingJump) {
                let background = this.utils.root.jump.jumpBackground.orbsCont;
                background.scale.set(1)
                this.jump.addToStage();
            }
            this.app.stage.addChild(this.fpsCounter);
        },
        reset: function () {
            this.score.nextLevel();
            this.tokens.reset();
            this.jump.reset();
            this.bounce.reset();

            this[this.activeMode].removeFromStage();
            this.switchPlayer(this.mode[0]);
           
           // this.grid.nextBoard(); 
            this.keyHandler.addToStage();  
            this.getDatabaseData();

            this.fullStop = false;
        },
        filterTest: function () {
            this.filterAnimation.filterToggle();
        },
        animateMobile: function () {
            OrientationChange.animate();
            this.animate();
        },
        animateDesktopIpad: function () {
            this.animate();
        },
        levelCompleteHandler: function () {
            this.levelComplete.boardComplete();


        },
        animate: function () {

            Tweens.animate();

            if(this.fullStop)return;

            if (this.action) {
                if(this.rotateLeftBoolean) {
                    this.activeAction.rotate('left');
                } else if(this.rotateRightBoolean) {
                    this.activeAction.rotate('right');
                }
                this.clock.animate();
                this.filterAnimation.animate();
                this.gears.animate();
                this[this.activeMode].animate();
               
            }
        }
    }
}