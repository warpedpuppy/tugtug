import Utils from './utils/utils';
import Assets from './utils/assetCreation';
import Config from './animationsConfig';
import Tweens from './utils/Tweens';
import OrientationChange from './utils/orientationChange';
import Clock from './supportingClasses/universal/clock';
import Fly from './supportingClasses/fly/indexFly';
import FilterAnimation from './supportingClasses/grid/items/magic/filterAnimation';
import Gears from './supportingClasses/universal/gears';
import Hero from './supportingClasses/universal/hero';
import Score from '../animations/supportingClasses/universal/score/scoreIndex';
import ControlPanel from './supportingClasses/universal/controlPanel';
import LevelComplete from './supportingClasses/universal/levelComplete';
import MobileMask from './supportingClasses/universal/mobileMask';
import Tokens from './supportingClasses/universal/tokens/tokenIndex';
import LoadingAnimation from './supportingClasses/universal/loadingAnimation';
import PixiFps from "pixi-fps";
import KeyHandler from './supportingClasses/universal/keyHandler';
import Grid from './supportingClasses/grid/gridIndex';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Resize from './supportingClasses/fly/flyResize';

export default function(obj) {
    return {
        mode: ['fly'],
        activeModeIndex: 0,
        activeMode: undefined,
        filterContainer: Assets.Container(),
        action: true,
        gears: Gears(),
        clock: Clock(),
        filterAnimation: FilterAnimation(),
        hero: Hero(),
        utils: Utils,
        score: Score(),
        loader: Assets.Loader(),
        activeAction: undefined,
        fly: Fly(),
        tokens: Tokens(),
        controlPanel: ControlPanel(),
        grid: Grid(),
        dbData: {},
        levelComplete: LevelComplete(),
        fullStop: false,
        orientationChange: OrientationChange,
        kingCont: Assets.Container(),
        frame: Assets.Graphics(),
        kingContBackground: Assets.Graphics(),
        resize: Resize(),
        init: function (isMobile, isMobileOnly) {

            this.activeMode = this.mode[this.activeModeIndex];
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
                true
            );
            document.getElementById('homeCanvas').appendChild(app.view);
            this.stage = app.stage;

            this.stage.addChild(this.kingCont);
        
            this.fpsCounter = new PixiFps();
            this.fpsCounter.x = this.utils.canvasWidth - 75;
            
            LoadingAnimation.start(this.kingCont);

            this.kingCont.addChild(this.filterContainer);

            this.getDatabaseData = this.getDatabaseData.bind(this);
            this.buildGame = this.buildGame.bind(this);
            this.startGame = this.startGame.bind(this);
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
        pause: function (boolean) {
            this.action = boolean
        },
        getDatabaseData: function () {

           let indexToGet = (this.grid.boards)?this.grid.boards.length:0;
           let next = indexToGet + 1;
           let requestBoardNumber = (indexToGet === 0)?1:next;

           axios
           .post(`${API_BASE_URL}/admin/gameLoadGrids`, {board: requestBoardNumber})
           .then(response => {
                this.dbData = response.data;
                if (indexToGet === 0) {
                    this.grid.boards = [...this.grid.boards, ...response.data.boards];
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

            this.gears.init().addToStage();
            this.clock.init().addToStage();
            this.tokens.init();
            this.grid.init();
            this.score.init()
            this.hero.init(undefined, this.kingCont).switchPlayer(this.mode[this.activeModeIndex]);

            if (this.isMobileOnly) {
                this.hero.cont.scale.set(Config.mobileOnlyScaling)
            }
            
            this.utils.setHero(this.hero);

            this.filterAnimation.init(this.filterContainer);

            this.fly.init(this);

            this.keyHandler = KeyHandler();

            this.keyHandler.init(this);

            this.activeAction = this.fly.addToStage();   
 
            if (this.isMobile) {
                //ipad and mobile
                this.controlPanel.init(this);
                this.controlPanel.addToStage();
            } 
               
            if (this.isMobileOnly) {
                //mobile
                OrientationChange.init(this);
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

            this.app.stage.addChild(this.fpsCounter);

           LoadingAnimation.stop(this.kingCont);
        },
        stop: function () {
            window.onresize = undefined;
            if(this.app)this.app.destroy(true);
             if (!this.isMobile && this.keyHandler) {
                this.keyHandler.removeFromStage();
            }
        },
        earnToken: function (t) {
            this.action = false;
            this.tokens.fillSlot(t);
            setTimeout(this.resumePlayAfterEarnToken.bind(this), 2000)
        },
        resumePlayAfterEarnToken: function () {
            this.action = true;
        },
        reset: function () {
            this.score.nextLevel();
            this.tokens.reset();
            this[this.activeMode].removeFromStage();
            this.grid.nextBoard(); 
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
                this.fly.animate();
                this.grid.animate(this.activeAction.vx, this.activeAction.vy);
            }
        }
    }
}