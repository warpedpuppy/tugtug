import Utils from './utils/utils';
import Assets from './utils/assetCreation';
import Tweens from './utils/Tweens';
import OrientationChange from './utils/orientationChange';
import Clock from './supportingClasses/universal/clock';
import Swim from './supportingClasses/swim/indexSwim';
import Bounce from './supportingClasses/bounce/indexBounce';
import Fly from './supportingClasses/fly/indexFly';
import Jump from './supportingClasses/jump/indexJump';
import TransitionAnimation from './supportingClasses/grid/items/transition/transitionAnimation';
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
import Grid from './supportingClasses/grid/gridIndex';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Animations from './supportingClasses/universal/animations/animationsIndex';

export default function(obj) {
    return {
        mode: ['fly','swim'],
        activeModeIndex: 0,
        activeMode: undefined,
        filterContainer: Assets.Container(),
        action: true,
        gears: Gears(),
        clock: Clock(),
        filterAnimation: FilterAnimation(),
        hero: Hero(),
        transitionAnimation: TransitionAnimation(),
        transitionAnimationPlaying: false,
        utils: Utils,
        score: Score(),
        loader: Assets.Loader(),
        activeAction: undefined,
        swim: Swim(),
        bounce: Bounce(),
        fly: Fly(),
        jump: Jump(),
        tokens: Tokens(),
        controlPanel: ControlPanel(),
        grid: Grid(),
        dbData: {},
        storeAction: true,
        timeOut: undefined,
        levelComplete: LevelComplete(),
        fullStop: false,
        animations: Animations(),
        all: true,
        init: function (isMobile, isMobileOnly) {
             console.log('window.devicePixelRatio', window.devicePixelRatio)
            if (Config.testingBounce) {
                this.mode = ['bounce'];
            }

            this.activeMode = this.mode[this.activeModeIndex];
            this.isMobile = isMobile;
            this.isMobileOnly = isMobileOnly;

            console.log(this.levelComplete);
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
        
            const fpsCounter = this.fpsCounter = new PixiFps();
            

            this.stage.addChild(this.filterContainer);

            this.getDatabaseData = this.getDatabaseData.bind(this);
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
                    .load(this.getDatabaseData)
            } else {
                this.getDatabaseData();
            }

        },
        getDatabaseData: function () {

           let indexToGet = (this.grid.boards)?this.grid.boards.length:0;
           let next = indexToGet + 1;
           let requestBoardNumber = (indexToGet === 0)?1:next;
           let that = this;
           axios
           .post(`${API_BASE_URL}/admin/gameLoadGrids`, {board: requestBoardNumber})
           .then(response => {
               
                this.dbData = response.data;
                if (indexToGet === 0) {
                    this.grid.boards = [...this.grid.boards, ...response.data.boards];
                    //this.grid.boards = [...this.grid.boards, response.data.boards];
                    this.buildGame();
                 } else {
                    if (response.data.boards) {
                        this.grid.boards = [...this.grid.boards, response.data.boards];
                    }
                    this.grid.addNewBoardData(this.dbData)
                 }
              
            })
            .catch(err => console.error(err));  
        },
        buildGame: function () {
            
            let spritesheet = this.loader.resources["/ss/ss.json"].spritesheet;

            this.utils.setProperties({
                spritesheet,
                canvasWidth: this.utils.canvasWidth,
                canvasHeight: this.utils.canvasHeight,
                app: this.app,
                root: this
            })

            Assets.init();

            this.gears.init().addToStage();

            this.clock.init().addToStage();

            //this.levelSlots.init(this).addToStage();
            this.tokens.init();

            this.grid.init();

            this.score.init()

            this.hero.init(undefined, this.stage).switchPlayer(this.mode[this.activeModeIndex]);

            this.utils.setHero(this.hero);

            this.filterAnimation.init(this.filterContainer);
            
            this.swim.init(this.stage);

            this.bounce.init(this.stage);

            this.fly.init(this);

            this.keyHandler = KeyHandler();
            this.keyHandler.init(this);

            this.jump.init(this.stage);
            
            this.transitionAnimation.init(this);

            this.animations.init();
           
 
            if (this.isMobile) {
                //ipad and mobile
                this.controlPanel.init(this);
                // this.testButton = Assets.Sprite('redTile.png');
                // this.testButton.x = 10;
                // this.testButton.y = 140;
                // this.testButton.interactive = true;
                let that = this;
                // this.testButton.pointerdown = function(){that.switchPlayer()};
                // this.stage.addChild(this.testButton)
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

            this.switchPlayer(this.mode[this.activeModeIndex]);

            if (!this.isMobile) {
                this.app.ticker.add(this.animateDesktopIpad);
                this.keyHandler.addToStage();
            } else {
                this.app.ticker.add(this.animateMobile); 
            }

            if (Config.testingJump) {
                this.makeJumpActive();
            }
            this.app.stage.addChild(this.fpsCounter);
            //this.animations.circles({start: true, expand: true});
        },
        stop: function () {
            window.onresize = undefined;
            if(this.app)this.app.destroy(true);
             if (!this.isMobile && this.keyHandler) {
                this.keyHandler.removeFromStage();
            }
        },
        earnToken: function (t) {
            //console.log('level complete');
            this.action = false;
            this.tokens.fillSlot(t);
            setTimeout(this.resumePlayAfterEarnToken.bind(this), 2000)
        },
        resumePlayAfterEarnToken: function () {
           // this.tokens.clearText();
            this.action = true;
        },
        increaseIndex: function() {
            this.activeModeIndex ++;
            if(this.activeModeIndex >= this.mode.length)this.activeModeIndex = 0;
            this.activeMode = this.mode[this.activeModeIndex];    
            return this.activeMode;  
        },
        switchPlayerWithAnimation: function (mode) {
           
            if (!this.transitionAnimationPlaying) {



                this.transitionAnimationPlaying = true;
                this.action = false;

                let oldActiveModeString = this.activeMode;
                this[this.activeMode].removeFromStage();

                this.activeMode = (mode)?mode:this.increaseIndex();
                let newActiveModeString = this.activeMode;

                if (this.activeMode === 'bounce') {
                    this.grid.removeFromStage();
                }
            
                this.transitionAnimation.start(oldActiveModeString, newActiveModeString); 
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

            this.score.switchMode();
        },
        resizeBundle: function () {
            if (this.activeMode === 'fly' || this.activeMode === 'swim') {
                this.grid.resize();
            }
            this.score.resize();
            this.clock.resize();
            this.gears.resize();
            this.hero.resize();
            this.swim.resize();
            this.bounce.resize();
            this.fly.resize();
            this.jump.resize();
            this.tokens.resize();
            if (this.isMobile) {
                this.controlPanel.resize();
            }    
        },
        resizeHandler: function () {
            this.canvasWidth =  this.utils.returnCanvasWidth(this.isMobileOnly);
            this.canvasHeight = this.utils.returnCanvasHeight(this.isMobileOnly);

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
        startSpaceShipJourney: function () {
            this.storeActiveMode = this.activeMode;
            this.hero.cont.visible = false;
            this.activeAction.vx = this.activeAction.vy = 0;
            this.grid.gridAction.pause = true;
            this[this.activeMode].startSpaceShipJourney();
        },
        endSpaceShipJourney: function () {

            this.jump.removeFromStage();
            
            this.switchPlayer(this.storeActiveMode);
           
            this.grid.gridBuild.placeHero();
  
            this.grid.gridBuild.cont.addChild(this.grid.gridBuild.spaceShip);

            this.grid.gridAction.pause = false;
       
            this.activeAction.vx = this.activeAction.vy = 0;

            this.activeAction.radius = this.activeAction.storeRadius = 0;

            this[this.activeMode].endSpaceShipJourney();
        },
        makeJumpActive: function () {
            this.jump.jumpBackground.pause = false;
            this.jump.jumpAction.pause = false;
            this.hero.cont.visible = true;
            //this.ship.parent.removeChild(this.ship);
            
            this.switchPlayer("jump");
           // this.jump.jumpBackground.addSpace();

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
           
            this.grid.nextBoard(); 
            this.keyHandler.addToStage();  
            this.getDatabaseData();

            this.fullStop = false;

            this.app.stage.addChild(this.fpsCounter);
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

            this.transitionAnimation.animate();

            this.animations.animate();
           

            if (this.action) {
                if(this.rotateLeftBoolean) {
                    this.activeAction.rotate('left');
                } else if(this.rotateRightBoolean) {
                    this.activeAction.rotate('right');
                }
                this.clock.animate();
                this.filterAnimation.animate();
                this.gears.animate();
               // this.activeAction.animate();
                this[this.activeMode].animate();
                if (this.activeMode === 'swim' || this.activeMode === 'fly') {
                    this.grid.animate(this.activeAction.vx, this.activeAction.vy);
                }
               
            }
        }
    }
}