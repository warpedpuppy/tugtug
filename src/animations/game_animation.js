export default function Game (PIXI, Utils, obj, userObject, getUserName){
    return {
        utils: new Utils(),
        backgroundCont: new PIXI.Container(),
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
        init: function () {

            this.canvasWidth = this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();
            this.app = new PIXI.Application(this.canvasWidth, this.canvasHeight, {backgroundColor: 0x0033CC});
            document.getElementById("game_canvas").appendChild(this.app.renderer.view);

            this.userObject = userObject;
            this.art_board = obj.art_board_code(this.utils, PIXI);
            this.art_board.init();



            this.Doorway = obj.portal_code;

            this.resize = this.resize.bind(this);
            window.onresize = this.resize;
            
            this.halfHeight = this.canvasHeight / 2;
            this.halfWidth = this.canvasWidth / 2;
            this.renderer = this.app.renderer;//PIXI.autoDetectRenderer(this.canvasWidth, this.canvasHeight);
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

            this.items = userObject.items;
 
            this.hero = obj.hero(PIXI, this.app, this.utils, size, this.items)
            this.hero.init();
            this.stage.addChild(this.hero.cont);



            this.app.ticker.add(this.animate.bind(this));
            
            this.total = this.cols * this.rows;
            this.stage.addChild(this.pelletCont);
            this.pellets = obj.pellets(PIXI, this.app, this.utils, this.wH, this.pelletCont);
            this.pellets.init();

            this.magicPills = obj.magicPills(PIXI, this.app, this.utils, this.wH, this.filterTest.bind(this));
            this.magicPills.init();

            this.stage.addChild(this.ripplesCont);
            this.ripples = obj.ripples(PIXI, this.app);
            this.ripples.init();

            this.stage.addChild(this.filterContainer);
            this.filter_animation = obj.filter_animation(PIXI, this.app, this.filterContainer, this.stage)
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
                Panel: obj.Panel,
                portal_code: obj.portal_code,
                wH: this.wH,
                activePanel: this.activePanel,
                panelForArtBoard: this.panelForArtBoard,
                art_board: this.art_board,
                stage: this.stage,
                pelletCont: this.pelletCont,
                hero: this.hero,
                utils: this.utils
            }

            let panelsBoardClass = this.panelsBoardClass = obj.PanelsBoard(PIXI, panelsBoardObj);
            panelsBoardClass.init();



            const fpsCounter = new obj.PixiFps();
            this.stage.addChild(fpsCounter)
           
            window.onresize = this.resizeHandler.bind(this);
        },
        stop: function () {
            window.onresize = undefined;
            this.app.destroy(true);
            window.removeEventListener('keydown', undefined);
            window.removeEventListener('keyup', undefined);
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

            this.backgroundCont.x = -this.panelsBoardClass.cont.x + (this.canvasWidth /2) - (this.panelWidth/2);
        
        },
        editMode: function (boolean) {
            this.action = !boolean;
            this.ripples.pause(boolean);
            this.art_board.editMode(boolean);
            this.filter_animation.shutOff();
            this.panelsBoardClass.switchPanel(0);

        },
        changeColor: function (color) {
            console.log("change color");
            this.art_board.changeColor(color);
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
            this.addPegPanels();
        },
        keyDown: function (e) {
            e.preventDefault();
            switch (e.keyCode) {
                case 37:
                    // left
                    this.rotateBoolean = true;
                    this.rotate('left');
                    break;
                case 38:
                    // up
                    break;
                case 39:
                    // right
                    this.rotateBoolean = true;
                    this.rotate('right');
                    break;
                case 40:
                    break;
                default:
                    this.vy = 0;
            }
        },
        keyUp: function (e) {
            e.preventDefault();
            this.rotateBoolean = false;
            // this.idle = true;
        },
        rotate: function (str) {
            if(str === 'right'){
                // this.idle = false;
                this.hero.radius += 0.5;//(Math.PI * 2) / this.inc;
                this.velocity = this.utils.randomNumberBetween(4, 6);
                this.vx = this.velocity * Math.sin(this.hero.radius);
                this.vy = -this.velocity * Math.cos(this.hero.radius);
                this.hero.storeRadius = this.hero.radius;
            } else if(str === 'left') {
                // this.idle = false;
                this.hero.radius -= 0.5;//(Math.PI * 2) / this.inc;
                this.velocity = this.utils.randomNumberBetween(4, 6);
               this.vx = this.velocity * Math.sin(this.hero.radius);
                this.vy = -this.velocity * Math.cos(this.hero.radius);
                this.hero.storeRadius = this.hero.radius;
               
            }

        },
        animate: function () {

            if(!this.action)return

            this.hero.animate();
            this.pellets.animate();
            this.ripples.animate();
            this.filter_animation.animate();
            this.magicPills.animate();
            this.panelsBoardClass.animate();

            this.backgroundCont.x += -this.vx;// * rate;
            this.backgroundCont.y += -this.vy;// * rate;

            let xLimit = this.panelsBoardClass.xLimit;
            let xLimit2 = this.panelsBoardClass.xLimit2;
            let yLimit = this.panelsBoardClass.yLimit;
            let yLimit2 = this.panelsBoardClass.yLimit2;

            if(this.backgroundCont.y >= -yLimit2) {
                this.vy = 0;
                this.backgroundCont.y = -yLimit2;
            } else if (this.backgroundCont.y <= -yLimit) {
                 this.vy = 0;
                 this.backgroundCont.y = -yLimit;
            } 

           // console.log(this.backgroundCont.y +" versus "+ yLimit)
            if(this.backgroundCont.x > -xLimit2) {
                this.vx = 0;
                this.backgroundCont.x = -xLimit2;
            } else if (this.backgroundCont.x < -xLimit) {
                this.vx = 0;
                this.backgroundCont.x = -xLimit;
            }
           
            this.renderer.render(this.stage);
        }
    }
}
