import * as PIXI from 'pixi.js';
import Utils from './utils/utils';
import Platforms from './supportingClasses/platforms/platforms';
import BouncePlatform from './supportingClasses/bounce/bouncePlatform';
import BounceAction from './supportingClasses/actions/bounceAction';
import JumpAction from './supportingClasses/actions/jumpAction';
import SwimAction from './supportingClasses/actions/swimAction';
import MagicPills from './supportingClasses/magicPills';
import Hero from '../animations/supportingClasses/hero';
import PanelsBoard from '../animations/supportingClasses/panelsBoard';
import Pellets from '../animations/supportingClasses/pellets';
import FilterAnimation from '../animations/supportingClasses/filterAnimation';
import PixiFps from "pixi-fps";
import TransitionItems from './supportingClasses/transitionItems';
import Ripples from '../animations/supportingClasses/swim/ripples';
import Treasure from '../animations/supportingClasses/treasure';
import Score from '../animations/supportingClasses/score';
import Config from './animationsConfig';
export default function Game (userObject, getUserName, primaryUser){
    return {
        utils: Utils,
        backgroundCont: new PIXI.Container(),
        foregroundCont: new PIXI.Container(),
        pelletCont: new PIXI.Container(),
        ripplesCont: new PIXI.Container(),
        filterContainer: new PIXI.Container(),
        panels: [],
        speed: 2,
        cols: 4,
        rows: 4,
        panelForArtBoard: 0,
        idle: true,
        vx: 0,
        vy: 0,
        panelWidth: 1000,
        panelHeight: 1000,
        inc: 90,
        doorAllow: true,
        arr: [],
        action: true,
        mode: ['swim', 'jump', 'bounce', 'fly'],
        activeModeIndex: 0,
        activeMode: undefined,
        pellets: Pellets(),
        magicPills: MagicPills(),
        filterAnimation: FilterAnimation(),
        hero: Hero(),
        transitionItems: TransitionItems(),
        treasure: Treasure(),
        score: Score(),
        loader: PIXI.loader,
        activeAction: undefined,
        config: Config,
        init: function () {

            this.canvasWidth = this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();
            this.halfHeight = this.canvasHeight / 2;
            this.halfWidth = this.canvasWidth / 2;

            //let wh = {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight};
            this.app = new PIXI.Application(this.canvasWidth, this.canvasHeight, {backgroundColor: 0x0033CC});
            document.getElementById("game_canvas").appendChild(this.app.view);

            //this.webGL = (this.renderer instanceof PIXI.CanvasRenderer) ? false : true;

            this.stage = this.app.stage;

            this.wh = {
                canvasHeight: this.canvasHeight, 
                canvasWidth: this.canvasWidth, 
                characterHeight: 200 }

            

            this.keyDown = this.keyDown.bind(this);
            this.keyUp = this.keyUp.bind(this);
            window.addEventListener('keydown', this.keyDown);
            window.addEventListener('keyup', this.keyUp);

            // rearrange so that primary user is first and grab primary person's items
            this.userObject = userObject;
            for(let i = 0; i < userObject.users.length; i++){
                if(primaryUser === userObject.users[i].username){
                    let primaryObject = userObject.users[i];
                    userObject.users.splice(i, 1);
                    userObject.users.unshift(primaryObject);
                }
            }

            this.total = this.cols * this.rows;

            const fpsCounter = new PixiFps();
            this.stage.addChild(fpsCounter)

            this.bounce = this.bounce.bind(this);
            window.onresize = this.resizeHandler.bind(this);

            this.stage.addChild(this.backgroundCont);
            this.stage.addChild(this.foregroundCont);

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

            this.pellets.init(this.app, this.wh, this.stage, this.activeMode, this.spritesheet);

            this.magicPills.init(this.app, this.wh, this.filterTest.bind(this), this.stage, this.spritesheet);

            this.filterAnimation.init(this.app, this.filterContainer, this.wh);

            this.hero.init(this.wh, undefined, this.stage, this.spritesheet).switchPlayer(this.mode[this.activeModeIndex]);

            this.transitionItems.init(
                this.mode, 
                this.stage, 
                this.wh, 
                this.spritesheet, 
                this.hero.cont, 
                this.app, 
                this.switchPlayer.bind(this)).build();

            this.treasure.init(this.app, this.wh, this.spritesheet, this.hero.cont, this.stage);
            
           
            let panelsBoardObj = {
                rows: this.rows,
                cols: this.cols,
                panelWidth: this.panelWidth,
                panelHeight: this.panelHeight,
                canvasWidth:this.canvasWidth,
                canvasHeight: this.canvasHeight,
                backgroundCont: this.backgroundCont,
                getUserName: getUserName,
                userObject: this.userObject,
                wh: this.wh,
                activePanel: this.activePanel,
                panelForArtBoard: this.panelForArtBoard,
                stage: this.stage,
                pelletCont: this.pelletCont,
                hero: this.hero,
                utils: this.utils,
                panels: this.panels,
                bounce: this.bounce
            }

            let panelsBoardClass = this.panelsBoardClass = PanelsBoard(panelsBoardObj);
            panelsBoardClass.init();

           this.activePanel = this.panelsBoardClass.activePanel;

            this.score.init(this.stage, this.wh);

      
            this.switchPlayer(this.mode[this.activeModeIndex]);

       

            this.app.ticker.add(this.animate.bind(this));

        },
        stop: function () {
            window.onresize = undefined;
            this.app.destroy(true);
            window.removeEventListener('keydown', this.keyDown);
            window.removeEventListener('keyup', this.keyUp);
        },
        switchPlayer: function (str) {
            if(str) {
                this.activeMode = str;
            } else {
                this.activeModeIndex ++;
                if(this.activeModeIndex >= this.mode.length)this.activeModeIndex = 0;
                this.activeMode = this.mode[this.activeModeIndex];
            }


            this.hero.switchPlayer(this.activeMode);
            this.pellets.changeMode(this.activeMode);


            if (this.activeMode === 'bounce') {

                if(!this.bouncePlatform){
                    this.bouncePlatform = BouncePlatform();
                    this.bouncePlatform.init(this.stage, this.spritesheet);
                    this.bouncePlatform.on(false); 
                    this.bounceAction = BounceAction();
                    this.bounceAction.init(this.hero, this.bouncePlatform, this.canvasWidth, this.canvasHeight);
                }  
                this.activeAction = this.bounceAction;
                this.bouncePlatform.start(this.canvasWidth, this.canvasHeight);
                this.bouncePlatform.on(true);

            } else {
                if (this.bouncePlatform) this.bouncePlatform.on(false);
            }


            if(this.activeMode === 'jump'){

                if(!this.platforms){
                    this.platforms = Platforms();
                    this.platformCont = new PIXI.Container();
                    this.platforms.init(this.platformCont, this.wh);

                    this.jumpAction = JumpAction();
                    this.jumpAction.init(this.hero, this.platforms.returnPlatforms('intro'), this.canvasWidth, this.canvasHeight, this.platformCont, this.stage);
                }
                this.activeAction = this.jumpAction;
                this.platforms.addPlatforms(true);
                this.stage.addChild(this.platformCont)
            } else {
                if(this.platforms)this.platforms.addPlatforms(false);
                this.stage.removeChild(this.platformCont)
            }

          

            if(this.activeMode === 'swim' || this.activeMode === 'fly'){
                if (!this.swimAction) {
                    this.swimAction = SwimAction();
                    this.swimAction.init(this.hero, this.activeMode);
                }
                this.activeAction = this.swimAction;
                this.swimAction.switchMode(this.activeMode);
            }

            if(this.activeMode === 'swim'){
                if (!this.ripples) {
                    this.ripples = Ripples();
                    this.ripples.init(this.app);
                }
                
                this.ripples.on(true);
            } else {
                if (this.ripples) this.ripples.on(false);
            }
        },
        resizeHandler: function () {
            this.canvasWidth =  this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();
            this.halfHeight = this.canvasHeight / 2;
            this.halfWidth = this.canvasWidth / 2;
            this.hero.cont.x = this.canvasWidth / 2;
            this.hero.cont.y = this.canvasHeight / 2;


            let wh = {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight};
            this.magicPills.resize(wh);
            this.filterAnimation.resize(wh);
            this.pellets.resize(wh);
            this.app.renderer.resize(this.canvasWidth, this.canvasHeight);

            this.backgroundCont.x = -this.panelsBoardClass.activePanel.cont.x + (this.canvasWidth /2) - (this.panelWidth /2);
            this.backgroundCont.y = -this.panelsBoardClass.activePanel.cont.y+ (this.canvasHeight /2) - (this.panelHeight /2);
                   
        },
        editMode: function (boolean) {
            this.action = !boolean;
            this.ripples.pause(boolean);
            this.panels[this.panelForArtBoard].panelClass.art_board.editMode(boolean);
            this.filterAnimation.shutOff();
            this.panelsBoardClass.switchPanel(0);
        },
        changeColor: function (color) {
            //console.log("change color");
            this.panels[this.panelForArtBoard].panelClass.art_board.changeColor(color);
        },
        filterTest: function () {
            this.filterAnimation.filterToggle();
        },

        keyDown: function (e) {
             switch (e.keyCode) {
                case 32:
                    if(this.jumpAction)this.jumpAction.jump();
                    break;
                case 37:
                    // left
                    if(this.activeMode === 'bounce')break;
                    if(this.swimAction)this.swimAction.spinning = true;
                    this.rotateLeftBoolean = true;
                    break;
                case 38:
                    // up
                    this.rotate('up');
                    break;
                case 39:
                    // right
                    if(this.activeMode === 'bounce')break;
                    if(this.swimAction)this.swimAction.spinning = true;
                    this.rotateRightBoolean = true;
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
        },
        rotate: function (str) {

            if (this.activeMode === 'jump') {
                this.jumpAction.move(str);
                return;
            }

            if (str === 'right') {
                this.idle = false;
                this.swimAction.radius += 0.25;
                this.velocity = this.utils.randomNumberBetween(this.config.swimVelocities[0], this.config.swimVelocities[1]);
                this.vx = this.velocity * Math.sin(this.swimAction.radius);
                this.vy = -this.velocity * Math.cos(this.swimAction.radius);
                this.swimAction.storeRadius = this.swimAction.radius;
                let obj = {vx: -this.vx, vy: -this.vy};
                this.pellets.rotate(obj);
                this.transitionItems.rotate(obj);
                this.swimAction.rotate(obj);
            
            } else if(str === 'left') {
                this.idle = false;
                this.swimAction.radius -= 0.25;
                this.velocity = this.utils.randomNumberBetween(this.config.swimVelocities[0], this.config.swimVelocities[1]);
                this.vx = this.velocity * Math.sin(this.swimAction.radius);
                this.vy = -this.velocity * Math.cos(this.swimAction.radius);
                this.swimAction.storeRadius = this.swimAction.radius;
                let obj = {vx: -this.vx, vy: -this.vy};
                this.pellets.rotate(obj);
                this.transitionItems.rotate(obj);
                this.swimAction.rotate(obj);
            }

        },
        bounce: function (str) {
            if(str === 'vx') {
                this.activeAction.vx *=-1;
            } else {
                this.activeAction.vy *=-1;
            }

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

            if(this.action){
                if(this.rotateLeftBoolean)this.rotate('left');
                if(this.rotateRightBoolean)this.rotate('right');
                this.filterAnimation.animate();
                this.activeAction.animate();
                this.panelsBoardClass.animate(this.activeAction.vx, this.activeAction.vy);
                this.pellets.animate(this.activeAction.vx, this.activeAction.vy, true);
                this.treasure.animate(this.activeAction.vx, this.activeAction.vy);
                this.transitionItems.animate(this.activeAction.vx, this.activeAction.vy);
                this.magicPills.animate(this.activeAction.vx, this.activeAction.vy);

                if (this.activeMode === 'bounce') {
                    this.bouncePlatform.animate();
                } else if(this.activeMode === 'swim'){
                    this.ripples.animate();
                } 
            }

            //this.panelsBoardClass.animate();
            //this.renderer.render(this.stage);
        }
    }
}
