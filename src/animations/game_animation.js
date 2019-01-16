import * as PIXI from 'pixi.js';
import Utils from './utils/utils';
import Platforms from './supportingClasses/platforms/platforms';
import BouncePlatform from './supportingClasses/bouncePlatform';
import BounceAction from './supportingClasses/actions/bounceAction';
import JumpAction from './supportingClasses/actions/jumpAction';
import SwimAction from './supportingClasses/actions/swimAction';
import MagicPills from './supportingClasses/magicPills';

export default function Game (obj, userObject, getUserName, primaryUser){
    return {
        utils: new Utils(),
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
        mode: ['bounce', 'jump', 'swim', 'fly'],
        activeModeIndex: 0,
        activeMode: undefined,
        init: function () {

            this.canvasWidth = this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();
            let wh = {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight};
            this.app = new PIXI.Application(this.canvasWidth, this.canvasHeight, {backgroundColor: 0x0033CC});
            document.getElementById("game_canvas").appendChild(this.app.renderer.view);

            this.userObject = userObject;
 
            this.resize = this.resize.bind(this);
            window.onresize = this.resize;
            
            this.halfHeight = this.canvasHeight / 2;
            this.halfWidth = this.canvasWidth / 2;
            this.renderer = this.app.renderer;
            this.renderer.backgroundColor = 0x0033CC;
            //this.webGL = (this.renderer instanceof PIXI.CanvasRenderer) ? false : true;

            this.stage = this.app.stage;
            
            this.animate = this.animate.bind(this);

            this.wH = {
                canvasHeight: this.canvasHeight, 
                canvasWidth: this.canvasWidth, 
                characterHeight: 200 }

            this.stage.addChild(this.backgroundCont);
            this.stage.interactive = true;

            this.keyDown = this.keyDown.bind(this);
            this.keyUp = this.keyUp.bind(this);
            window.addEventListener('keydown', this.keyDown);
            window.addEventListener('keyup', this.keyUp);

            let size = {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight}

            // rearrange so that primary user is first and grab primary person's items
            for(let i = 0; i < userObject.users.length; i++){
                if(primaryUser === userObject.users[i].username){
                    let primaryObject = userObject.users[i];
                    userObject.users.splice(i, 1);
                    userObject.users.unshift(primaryObject);
                }
            }

            
            this.hero = new obj.hero(wh);
            this.hero.init();
            this.hero.switchPlayer(this.mode[this.activeModeIndex]);
            this.stage.addChild(this.hero.cont);

            this.total = this.cols * this.rows;
            this.stage.addChild(this.pelletCont);
            this.pellets = obj.pellets(this.app, this.wH, this.pelletCont);
            this.pellets.init();

            this.magicPills = MagicPills(this.app, this.wH, this.filterTest.bind(this), this.stage);
            this.magicPills.init();

            this.stage.addChild(this.ripplesCont);
            this.ripples = obj.ripples(this.app);
            this.ripples.init();

            this.stage.addChild(this.filterContainer);
            this.filter_animation = obj.filter_animation(this.app, this.filterContainer, this.stage)
            this.filter_animation.init();

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
                wH: this.wH,
                activePanel: this.activePanel,
                panelForArtBoard: this.panelForArtBoard,
                stage: this.stage,
                pelletCont: this.pelletCont,
                hero: this.hero,
                utils: this.utils,
                panels: this.panels
            }

            let panelsBoardClass = this.panelsBoardClass = obj.PanelsBoard(panelsBoardObj);
            panelsBoardClass.init();

            this.activePanel = this.panelsBoardClass.activePanel;
      
            this.switchPlayer(0);

            const fpsCounter = new obj.PixiFps();
            this.stage.addChild(fpsCounter)
            this.app.ticker.add(this.animate.bind(this));
            window.onresize = this.resizeHandler.bind(this);
            this.test = new PIXI.Graphics();
            this.test.beginFill(0x000000).drawRect(0,0,this.canvasWidth,this.canvasHeight).endFill();
            this.test.alpha = 0;
            this.foregroundCont.addChild(this.test)

            this.stage.addChild(this.foregroundCont)
        },
        stop: function () {
            window.onresize = undefined;
            this.app.destroy(true);
            window.removeEventListener('keydown', this.keyDown);
            window.removeEventListener('keyup', this.keyUp);
        },
        switchPlayer: function (index) {
            if(index === 0) {
                this.activeMode = this.mode[index];
            } else {
                this.activeModeIndex ++;
                if(this.activeModeIndex >= this.mode.length)this.activeModeIndex = 0;
                this.activeMode = this.mode[this.activeModeIndex];
            }

            this.hero.switchPlayer(this.activeMode);
            this.pellets.changeMode(this.activeMode);

            if(this.activeMode === 'jump'){

                if(!this.platforms){
                    this.platforms = new Platforms({canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight});
                    this.platformCont = new PIXI.Container();
                    this.platforms.init(this.backgroundCont);

                    this.jumpAction = JumpAction();
                    this.jumpAction.init(this.hero, this.platforms.returnPlatforms('intro'), this.canvasWidth, this.canvasHeight, this.backgroundCont, this.stage);
                }
                this.platforms.addPlatforms(true);
                this.stage.addChild(this.platformCont)
            } else {
                if(this.platforms)this.platforms.addPlatforms(false);
                this.stage.removeChild(this.platformCont)
            }

            if(this.activeMode === 'bounce'){

                if(!this.bouncePlatform){
                    this.bouncePlatform = BouncePlatform();
                    this.bouncePlatform.init(this.foregroundCont);
                    this.bouncePlatform.on(false); 
                    this.bounceAction = BounceAction();
                    this.bounceAction.init(this.hero, this.bouncePlatform, this.canvasWidth, this.canvasHeight);
                }  

                this.bouncePlatform.start(this.canvasWidth, this.canvasHeight);
                this.bouncePlatform.on(true);
            } else {
                if(this.bouncePlatform)this.bouncePlatform.on(false);
            }

            if(this.activeMode === 'swim' || this.activeMode === 'fly'){
                if (!this.swimAction) {
                    this.swimAction = new SwimAction();
                    this.swimAction.init(this.hero, this.activeMode);
                }
                this.swimAction.switchMode(this.activeMode);
            }

            if(this.activeMode === 'swim'){
                if(!this.ripples){
                    this.ripples = obj.ripples(this.app);
                    this.ripples.init();
                }
                
                this.ripples.on(true);
            } else {
                if(this.ripples)this.ripples.on(false);
            }
        },
        resizeHandler: function () {
            this.canvasWidth =  this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();
            this.hero.cont.x = this.canvasWidth / 2;
            this.hero.cont.y = this.canvasHeight / 2;


            let wh = {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight};
            this.magicPills.resize(wh);
            this.filter_animation.resize(wh);
            this.pellets.resize(wh);
            this.app.renderer.resize(this.canvasWidth, this.canvasHeight);

            this.backgroundCont.x = -this.panelsBoardClass.activePanel.cont.x + (this.canvasWidth /2) - (this.panelWidth /2);
            this.backgroundCont.y = -this.panelsBoardClass.activePanel.cont.y+ (this.canvasHeight /2) - (this.panelHeight /2);
         
        },
        editMode: function (boolean) {
            this.action = !boolean;
            this.ripples.pause(boolean);
            this.panels[this.panelForArtBoard].panelClass.art_board.editMode(boolean);
            this.filter_animation.shutOff();
            this.panelsBoardClass.switchPanel(0);
        },
        changeColor: function (color) {
            //console.log("change color");
            this.panels[this.panelForArtBoard].panelClass.art_board.changeColor(color);
        },
        filterTest: function () {
            this.filter_animation.filterToggle();
        },
        resize: function () {
            this.canvasWidth = this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();
            this.halfHeight = this.canvasHeight / 2;
            this.halfWidth = this.canvasWidth / 2;
            this.renderer.resize(this.canvasWidth,this.canvasHeight);
           // this.addPegPanels();
        },
        keyDown: function (e) {
             switch (e.keyCode) {
                case 32:
                    if(this.jumpAction)this.jumpAction.jump();
                    break;
                case 37:
                    // left
                    if(this.swimAction)this.swimAction.spinning = true;
                    this.rotateLeftBoolean = true;
                    break;
                case 38:
                    // up
                    this.rotate('up');
                    break;
                case 39:
                    // right
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

            if(str === 'right'){
                this.idle = false;
                this.swimAction.radius += 0.25;
                this.velocity = this.utils.randomNumberBetween(4, 6);
                this.vx = this.velocity * Math.sin(this.swimAction.radius);
                this.vy = -this.velocity * Math.cos(this.swimAction.radius);
                this.swimAction.storeRadius = this.swimAction.radius;
                let obj = {vx: -this.vx, vy: -this.vy}
                this.pellets.rotate("right", obj)
            
            } else if(str === 'left') {
                this.idle = false;
                this.swimAction.radius -= 0.25;
                this.velocity = this.utils.randomNumberBetween(4, 6);
                this.vx = this.velocity * Math.sin(this.swimAction.radius);
                this.vy = -this.velocity * Math.cos(this.swimAction.radius);
                this.swimAction.storeRadius = this.swimAction.radius;
                let obj = {vx: -this.vx, vy: -this.vy}
                this.pellets.rotate("left", obj)
            }

        },
        sidePanelCollision: function (currentAction) {
            //sides collision
            let xLimit = this.panelsBoardClass.xLimit - this.hero.cont.radius;
            let xLimit2 = this.panelsBoardClass.xLimit2 + this.hero.cont.radius;
            let yLimit = this.panelsBoardClass.yLimit - this.hero.cont.radius;
            let yLimit2 = this.panelsBoardClass.yLimit2 - this.hero.cont.radius;


            if (this.backgroundCont.x < -xLimit) {
               // currentAction.vy *= -1;
                currentAction.vx *= -1;
                this.backgroundCont.x = -xLimit;
            } else if(this.backgroundCont.x > -xLimit2) {
               // currentAction.vy *= -1;
                currentAction.vx *= -1;
                this.backgroundCont.x = -xLimit2;
            } 


            if (this.backgroundCont.y <= -yLimit) {
                 currentAction.vy *= -1;
               // currentAction.vx *= -1;
                 this.backgroundCont.y = -yLimit;
            } else if(this.backgroundCont.y >= -yLimit2) {
                currentAction.vy *= -1;
                //currentAction.vx *= -1;
                this.backgroundCont.y = -yLimit2;
            } 

           
        },
        animate: function () {

            if(!this.action)return


            if(this.rotateLeftBoolean)this.rotate('left');
            if(this.rotateRightBoolean)this.rotate('right');

            if(this.activeMode === 'bounce'){
                this.bouncePlatform.animate();
                this.bounceAction.animate();
                this.backgroundCont.x += -this.bounceAction.vx;
                this.backgroundCont.y += -this.bounceAction.vy;
                this.pellets.animate(this.bounceAction.vx, this.bounceAction.vy);
                this.sidePanelCollision(this.bounceAction);//move this to actions (?)
            } else if (this.activeMode === 'jump') {
                this.jumpAction.animate();
                this.pellets.animate();
                this.sidePanelCollision(this.jumpAction); //move this to actions (?)
            } else if(this.activeMode === 'swim'){
                this.pellets.animate();
                this.ripples.animate();
                this.swimAction.animate();
                this.backgroundCont.x += -this.vx;
                this.backgroundCont.y += -this.vy;
                this.sidePanelCollision(this);
            } else if(this.activeMode === 'fly'){
                this.pellets.animate();
                this.swimAction.animate();
                this.backgroundCont.x += -this.vx;
                this.backgroundCont.y += -this.vy;
                this.sidePanelCollision(this);
            }

            this.filter_animation.animate();
            this.magicPills.animate();
            this.panelsBoardClass.animate();

       
           
            this.renderer.render(this.stage);
        }
    }
}
