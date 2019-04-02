import Utils from './utils/utils';
import Assets from './utils/assetCreation';
import OrientationChange from './utils/orientationChange';
import Clock from './supportingClasses/clock';
import Swim from './supportingClasses/swim/indexSwim';
import Bounce from './supportingClasses/bounce/indexBounce';
import Fly from './supportingClasses/fly/indexFly';
import Jump from './supportingClasses/jump/indexJump';
import Pellets from './supportingClasses/pellets';
import Treasure from '../animations/supportingClasses/treasure';
import MagicPills from './supportingClasses/magicPills';
import TransitionItems from './supportingClasses/transitionItems';
import TransitionAnimation from './supportingClasses/transitionAnimation';
import FilterAnimation from './supportingClasses/filterAnimation';
import Gears from './supportingClasses/gears';
import Hero from './supportingClasses/hero';
import Score from '../animations/supportingClasses/score';
import ControlPanel from './supportingClasses/controlPanel';
import LevelSlots from './supportingClasses/level/levelSlots';
//import IntroScreen from './supportingClasses/introScreen';
import PixiFps from "pixi-fps";
import Config from './animationsConfig';
import KeyHandler from './supportingClasses/keyHandler';
import Grid from './supportingClasses/grid/gridIndex';
//import Animate from './supportingClasses/action/animate';'jump', 
import axios from 'axios';
import { API_BASE_URL } from '../config';
export default function(obj) {
    return {
        idle: true,
        vx: 0,
        vy: 5,
        rotateLeftBoolean: false,
        rotateRightBoolean: false,
        renderTextureTestBoolean: false,
        inc: 90,
        mode: ['fly', 'bounce', 'swim'],
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
        transitionAnimation: TransitionAnimation,
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
        transitionAnimationPlaying: false,
        grid: Grid,
        dbData: {},
        init: function (isMobile, isMobileOnly) {

            this.activeMode = this.mode[this.activeModeIndex];
            this.cropHeight = 100;
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

            this.stage.addChild(this.backgroundCont);
            this.stage.addChild(this.filterContainer);
            this.stage.addChild(this.foregroundCont);

            this.addButton = this.addButton.bind(this)
            this.uponNewBoardButtonPress = this.uponNewBoardButtonPress.bind(this)

            this.getDataBaseData = this.getDataBaseData.bind(this);
            this.buildGame = this.buildGame.bind(this);
            if (!this.loader.resources["/ss/ss.json"]) {
                 this.loader
                    .add("/ss/ss.json")
                    .add("Hobo", "/fonts/hobostd.xml")
                    //.load(this.start);
                    .load(this.getDataBaseData)
            } else {
                //this.start();
                this.getDataBaseData();
            }

        },
        getDataBaseData: function () {
           let indexToGet = this.grid.boards.length;
           //console.log(indexToGet) 
           let next = indexToGet + 1;
           let requestBoardNumber = (indexToGet === 0)?1:next;
           let that = this;
           axios
           .post(`${API_BASE_URL}/admin/gameLoadGrids`, {board: requestBoardNumber})
           .then(response => {
                //console.log('home canvas response = ', response)
                //that.

                (response.data.board)
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
            
            this.spritesheet = this.loader.resources["/ss/ss.json"].spritesheet;

            this.utils.setProperties({
                spritesheet: this.spritesheet,
                canvasWidth: this.utils.canvasWidth,
                canvasHeight: this.utils.canvasHeight,
                app: this.app,
                root: this
            })

            Assets.init();

            this.grid.init(this);

            this.score.init()

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

            this.fly.init(this);

            this.jump.init(this.stage);
            
            this.levelSlots.init(this).addToStage();

            this.startGame = this.startGame.bind(this);
            //this.introScreen.init(this.stage, this.startGame).addToStage();

            this.switchPlayer = this.switchPlayer.bind(this);

            this.screen.beginFill(0x000000).drawRect(0,0,this.utils.canvasWidth, this.utils.canvasHeight);
            this.stage.addChild(this.screen);

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
           
            //this.startGame();
           
            if (this.isMobileOnly) {
                //mobile
                OrientationChange.init(this);
            } else {
                 window.onresize = this.resizeHandler.bind(this);
            }
            
            this.startGame();
        },
        startGame: function () {
            //this.mode = this.utils.shuffle(this.mode);
            //this.introScreen.removeFromStage();
            this.switchPlayer(this.mode[this.activeModeIndex]);
            this.app.ticker.add(this.animate.bind(this));
            this.stage.removeChild(this.screen);
            this.clock.addToStage();

            if (!this.isMobile) {
                this.app.ticker.add(this.animateDesktopIpad.bind(this));
                this.keyHandler.addToStage();
            } else {
                this.app.ticker.add(this.animateMobile.bind(this)); 
            }


            this.transitionAnimation.init(this);

            //grid has to take a trip to the server to get the 
            // this.grid.init(this, this.grassSquare);
             let index = this[this.activeMode].background.gridIndex + 1;
             this.grid.addToStage(index);


    
        },
        boardComplete: function () {
            //alert("board complete!");

            //wait 10 seconds
            setTimeout(this.addButton, Config.boardCompleteButtonAppearDelay);
            // add button

            

            this.addButton = this.addButton.bind(this)
            this.uponNewBoardButtonPress = this.uponNewBoardButtonPress.bind(this)
        },
        addButton: function () {
            console.log('add button')
            if(!this.nextMazeButton){
                this.nextMazeButton = Assets.Sprite("nextMaze.png");
                this.nextMazeButton.anchor.set(0.5)
                this.nextMazeButton.x = this.utils.canvasWidth / 2;
                this.nextMazeButton.y = this.utils.canvasHeight / 2;
                this.nextMazeButton.interactive = this.nextMazeButton.buttonMode = true;
                this.nextMazeButton.on('pointerdown',this.uponNewBoardButtonPress);
            }
            this.stage.addChild(this.nextMazeButton)
        },
        uponNewBoardButtonPress: function (e) {
             this.stage.removeChild(this.nextMazeButton)

             // build board
             this.grid.nextBoard();

            // reset slots
            this.levelSlots.reset();
            // load new board

            this.loadNewBoard();
        },
        loadNewBoard: function () {
            this.getDataBaseData();
        },
        stop: function () {
            window.onresize = undefined;
            if(this.app)this.app.destroy(true);
             if (!this.isMobile) {
                this.keyHandler.removeFromStage();
            }
        },
        switchPlayer: function (str) {

            if (this[this.activeMode]) this[this.activeMode].removeFromStage();
            
            if (str) {
                this.activeMode = str;
            } else {
                this.increaseIndex();
            }
            


            this.hero.switchPlayer(this.activeMode);
            this.activeAction = this[this.activeMode].addToStage();
            this.pellets.changeMode(this.activeMode);
            this.grid.setAction(this.activeAction, this.activeMode);
            
            if (this.isMobile) {
                if (this.activeMode === 'bounce') {
                    this.controlPanel.removeFromStage();
                } else {
                    this.controlPanel.addToStage();
                }
            }
        },
        increaseIndex: function() {
            this.activeModeIndex ++;
            if(this.activeModeIndex >= this.mode.length)this.activeModeIndex = 0;
            this.activeMode = this.mode[this.activeModeIndex];
        },
        switchPlayerMaskedAction: function () {
            //this[this.activeMode].background.cont.alpha = 0.5;
            if (!this.transitionAnimationPlaying) {
                this.action = false;
                this.transitionAnimationPlaying = true;
                let oldActiveMode = this[this.activeMode];
                oldActiveMode.removeFromStage();
                // this.stage.setChildIndex(oldBackground.background.cont, 0);

                this.increaseIndex();
          

                let newActiveMode = this[this.activeMode];

                // this.hero.switchPlayer(this.activeMode);
                // this.activeAction = this[this.activeMode].addToStage();
                this.transitionAnimation.start(newActiveMode, Grid);
            }
            

        },
        resizeBundle: function () {
            this.clock.resize();
            this.gears.resize();
            this.hero.resize();
            this.swim.resize();
            this.bounce.resize();
            this.fly.resize();
            this.jump.resize();
            this.levelSlots.resize();
            if(this.isMobile){
                this.controlPanel.resize();
            }
            // this.magicPills.resize(wh);
            // this.treasure.resize(wh);
            // this.transitionItems.resize(wh);
            // this.filterAnimation.resize(wh);
            // this.pellets.resize(wh);
            // this.hero.resize(wh);
            // if(this.bouncePlatform)this.bouncePlatform.resize(wh);            
        },
        resizeHandler: function () {
            this.canvasWidth =  this.utils.returnCanvasWidth(this.isMobileOnly);
            this.canvasHeight = this.utils.returnCanvasHeight(this.isMobileOnly);

            this.utils.resize(this.canvasWidth, this.canvasHeight);

            this.resizeBundle();
           
         
            this.app.renderer.resize(this.canvasWidth, this.canvasHeight);
        },
        nightMode: function () {
            this.pellets.change();
            this.app._options.backgroundColor = '0x000000';
           // console.log(this.app._options.backgroundColor)
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
               // this.action = true;
            }

            if (this.action) {

                this.grid.animate(this.activeAction.vx, this.activeAction.vy);

                if(this.rotateLeftBoolean)this.activeAction.rotate('left');
                if(this.rotateRightBoolean)this.activeAction.rotate('right');
                this.clock.animate();
                this.filterAnimation.animate();
                
                this.gears.animate();
                
                this.pellets.animate(this.activeAction.vx, this.activeAction.vy);
                this.treasure.animate(this.activeAction.vx, this.activeAction.vy);
                this.transitionItems.animate(this.activeAction.vx, this.activeAction.vy);
                this.magicPills.animate(this.activeAction.vx, this.activeAction.vy);

                this.activeAction.animate();
                this[this.activeMode].animate();
            
            }
            
            


        }
    }
}