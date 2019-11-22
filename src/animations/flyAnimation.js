import Utils from './utils/utils';
import Assets from './utils/assetCreation';
import Config from './animationsConfig';
import OrientationChange from './utils/orientationChange';
//import LoadData from './utils/loadData';
import Clock from './supportingClasses/universal/clock';
import Fly from './supportingClasses/fly/indexFly';
import FlyAnimate from './supportingClasses/fly/flyAnimate';
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
import Resize from './supportingClasses/fly/flyResize';
import MazeServices from '../services/maze-service';

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
        orientationChange: OrientationChange(),
        kingCont: Assets.Container(),
        frame: Assets.Graphics(),
        kingContBackground: Assets.Graphics(),
        resize: Resize(),
       // loadData: LoadData(),
        flyAnimate: FlyAnimate(),
        init: function (isMobile, isMobileOnly, id) {
            this.id = id;
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
        
            this.fpsCounter = new PixiFps();
            this.fpsCounter.x = this.utils.canvasWidth - 75;
            
            LoadingAnimation.start(this.kingCont);

            this.kingCont.addChild(this.filterContainer);

           // this.loadData.getDatabaseData = this.loadData.getDatabaseData.bind(this);
            this.loadDB = this.loadDB.bind(this);
            this.buildGame = this.buildGame.bind(this);
            this.startGame = this.startGame.bind(this);
            this.flyAnimate.animate = this.flyAnimate.animate.bind(this);
            this.flyAnimate.animateDesktopIpad = this.flyAnimate.animateDesktopIpad.bind(this);
            this.flyAnimate.animateMobile = this.flyAnimate.animateMobile.bind(this)

            if (!this.loader.resources["/ss/ss.json"]) {
                 this.loader
                    .add("/ss/ss.json")
                    .add("Hobo", "/fonts/hobostd.xml")
                    .load(this.loadDB)
            } else {
               this.loadDB();
            }

        },
        loadDB: function() {
            console.log('load db')
            MazeServices.getOneMaze(this.id)
            .then( res => {
                if (Array.isArray(res)) {
                    this.grid.boards = [...this.grid.boards, ...res];
                    this.buildGame();
                } else {
                    this.grid.boards = [...this.grid.boards, res];
                    this.buildGame();
                }
                console.log(this.grid.boards)
            })
            .catch(error => {
                console.log(error)
            });

        },
        changeGrid: function (id) {
            this.id = id;
            MazeServices.getOneMaze(this.id)
            .then( res => {
                let test = this.grid.boards.find( item => item.id === res[0].id);
                if ( test ) {
                    this.grid.nextBoard(id);
                } else {
                    this.grid.boards = [...this.grid.boards, ...res];
                    this.grid.nextBoard(id);
                }
            })
            .catch(error => {
                console.log(error)
            });
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
                this.app.ticker.add(this.flyAnimate.animateDesktopIpad);
                this.keyHandler.addToStage();
            } else {
                this.app.ticker.add(this.flyAnimate.animateMobile); 
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
        reset: function () {
            this.score.nextLevel();
            this.tokens.reset();
            this[this.activeMode].removeFromStage();
            this.grid.nextBoard(); 
            this.keyHandler.addToStage();  
          //  this.loadData.getDatabaseData();
            this.fullStop = false;
        },
        filterTest: function () {
            this.filterAnimation.filterToggle();
        },
        levelCompleteHandler: function () {
            this.levelComplete.boardComplete();
        }
    }
}