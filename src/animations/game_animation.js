export default function Game (PIXI, Utils, obj, userObject, getUserName){
    return {
        utils: new Utils(),
        backgroundCont: new PIXI.Container(),
        stage: new PIXI.Container(),
        panelWidth: 0,
        panelHeight: 0,
        panels: [],
        speed: 2,
        cols: 4,
        rows: 4,
        panelForArtBoard: 0,
        characterHeight: 154,
        doors: [],
        POWER : 10000,
        EDGE_OFFSET : 5,
        idle: true,
        vx: 0,
        vy: 1,
        rotateBoolean: false,
        renderTextureTestBoolean: false,
        inc: 180,
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

            this.addPegPanels();


            this.stage.addChild(this.backgroundCont);


            this.keyDown = this.keyDown.bind(this);
            this.keyUp = this.keyUp.bind(this);
            window.addEventListener('keydown', this.keyDown);
            window.addEventListener('keyup', this.keyUp);


            this.app.ticker.add(this.animate.bind(this));
            
            this.total = this.cols * this.rows;
          
        

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
                
                    let w = this.panelWidth = 1500;// this.canvasWidth;
                    let h = this.panelHeight = 1500;//this.canvasHeight - 50;
                    
                    let userObject = (this.userObject.users[panelCounter])?this.userObject.users[panelCounter]:{username: getUserName()};
                    let xVal = w * j;
                    let yVal = h * i;
                    this.leftX = (this.cols - 1) * this.panelWidth;
                    this.bottomY = (this.rows - 1) * this.panelHeight;
                    //panel = this.PegPanel(panelCounter, userObject, {x: xVal, y: yVal});

                    let panelTempObj = {canvasHeight: this.canvasHeight, canvasWidth: this.canvasWidth, characterHeight: this.characterHeight}

                    

                    

                    let panelClass = obj.Panel(PIXI, panelTempObj, obj.portal_code);
                    panelClass.build(panelCounter, this.panelWidth, this.panelHeight, userObject,  {x: xVal, y: yVal});
                    let panel = panelClass.returnPanel();
                    panel.x = xVal;
                    panel.y = yVal;
                    this.panels.push(panel)
                    panel.index = panelCounter;
                    this.backgroundCont.addChild(panel);

                   
                    panelCounter ++;
                }
            }
            let size = {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight}
            this.hero = obj.hero(PIXI, this.app, this.utils, size)
            this.hero.init();
            this.stage.addChild(this.hero.cont);
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

            let rightX = panel.x + this.panelWidth;
            let bottomY = panel.y + this.panelHeight;
            let topY = panel.y - this.panelHeight;
            let leftX = panel.x - this.panelWidth
             for (let i = 0; i < this.total; i++) {
                console.log(`${door.loc} ${rightX} versus ${this.panels[i].x}`);
                if (door.loc === 'top' && this.panels[i].y === topY && this.panels[i].x === panel.x) {
                    this.switchPanel(i);
                    break;
                } else if (door.loc === 'bottom' && this.panels[i].y === bottomY && this.panels[i].x === panel.x) {
                    this.switchPanel(i);
                    break;

                } else if (door.loc === 'left' && this.panels[i].x === leftX && this.panels[i].y === panel.y){
                    this.switchPanel(i);
                    break;

                } else if (door.loc === 'right' && this.panels[i].x === rightX && this.panels[i].y === panel.y) {
                   this.switchPanel(i);
                    break;
                }
             }
        },
        switchPanel: function (index) {
            this.ball.x = this.panelWidth/2;
            this.ball.y = this.panelHeight/2;
            this.ball.panel.removeChild(this.ball);
            this.panels[index].addChild(this.ball);
            this.ball.panel = this.panels[index];
            this.panelForArtBoard = index;

            obj.TweenMax.to(this.backgroundCont, 1, {x: -this.panels[index].x, y: -this.panels[index].y})
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
                //this.pellets.rotate("right", obj)
            
            } else if(str === 'left') {
                this.idle = false;
                this.hero.radius -= (Math.PI * 2) / this.inc;
                 this.velocity = this.utils.randomNumberBetween(4, 6);
                console.log( this.vx +" "+ this.velocity +" "+  Math.sin(this.hero.radius))
                this.vx = this.velocity * Math.sin(this.hero.radius);
                this.vy = -this.velocity * Math.cos(this.hero.radius);
                this.hero.storeRadius = this.hero.radius;
                let obj = {vx: -this.vx, vy: -this.vy}
                //this.pellets.rotate("left", obj)
            
            }

        },
        animate: function () {

            this.hero.animate();

            this.backgroundCont.x += -this.vx;// * rate;
            this.backgroundCont.y += -this.vy;// * rate;

            let yLimit = (this.panelHeight) -  (this.canvasHeight / 2);
            let xLimit = this.panelWidth - (this.canvasWidth / 2);

            if(this.backgroundCont.y > (this.canvasHeight / 2)) {
                this.vy = 0;
                this.backgroundCont.y = (this.canvasHeight / 2);
            } else if (this.backgroundCont.y < -yLimit) {
                this.vy = 0;
                this.backgroundCont.y = -yLimit;
            }

            if(this.backgroundCont.x > (this.canvasWidth / 2)) {
                this.vx = 0;
                this.backgroundCont.x = (this.canvasWidth / 2);
            } else if (this.backgroundCont.x < -xLimit) {
                this.vx = 0;
                this.backgroundCont.x = -xLimit;
            }
           
            this.renderer.render(this.stage);
        }
    }
}
