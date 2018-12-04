export default function Game (PIXI, Utils, supportingClasses, userObject, getUserName, TweenMax){
    return {
        utils: new Utils(),
        backgroundCont: new PIXI.Container(),
        foregroundCont: new PIXI.Container(),
        stage: new PIXI.Container(),
        app: new PIXI.Application(),
        loader: PIXI.loader,
        PIXI: PIXI,
        spacer: 50,
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
        init: function () {

            this.canvasWidth = this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();


            this.userObject = userObject;
            this.art_board = supportingClasses.art_board_code(this.utils, PIXI);
            this.art_board.init();



            this.Doorway = supportingClasses.portal_code;

            this.resize = this.resize.bind(this);
            window.onresize = this.resize;
            
            this.halfHeight = this.canvasHeight / 2;
            this.halfWidth = this.canvasWidth / 2;
            this.renderer = PIXI.autoDetectRenderer(this.canvasWidth, this.canvasHeight);
            this.renderer.backgroundColor = 0xFFFFFF;
            this.webGL = (this.renderer instanceof PIXI.CanvasRenderer) ? false : true;

            document.getElementById("game_canvas").appendChild(this.renderer.view);
            this.animate = this.animate.bind(this);

             this.dot = new PIXI.Graphics;
            // this.dot.beginFill(0x000000).drawCircle(0,0,10).endFill();
            // this.dot.x = this.halfWidth;
            // this.dot.y = this.halfHeight;
            this.stage.addChild(this.dot);

            this.ballClass = supportingClasses.hero(PIXI, this.characterHeight, this.utils, TweenMax);
            this.keyBoard = supportingClasses.keyHandler(this.speed, this.ballClass);

            this.build();
            this.addPegPanels();


            this.ripplesClass = supportingClasses.ripples(PIXI, this.app, this.renderer, this.stage);
            this.ripplesClass.init();
            
            
            this.stage.addChild(this.backgroundCont);
            this.stage.addChild(this.foregroundCont);
            this.app.ticker.add(this.animate.bind(this));
            
            // this.velX = this.velY = this.speed;
            this.total = this.cols * this.rows;
            this.placeBehindCols = this.cols - 1;
            this.placeBehindRows = this.rows - 1;
          
            console.log(this.keyBoard)
            this.keyBoard.activate();

            // this.dot = new PIXI.Graphics;
            // this.dot.beginFill(0x000000).drawCircle(0,0,10).endFill();
            // this.dot.x = this.halfWidth;
            // this.dot.y = this.halfHeight;
            // this.stage.addChild(this.dot);
          
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
                
                let w = this.panelWidth = this.canvasWidth;
                let h = this.panelHeight = this.canvasHeight - 50;
                
                let userObject = (this.userObject.users[panelCounter])?this.userObject.users[panelCounter]:{username: getUserName()};
                let xVal = w * j;
                let yVal = h * i;
                this.leftX = (this.cols - 1) * this.panelWidth;
                this.bottomY = (this.rows - 1) * this.panelHeight;
                panel = this.PegPanel(panelCounter, userObject, {x: xVal, y: yVal});
                panel.x = xVal;
                panel.y = yVal;
                this.panels.push(panel)
                panel.index = panelCounter;
                this.backgroundCont.addChild(panel);

                let frame = new PIXI.Graphics();
                frame.lineStyle(3, 0xFF0000).moveTo(0,0).lineTo(w, 0).lineTo(w,h).lineTo(0,h).lineTo(0,0)
                this.backgroundCont.addChild(frame);

                if (panelCounter === this.panelForArtBoard) {

                    let board = this.art_board.returnArtBoard();
                    board.x = (this.panelWidth - board.width)/2;
                    board.y = (this.panelHeight - board.height)/2;
                    this.art_board.setOffsets(board.x, board.y);
                    panel.addChild(board);
                    this.homePanel = panel;

                   
                    this.ballClass.build();
                    this.ball = this.ballClass.returnChain();
                    this.ball.x = this.halfWidth;
                    this.ball.y = this.halfHeight;
                    this.ball.bottom = this.panelHeight - (this.characterHeight / 2);
                    this.ball.panel = panel;
                    panel.addChild(this.ball);



                    let line = new PIXI.Graphics;
                    line.lineStyle(10, 0x000000);
                    // 
                    line.moveTo(100,100).arcTo(100,100, 100, 100, 25);
                    //line.moveTo(0, 0).lineTo(100,100);
                    line.x = line.y = 300;
                    panel.addChild(line)
                }
                panelCounter ++;
            }
            }

          // this.backgroundCont.scale.x = this.backgroundCont.scale.y = 0.25;

        },
        PegPanel: function (num, userData, point) {
            let peg,
                pegPanel = new PIXI.Container();

            let horizQ = 2;//(this.canvasWidth / this.spacer) + 1;
            let vertQ = 2;//this.canvasHeight / this.spacer;

            this.horizSpacer = 100;
            this.vertSpacer = 50;

            let background = new PIXI.Graphics();
            background.beginFill(0x0000FF, 0.5).drawRect(0,0,this.panelWidth, this.panelHeight).endFill();
            pegPanel.addChild(background);

            let dot = new PIXI.Graphics();
            dot.beginFill(0x000000).drawCircle(0,0,100).endFill();
            dot.x = this.panelWidth/2;
            dot.y = this.panelHeight/2;
            dot.pivot.x = dot.pivot.y = 0.5;
            pegPanel.addChild(dot);

            let text = new PIXI.Text(num,{fontFamily : 'Arial', fontSize: 48, fill : 0xffffff, align : 'center'});
            text.x = this.panelWidth/2;
            text.y = this.panelHeight/2;
            text.anchor.x = text.anchor.y = 0.5;
            pegPanel.addChild(text)


            let name = new PIXI.Text(userData.username,{fontFamily : 'Arial', fontSize: 150, fill : 0x000000, align : 'center'});
            name.x = 100;
            name.y = 50;
            pegPanel.addChild(name)

             let frame = new PIXI.Graphics();
                frame.lineStyle(10, 0xFF00FF)
                .moveTo(0,0)
                .lineTo(this.panelWidth, 0)
                .lineTo(this.panelWidth,this.panelHeight)
                .lineTo(0,this.panelHeight).lineTo(0,0)
                pegPanel.addChild(frame);


            let offset = [0.33, 0.66, 1];
            let storeX = 0;
         

            
            let topDoor = this.Doorway(PIXI, this.characterHeight, 10, 'top');
            topDoor.x = (this.canvasWidth - this.characterHeight)/2;
            if (point.y !== 0) {
                pegPanel.addChild(topDoor);
            }
            
            let bottomDoor = this.Doorway(PIXI, this.characterHeight, 10, 'bottom');
            bottomDoor.x = (this.canvasWidth - this.characterHeight)/2;
            bottomDoor.y = this.panelHeight - 10;
            if(point.y !== this.bottomY){
                pegPanel.addChild(bottomDoor);
            }

            let leftDoor = this.Doorway(PIXI, 10, this.characterHeight, 'left');
            leftDoor.x = 0;
            leftDoor.y = (this.canvasHeight - this.characterHeight)/2;
            if (point.x !== 0) {
                pegPanel.addChild(leftDoor);
            }

            let rightDoor = this.Doorway(PIXI, 10, this.characterHeight, 'right');
            rightDoor.x = this.canvasWidth - 10;
            rightDoor.y = (this.canvasHeight - this.characterHeight)/2;
            if(point.x !== this.leftX){
                pegPanel.addChild(rightDoor);
            }
            
            
            this.doors = [topDoor, bottomDoor, leftDoor, rightDoor];

            if (num === this.panelForArtBoard) {
               
               
            }

            return pegPanel;
        },
        stop: function () {
            this.app.ticker.destroy();
            this.renderer.destroy();
            window.onresize = undefined;
            console.log(this.renderer)
           this.keyboard.deactivate();
        },
        build: function () { 
            this.gamePlay = true;
        },
        // hidePanels: function (hide) {
        //      for(let i = 0; i < this.total; i++){
        //         if (this.panels[i] !== this.homePanel) {
        //             this.panels[i].visible = !hide;
        //         }
        //      }
        // },
        resize: function () {
            this.canvasWidth = this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();
            this.halfHeight = this.canvasHeight / 2;
            this.halfWidth = this.canvasWidth / 2;
            this.renderer.resize(this.canvasWidth,this.canvasHeight);
            this.ball.x = this.halfWidth;
            this.ball.y = this.halfHeight;
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

            TweenMax.to(this.backgroundCont, 1, {x: -this.panels[index].x, y: -this.panels[index].y})
        },
        rotateChain: function () {
            this.ballClass.pos.push(this.ballClass.radius);
            this.increment = 10;
            let maxLength = this.increment * this.numBalls;
            if (this.ballClass.pos.length > maxLength) {
                this.ballClass.pos = this.ballClass.pos.slice(-maxLength);
            }

             this.ballClass.balls[0].rotation = this.ballClass.radius;
            for (let i = 1; i < this.ballClass.numBalls; i++) {
                let index = this.ballClass.pos.length - (i * this.increment);
                if (this.ballClass.pos.length >= index) {
                 this.ballClass.balls[i].rotation = this.ballClass.pos[index];
                }
            }
        },

        animate: function () {
          // this.ball.rotation = this.utils.deg2rad(Math.floor(this.utils.cosWave(0, 50, 0.0015)));
          //console.log(this.ball.x+" "+this.ball.y)



          this.ripplesClass.animate();


        

           if (this.keyBoard.rotateAllow) {
            this.rotateChain();
           }

            if (this.keyBoard.moveAllow) {

                  var rate = 2;//Math.max(this.VELOCITY_LIMIT, Math.sin(this.theta));

                  this.ball.x += this.ballClass.vx;// * rate;
                  this.ball.y += this.ballClass.vy;// * rate;
                 

                 this.rotateChain();

                // this.ball.balls[0].y += this.keyBoard.vy;
                // this.ball.balls[0].x += this.keyBoard.vx;

               // this.ball.rotation += this.utils.deg2rad(.5);

               // this.ballClass.animate();
                
                if(this.ball.y < (this.characterHeight / 2)) {
                    this.keyBoard.vy = 0;
                    this.ball.y = (this.characterHeight / 2)
                }

                if(this.ball.y > (this.panelHeight - (this.characterHeight / 2))) {
                    this.keyBoard.vy = 0;
                    this.ball.y = (this.panelHeight - (this.characterHeight / 2));
                }

                if(this.ball.x < (this.characterHeight / 2)) {
                    this.keyBoard.vx = 0;
                    this.ball.x = (this.characterHeight / 2);
                }

                if(this.ball.x > (this.panelWidth - (this.characterHeight / 2))) {
                    this.keyBoard.vx = 0;
                    this.ball.x = (this.panelWidth - (this.characterHeight / 2));
                }

                for (let i = 0; i < 4; i ++ ) {
                    let circle = this.ball;
                    let rect = new PIXI.Rectangle(this.doors[i].x, this.doors[i].y, this.doors[i].width, this.doors[i].height)
                    if (this.utils.circleRectangleCollision(circle, rect)) {
                        this.whichPanel(this.doors[i], this.ball.panel)
                    }
                }
           }
            this.renderer.render(this.stage);
        }
    }
}
