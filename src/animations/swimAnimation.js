import Utils from './utils/utils';
import Assets from './utils/assetCreation';
import Tweens from './utils/Tweens';
import OrientationChange from './utils/orientationChange';
import Clock from './supportingClasses/universal/clock';
import Swim from './supportingClasses/swim/indexSwim';
import FilterAnimation from './supportingClasses/grid/items/magic/filterAnimation';
import Gears from './supportingClasses/universal/gears';
import Hero from './supportingClasses/universal/hero';
import ControlPanel from './supportingClasses/universal/controlPanel';
import LevelComplete from './supportingClasses/universal/levelComplete';
import Tokens from './supportingClasses/universal/tokens/tokenIndex';
import PixiFps from "pixi-fps";
import Config from './animationsConfig';
import KeyHandler from './supportingClasses/universal/keyHandler';
import Grid from './supportingClasses/grid/gridIndex';
import LoadingAnimation from './supportingClasses/universal/loadingAnimation';
import MobileMask from './supportingClasses/universal/mobileMask';
import Resize from './supportingClasses/swim/swimResize';
import MazeServices from '../services/maze-service';
import DefaultMaze from '../defaults/DefaultMaze';

export default function(obj) {
    return {
        mode: ['swim'],
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
        loader: Assets.Loader(),
        activeAction: undefined,
        swim: Swim(),
        tokens: Tokens(),
        controlPanel: ControlPanel(),
        grid: Grid(),
        dbData: {},
        storeAction: true,
        timeOut: undefined,
        levelComplete: LevelComplete(),
        fullStop: false,
        kingCont: Assets.Container(),
        frame: Assets.Graphics(),
        kingContBackground: Assets.Graphics(),
        resize: Resize(),
        orientationChange: OrientationChange(),
        showFPS: false,
        init: function (isMobile, isMobileOnly, id, parent) {
            this.id = id;

            if (!this.id) {
                parent.redirectHome();
                return;
            }

            this.utils.root = this;
            this.activeMode = this.mode[this.activeModeIndex];
            this.isMobile = isMobile;
            this.isMobileOnly = isMobileOnly;

            this.levelComplete.init();

         
            if (!this.isMobile) {
                this.utils.getWidthAndHeight();
            } else {
                let test1 = this.utils.returnCanvasWidth(),
                    test2 = this.utils.returnCanvasHeight();

                if (test1 > test2) {
                    //landscape
                    this.orientationChange.makeLandscape();
                    
                } else {
                    // portrait
                    this.orientationChange.makePortrait();
                }
            }

            var app = this.app = Assets.Application( 
                this.utils.canvasWidth,  
                this.utils.canvasHeight, 
                true
            );
            document.getElementById('homeCanvas').appendChild(app.view);
            this.stage = app.stage;
            this.stage.addChild(this.kingCont);
            
          
           
            if (this.showFPS) {
                this.fpsCounter = new PixiFps();
                this.fpsCounter.x = this.utils.canvasWidth - 75;
            }
            


            LoadingAnimation.start(this.kingCont);

            this.kingCont.addChild(this.filterContainer);

            this.loadDB = this.loadDB.bind(this)
            this.buildGame = this.buildGame.bind(this);
            this.startGame = this.startGame.bind(this);
            this.animate = this.animate.bind(this);
            this.animateDesktopIpad = this.animateDesktopIpad.bind(this);
            this.animateMobile = this.animateMobile.bind(this)

            if (!this.loader.resources["/ss/ss.json"]) {
                 this.loader
                    .add("/ss/ss.json")
                    .add("Hobo", "/fonts/hobostd.xml")
                    .load(this.loadDB)
            } else {
                this.loadDB();
            }

        },
        loadDB: async function() {
            try {
                let res = await MazeServices.getOneMaze(this.id)
                this.grid.boards = [...this.grid.boards, ...res];
                this.buildGame();
            } catch (e) {
                this.grid.boards = [...this.grid.boards, ...DefaultMaze];
                this.buildGame();
            }
        },
        changeGrid: function (obj) {
            this.id = obj.id;
            try {
                //let res = await MazeServices.getOneMaze(this.id)
                let test = this.grid.boards.find( item => item.id === obj.id);
                if ( test ) {
                    this.grid.nextBoard(obj.id);
                } else {
                    this.grid.boards = [...this.grid.boards, obj];
                    this.grid.nextBoard(obj.id);
                }
            } catch (e) {
                this.grid.boards = [...this.grid.boards, ...DefaultMaze];
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

            if (this.isMobile) {
                this.mobileMask = MobileMask();
                this.backgroundColor = 0x000099;
                this.mobileMask.setMask();
            }
            Assets.init();

            this.gears.init().addToStage();

            this.clock.init().addToStage();

            this.tokens.init();

            this.grid.init();

            this.hero.init(undefined, this.kingCont).switchPlayer(this.mode[this.activeModeIndex]);

            if (this.isMobileOnly) {
                this.hero.cont.scale.set(Config.mobileOnlyScaling)
            }

            this.utils.setHero(this.hero);

            this.filterAnimation.init(this.filterContainer);
            
            this.swim.init(this.kingCont);

            this.keyHandler = KeyHandler();

            this.keyHandler.init(this);

            this.activeAction = this[this.activeMode].addToStage(); 
           
            if (this.isMobile) {
                this.controlPanel.init(this);
                this.controlPanel.addToStage();
            } 
               
            if (this.isMobile) {
                //mobile
                this.orientationChange.init(this);
            } else {
                 window.onresize = this.resize.resizeHandler.bind(this.resize);
            }
            
            this.startGame();
        },
        startGame: function () {

            if (!this.isMobile) {
                this.app.ticker.add(this.animateDesktopIpad);
                this.keyHandler.addToStage();
            } else {
                this.app.ticker.add(this.animateMobile); 
            }

            if (Config.testingJump) {
                this.makeJumpActive();
            }
            if (this.showFPS)this.app.stage.addChild(this.fpsCounter);
            //this.animations.circles({start: true, expand: true});
            LoadingAnimation.stop(this.kingCont);
        },
        stop: function () {
            window.onresize = undefined;
            
            if (this.app) this.app.destroy(true);

            if (!this.isMobile && this.keyHandler) {
                this.keyHandler.removeFromStage();
            }

            Tweens.killAll();
        },
        earnToken: function (t) {
            this.action = false;
            this.tokens.fillSlot(t);
            setTimeout(this.resumePlayAfterEarnToken.bind(this), 2000)
        },
        resumePlayAfterEarnToken: function () {
           // this.tokens.clearText();
            this.action = true;
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
            this.jump.jumpBackground.setUp();

             if (Config.testingJump) {
                let background = this.utils.root.jump.jumpBackground.orbsCont;
                background.scale.set(1)
                this.jump.addToStage();
            }

        },
        reset: function () {
            this.tokens.reset();

           // this[this.activeMode].removeFromStage();
          
            this.grid.nextBoard(); 
            this.keyHandler.addToStage();  

            this.fullStop = false;
        },
        filterTest: function () {
            this.filterAnimation.filterToggle();
        },
        animateMobile: function () {
            this.orientationChange.animate();
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
               // this.activeAction.animate();
                this[this.activeMode].animate();
                if (this.activeMode === 'swim' || this.activeMode === 'fly') {
                    this.grid.animate(this.activeAction.vx, this.activeAction.vy);
                }
               
            }
        }
    }
}