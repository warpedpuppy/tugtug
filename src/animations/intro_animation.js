import Utils from './utils/utils';
import Assets from './utils/assetCreation';
import Tweens from './utils/tweens';
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
import Score from '../animations/supportingClasses/universal/score';
import ControlPanel from './supportingClasses/universal/controlPanel';
import LevelSlots from './supportingClasses/tokens/levelSlots';
import PixiFps from "pixi-fps";
import Config from './animationsConfig';
import KeyHandler from './supportingClasses/universal/keyHandler';
import Grid from './supportingClasses/grid/gridIndex';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function(obj) {
    return {
        mode: ['fly','swim','bounce'],
        activeModeIndex: 0,
        activeMode: undefined,
        filterContainer: Assets.Container(),
        action: true,
        gears: Gears,
        clock: Clock,
        filterAnimation: FilterAnimation(),
        hero: Hero(),
        transitionAnimation: TransitionAnimation,
        transitionAnimationPlaying: false,
        utils: Utils,
        score: Score(),
        loader: Assets.Loader(),
        activeAction: undefined,
        swim: Swim(),
        bounce: Bounce(),
        fly: Fly(),
        jump: Jump(),
        levelSlots: LevelSlots(),
        controlPanel: ControlPanel(),
        grid: Grid,
        dbData: {},
        storeAction: true,
        init: function (isMobile, isMobileOnly) {

            this.activeMode = this.mode[this.activeModeIndex];
            this.isMobile = isMobile;
            this.isMobileOnly = isMobileOnly;

         
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
        
            const fpsCounter = new PixiFps();
            app.stage.addChild(fpsCounter);

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
           let indexToGet = this.grid.boards.length;
           let next = indexToGet + 1;
           let requestBoardNumber = (indexToGet === 0)?1:next;
           let that = this;
           axios
           .post(`${API_BASE_URL}/admin/gameLoadGrids`, {board: requestBoardNumber})
           .then(response => {
                this.dbData = response.data;
                if (indexToGet === 0) {
                    this.buildGame();
                 } else {
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

            this.grid.init();

            this.score.init()

            this.hero.init(undefined, this.stage).switchPlayer(this.mode[this.activeModeIndex]);

            this.utils.setHero(this.hero);

            this.filterAnimation.init(this.filterContainer);
            
            this.swim.init(this.stage);

            this.bounce.init(this.stage);

            this.fly.init(this);

            this.jump.init(this.stage);
            
            this.levelSlots.init(this).addToStage();

            this.transitionAnimation.init(this);
           
            this.keyHandler = KeyHandler();
            this.keyHandler.init(this);
            if (this.isMobile) {
                //ipad and mobile
                this.controlPanel.init(this);
                this.testButton = Assets.Sprite('redTile.png');
                this.testButton.x = 10;
                this.testButton.y = 140;
                this.testButton.interactive = true;
                let that = this;
                this.testButton.pointerdown = function(){that.switchPlayer()};
                this.stage.addChild(this.testButton)
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

            let index = this.stage.getChildIndex(this.clock.cont) + 1;
            this.grid.addToStage(index);

        },
        stop: function () {
            window.onresize = undefined;
            if(this.app)this.app.destroy(true);
             if (!this.isMobile) {
                this.keyHandler.removeFromStage();
            }
        },
        increaseIndex: function() {
            this.activeModeIndex ++;
            if(this.activeModeIndex >= this.mode.length)this.activeModeIndex = 0;
            this.activeMode = this.mode[this.activeModeIndex];    
            return this.activeMode;  
        },
        switchPlayer: function (str) {

            if (this[this.activeMode]) this[this.activeMode].removeFromStage();
            
            if (str) {
                this.activeMode = str;
            } else {
                this.increaseIndex();
            }
            
            this.hero.cont.visible = true;
            this.hero.switchPlayer(this.activeMode);
            

            if (this.activeMode !== 'jump') {
                this.grid.changeGridSize();
                this.activeAction = this[this.activeMode].addToStage();
            } else {
                this.activeAction = this.jump.jumpAction;
            }

            
            if (this.isMobile) {
                if (this.activeMode === 'bounce') {
                    this.controlPanel.removeFromStage();
                } else {
                    this.controlPanel.addToStage();
                }
            }
        },
        switchPlayerWithAnimation: function (mode) {
            
            if (!this.transitionAnimationPlaying) {
                this.grid.clearGrid();
                this.action = false;
                this.transitionAnimationPlaying = true;
                let oldActiveMode = this[this.activeMode];
                oldActiveMode.removeFromStage();

                this.activeMode = (mode)?mode:this.increaseIndex();

                let newActiveMode = this[this.activeMode];
                this.transitionAnimation.start(newActiveMode, Grid); 
            }
        },
        completeSwitchPlayerAnimation: function () {
            this.transitionAnimationPlaying = false;
            this.hero.switchPlayer(this.activeMode);
            this.activeAction = this[this.activeMode].addToStage();
            if (this.activeMode !== 'bounce') {
                this.grid.changeGridSize()
            } else {
                this.grid.gridAction.pause = true;
                this.grid.gridBuild.cont.visible = false;
            }
           
            this.action = true;
        },
        resizeBundle: function () {
            this.grid.resize();
            this.clock.resize();
            this.gears.resize();
            this.hero.resize();
            this.swim.resize();
            this.bounce.resize();
            this.fly.resize();
            this.jump.resize();
            this.levelSlots.resize();
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
        },
        startSpaceShipJourney: function () {
            this.hero.cont.visible = false;
            this.activeAction.vx = this.activeAction.vy = 0;
            this.grid.gridAction.pause = true;
            this[this.activeMode].startSpaceShipJourney();
        },
        endSpaceShipJourney: function () {
            this[this.activeMode].endSpaceShipJourney();
        },
        reset: function () {
            this.jump.reset();
            this.levelSlots.reset();
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
        animate: function () {

            this.transitionAnimation.animate();
            if (this.transitionAnimation.done) {
                this.transitionAnimation.reset();
            }
            this.score.animate();

            Tweens.animate();
          
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