export default function Game (PIXI, Utils, obj, userObject, getUserName){
    return {
        utils: new Utils(),
        backgroundCont: new PIXI.Container(),
        pelletCont: new PIXI.Container(),
        stage: new PIXI.Container(),
        panelWidth: 0,
        panelHeight: 0,
        panels: [],
        speed: 2,
        cols: 4,
        rows: 4,
        panelForArtBoard: 8,
        characterHeight: 154,
        doors: [],
        POWER : 10000,
        EDGE_OFFSET : 5,
        idle: true,
        vx: 0,
        vy: -1,
        rotateBoolean: false,
        renderTextureTestBoolean: false,
        inc: 180,
        panelWidth: 500,
        panelHeight:500,
        characterHeight: 150,
        init: function () {

            this.canvasWidth = this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();
            this.app = new PIXI.Application(this.canvasWidth, this.canvasHeight, {backgroundColor: 0x0033CC});

            this.userObject = userObject;
            this.art_board = obj.art_board_code(this.utils, PIXI);
            this.art_board.init();



            this.Doorway = obj.portal_code;

            this.resize = this.resize.bind(this);
            window.onresize = this.resize;
            
            this.halfHeight = this.canvasHeight / 2;
            this.halfWidth = this.canvasWidth / 2;
            this.renderer = PIXI.autoDetectRenderer(this.canvasWidth, this.canvasHeight);
            this.renderer.backgroundColor = 0x0033CC;
            this.webGL = (this.renderer instanceof PIXI.CanvasRenderer) ? false : true;

            document.getElementById("game_canvas").appendChild(this.renderer.view);
            this.animate = this.animate.bind(this);

            this.wH = {canvasHeight: this.canvasHeight, canvasWidth: this.canvasWidth, characterHeight: this.characterHeight}

            this.addPegPanels();


            this.stage.addChild(this.backgroundCont);


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

            const fpsCounter = new obj.PixiFps();
            this.stage.addChild(fpsCounter)

        },
        changeColor: function (color) {
            console.log("change color");
            this.art_board.changeColor(color);
        },
        addPegPanels: function () {
            let panel,
                panelCounter = 0;
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
                    if(panelCounter === this.panelForArtBoard){
                        this.activePanel = panelClass;
                    }
                    panelClass.build(panelCounter, this.panelWidth, this.panelHeight, userObject,  {x: xVal, y: yVal});
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

        },
        stop: function () {
            this.app.ticker.destroy();
            this.renderer.destroy();
            window.onresize = undefined;
            console.log(this.renderer)
           this.keyboard.deactivate();
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
                console.log(`${door.loc} ${panel.cont.x} ${this.panelWidth} versus ${this.panels[i].x}`);
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
         
           

            console.log('move to ', index)
            // this.ball.x = this.panelWidth/2;
            // this.ball.y = this.panelHeight/2;
            // this.ball.panel.removeChild(this.ball);
            // this.panels[index].addChild(this.ball);
            //this.activePanel = this.panels[index].panelClass;
            // this.panelForArtBoard = index;
            // obj.TweenMax.to(this.backgroundCont, 1, {x: -this.panels[index].x, y: -this.panels[index].y})


            // this.ball.x = this.panelWidth/2;
            // this.ball.y = this.panelHeight/2;
            // this.ball.panel.removeChild(this.ball);
            // this.panels[index].addChild(this.ball);
            // this.ball.panel = this.panels[index];
            // this.panelForArtBoard = index;

            // obj.TweenMax.to(this.backgroundCont, 1, {x: -this.panels[index].x, y: -this.panels[index].y})
        },
        // rotateChain: function () {
        //     this.ballClass.pos.push(this.ballClass.radius);
        //     this.increment = 10;
        //     let maxLength = this.increment * this.numBalls;
        //     if (this.ballClass.pos.length > maxLength) {
        //         this.ballClass.pos = this.ballClass.pos.slice(-maxLength);
        //     }

        //      this.ballClass.balls[0].rotation = this.ballClass.radius;
        //     for (let i = 1; i < this.ballClass.numBalls; i++) {
        //         let index = this.ballClass.pos.length - (i * this.increment);
        //         if (this.ballClass.pos.length >= index) {
        //          this.ballClass.balls[i].rotation = this.ballClass.pos[index];
        //         }
        //     }
        // },
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
            this.idle = true;
        },
        rotate: function (str) {
            if(str === 'right'){
                this.idle = false;
                this.hero.radius += (Math.PI * 2) / this.inc;
                this.velocity = this.utils.randomNumberBetween(4, 6);
                this.vx = this.velocity * Math.sin(this.hero.radius);
                this.vy = -this.velocity * Math.cos(this.hero.radius);
                this.hero.storeRadius = this.hero.radius;
                let obj = {vx: -this.vx, vy: -this.vy}
                this.pellets.rotate("right", obj)
            
            } else if(str === 'left') {
                this.idle = false;
                this.hero.radius -= (Math.PI * 2) / this.inc;
                this.velocity = this.utils.randomNumberBetween(4, 6);
                // console.log( this.vx +" "+ this.velocity +" "+  Math.sin(this.hero.radius))
                this.vx = this.velocity * Math.sin(this.hero.radius);
                this.vy = -this.velocity * Math.cos(this.hero.radius);
                this.hero.storeRadius = this.hero.radius;
                let obj = {vx: -this.vx, vy: -this.vy}
                this.pellets.rotate("left", obj)
            
            }

        },
        animate: function () {

            this.hero.animate();
            this.pellets.animate();

            this.backgroundCont.x += -this.vx;// * rate;
            this.backgroundCont.y += -this.vy;// * rate;

            let rect = new PIXI.Rectangle();

            // door checking
            for(let i = 0; i < this.activePanel.doors.length; i++){
                let doorPoint = new PIXI.Point(this.activePanel.doors[i].x, this.activePanel.doors[i].y);
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

            }

       

            let yLimit =  this.activePanel.cont.y + (this.panelHeight) -  (this.canvasHeight / 2);
            let yLimit2 = this.activePanel.cont.y  -  (this.canvasHeight / 2);

            let xLimit = this.activePanel.cont.x + this.panelWidth - (this.canvasWidth / 2);
            let xLimit2 = this.activePanel.cont.x - (this.canvasWidth/2) ;


            if(this.backgroundCont.y > -yLimit2) {
                this.vy = 0;
                this.backgroundCont.y = -yLimit2;
            } else if (this.backgroundCont.y < -yLimit) {
                 this.vy = 0;
                 this.backgroundCont.y = -yLimit;
            }

            console.log(this.backgroundCont.y +" versus "+ yLimit)
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
