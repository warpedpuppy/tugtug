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

            this.addPegPanels();


            this.stage.addChild(this.backgroundCont);
            this.stage.interactive = true;

            this.keyDown = this.keyDown.bind(this);
            this.keyUp = this.keyUp.bind(this);
            window.addEventListener('keydown', this.keyDown);
            window.addEventListener('keyup', this.keyUp);

            let size = {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight}
            this.hero = obj.hero(PIXI, this.app, this.utils, size)
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
            // this.action = false;
            // this.doorAllow = false;
            // let fromPoint = new PIXI.Point(this.hero.cont.x, this.hero.cont.y);
            // let localPoint = this.activePanel.cont.toLocal(fromPoint, this.stage, undefined, true)
            // //console.log(fromPoint);
            // this.arr.push(localPoint)
            // console.log('local point = ', this.arr[0]);

            this.canvasWidth =  this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();
            this.hero.cont.x = this.canvasWidth / 2;
            this.hero.cont.y = this.canvasHeight / 2;

            // this.arr.push(this.canvasWidth);

            // let amountMoved = this.arr[this.arr.length - 1] - this.arr[0];
            // console.log(this.arr)
            // console.log("amount moved = "+amountMoved)
            //this.backgroundCont.x += amountMoved;


            let wh = {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight};
            this.magicPills.resize(wh);
            this.filter_animation.resize(wh);
            this.pellets.resize(wh);
            this.app.renderer.resize(this.canvasWidth, this.canvasHeight);

            this.backgroundCont.x = -this.activePanel.cont.x + (this.canvasWidth /2) - (this.panelWidth/2);
            this.backgroundCont.y = -this.activePanel.cont.y + (this.canvasHeight /2) - (this.panelHeight/2);
            // let that = this;
            // clearTimeout(resizeTimer);
            //   let resizeTimer = setTimeout(function() {
            //     that.action = true;
            //     that.arr = [];
            //     // Run code here, resizing has "stopped"
            //        console.log('resizing done, this arr length = ')     
            //   }, 1250);
        },
        toggleAvi: function (editMode) {

        },
        changeColor: function (color) {
            console.log("change color");
            this.art_board.changeColor(color);
        },
        addPegPanels: function () {
            let panelCounter = 0;
            this.panels = [];
            this.backgroundCont.removeChildren();
            for(let i = 0; i < this.rows; i++){
                for (let j = 0; j < this.cols; j ++) {
                
                    let w = this.panelWidth;
                    let h = this.panelHeight;
                    
                    let userObject = (this.userObject.users[panelCounter])?this.userObject.users[panelCounter]:{username: getUserName()};
                    let xVal = w * j;
                    let yVal = h * i;
                    this.leftX = (this.cols - 1) * this.panelWidth;
                    this.bottomY = (this.rows - 1) * this.panelHeight;

                    let panelClass = obj.Panel(PIXI, this.wH, obj.portal_code);
                    let artBoard = undefined;
                    if(panelCounter === this.panelForArtBoard){
                        this.activePanel = panelClass;
                        artBoard = this.art_board.returnArtBoard();
                        this.art_board.assignStage(this.stage);
                    }
                    panelClass.build(panelCounter, this.panelWidth, this.panelHeight, userObject,  {x: xVal, y: yVal}, artBoard);
                    let panel = panelClass.returnPanel();
                    panel.panelClass = panelClass;
                    panel.x = xVal;
                    panel.y = yVal;
                    this.panels.push(panel)
                    panel.index = panelCounter;
                    this.backgroundCont.addChild(panel);

                   
                    panelCounter ++;
                }
            }

            this.backgroundCont.x = -this.activePanel.cont.x + (this.canvasWidth /2) - (this.panelWidth /2);
            this.backgroundCont.y = -this.activePanel.cont.y+ (this.canvasHeight /2) - (this.panelHeight /2);
         
           //this.backgroundCont.scale.x = this.backgroundCont.scale.y = 0.25;
           this.mask = new PIXI.Graphics();
           this.mask.beginFill(0x000000).drawRect(0,0,this.backgroundCont.width, this.backgroundCont.height).endFill();
           this.mask.x = this.backgroundCont.x;
           this.mask.y = this.backgroundCont.y;
           this.stage.addChild(this.mask);
           this.pelletCont.mask = this.mask;   
         
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
            // this.ball.x = this.halfWidth;
            // this.ball.y = this.halfHeight;
            this.addPegPanels();
        },
        whichPanel: function (door, panel) {

            let rightX = panel.cont.x + this.panelWidth;
            let bottomY = panel.cont.y + this.panelHeight;
            let topY = panel.cont.y - this.panelHeight;
            let leftX = panel.cont.x - this.panelWidth
             for (let i = 0; i < this.total; i++) {
               // console.log(`${door.loc} ${panel.cont.x} ${this.panelWidth} versus ${this.panels[i].x}`);
                if (door.loc === 'top' && this.panels[i].y === topY && this.panels[i].x === panel.cont.x) {
                    this.switchPanel(i);
                    break;
                } else if (door.loc === 'bottom' && this.panels[i].y === bottomY && this.panels[i].x === panel.cont.x) {
                    this.switchPanel(i);
                    break;

                } else if (door.loc === 'left' && this.panels[i].x === leftX && this.panels[i].y === panel.cont.y){
                    this.switchPanel(i);
                    break;

                } else if (door.loc === 'right' && this.panels[i].x === rightX && this.panels[i].y === panel.cont.y) {
                   this.switchPanel(i);
                    break;
                }
             }
        },
        switchPanel: function (index) {
            this.activePanel = this.panels[index].panelClass;
            this.panelForArtBoard = index;
            this.backgroundCont.x = -this.activePanel.cont.x + (this.canvasWidth /2) - (this.panelWidth /2);
            this.backgroundCont.y = -this.activePanel.cont.y+ (this.canvasHeight /2) - (this.panelHeight /2);
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
                // let tempX = this.vx + this.utils.randomNumberBetween(4, 6);
                // let tempY = this.vy - this.utils.randomNumberBetween(4, 6);
                // let obj = {vx: -tempX, vy: -tempY}
                // this.pellets.rotate("right", obj)
            
            } else if(str === 'left') {
                // this.idle = false;
                this.hero.radius -= 0.5;//(Math.PI * 2) / this.inc;
                this.velocity = this.utils.randomNumberBetween(4, 6);
                // console.log( this.vx +" "+ this.velfocity +" "+  Math.sin(this.hero.radius))
                this.vx = this.velocity * Math.sin(this.hero.radius);
                this.vy = -this.velocity * Math.cos(this.hero.radius);
                this.hero.storeRadius = this.hero.radius;
                // let tempX = this.vx + this.utils.randomNumberBetween(4, 6);
                // let tempY = this.vy - this.utils.randomNumberBetween(4, 6);
                // let obj = {vx: -tempX, vy: -tempY}
                // this.pellets.rotate("left", obj)
            
            }

        },
        animate: function () {

            if(!this.action)return
            // let fromPoint = new PIXI.Point(this.hero.x, this.hero.y);
            // let returnPoint = new PIXI.Point();
            // this.localPoint = this.activePanel.cont.toLocal(fromPoint, this.stage, undefined, false)
            //console.log(" local ", localPoint);
            //console.log(" return point ",returnPoint);
            this.hero.animate();
            this.pellets.animate();
            this.ripples.animate();
            this.filter_animation.animate();
            this.magicPills.animate();

            this.backgroundCont.x += -this.vx;// * rate;
            this.backgroundCont.y += -this.vy;// * rate;
            this.mask.x = this.backgroundCont.x;
            this.mask.y = this.backgroundCont.y;
            

            // door checking
           // if(this.doorAllow ) {


                let rect = new PIXI.Rectangle();
                for(let i = 0; i < this.activePanel.doors.length; i++){
                    // let doorPoint = new PIXI.Point(this.activePanel.doors[i].x, this.activePanel.doors[i].y);
                    let globalPoint = this.activePanel.doors[i].toGlobal(this.stage, undefined, true);
                    rect = new PIXI.Rectangle(
                        Math.floor(globalPoint.x), 
                        Math.floor(globalPoint.y), 
                        this.activePanel.doors[i].width, 
                        this.activePanel.doors[i].height);
                    this.hero.cont.radius = 50;
                    if(this.utils.circleRectangleCollision(this.hero.cont, rect)){
                        this.whichPanel(this.activePanel.doors[i], this.activePanel);
                    }

                    this.activePanel.gears[i].rotation += (this.activePanel.gears[i].rotate / 2);

                }
             //}

       

            let yLimit =  this.activePanel.cont.y + (this.panelHeight) -  (this.canvasHeight / 2);
            let yLimit2 = this.activePanel.cont.y  -  (this.canvasHeight / 2);

            let xLimit = this.activePanel.cont.x + this.panelWidth - (this.canvasWidth / 2);
            let xLimit2 = this.activePanel.cont.x - (this.canvasWidth/2) ;


            if(this.backgroundCont.y >= -yLimit2) {
                this.vy = 0;
                this.backgroundCont.y = -yLimit2;
            } else if (this.backgroundCont.y <= -yLimit) {
                 this.vy = 0;
                 this.backgroundCont.y = -yLimit;
            } 

            //console.log(this.backgroundCont.y +" versus "+ yLimit)
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
