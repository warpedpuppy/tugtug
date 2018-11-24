export default function Game (PIXI, Utils, art_board, userObject, getUserName){
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
        velX: 0,
        velY: 0,
        speed: 2,
        cols: 4,
        rows: 4,
        move: false,
        panelForArtBoard: 0,
        homePanel: undefined,
        characterHeight: 154,
        moveAllow: false,
        doors: [],
        init: function () {



            this.userObject = userObject;

            this.art_board = art_board(this.utils, PIXI);
            this.art_board.init();

            this.resize = this.resize.bind(this);
            window.onresize = this.resize;
            this.canvasWidth = this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();
            this.halfHeight = this.canvasHeight / 2;
            this.halfWidth = this.canvasWidth / 2;
            this.renderer = PIXI.autoDetectRenderer(this.canvasWidth, this.canvasHeight);
            this.renderer.backgroundColor = 0xFFFFFF;
            this.webGL = (this.renderer instanceof PIXI.CanvasRenderer) ? false : true;
            // if(this.webGL) {
            // }
            document.getElementById("game_canvas").appendChild(this.renderer.view);
            this.animate = this.animate.bind(this);
            this.build();
            this.addPegPanels();
            
            this.stage.addChild(this.backgroundCont);
            this.stage.addChild(this.foregroundCont);
            this.app.ticker.add(this.animate.bind(this));
            this.keyDown = this.keyDown.bind(this);
            this.velX = this.velY = this.speed;
            this.total = this.cols * this.rows;
            this.placeBehindCols = this.cols - 1;
            this.placeBehindRows = this.rows - 1;
            window.addEventListener('keydown', this.keyDown);

        },
        changeColor: function (color) {
            console.log("change color");
            this.art_board.changeColor(color);
        },
        keyDown: function(e){
            e.preventDefault();
             window.addEventListener('keyup', this.keyUp);
             switch (e.keyCode) {
                case 37:
                    this.moveAllow = true;
                    this.vx = -this.speed;
                    this.vy = 0;
                    break;
                case 38:
                    //alert('up');
                    this.moveAllow = true;
                    this.vy = -this.speed;
                    this.vx = 0;
                    break;
                case 39:
                    //alert('right');
                    this.moveAllow = true;
                    this.vx = this.speed;
                    this.vy = 0;
                    break;
                case 40:
                    //alert('down');
                    this.vy = true;
                    this.velY = this.speed;
                    this.vx = 0;
                    break;
                default:
                    this.velY = 0;
            }
        },
        keyUp: function (e) {
            e.preventDefault();
            this.moveAllow = false;
            window.removeEventListener('keyup', this.keyUp);
        },
        addPegPanels: function () {
            let panel,
                panelCounter = 0;
            this.panels = [];
            this.backgroundCont.removeChildren();
            for(let i = 0; i < this.rows; i++){
                for (let j = 0; j < this.cols; j ++) {
                
                let w = this.panelWidth = this.canvasWidth;//panel.width;
                let h = this.panelHeight = this.canvasHeight;
                let userObject = (this.userObject.users[panelCounter])?this.userObject.users[panelCounter]:{username: getUserName()};
                panel = this.PegPanel(panelCounter, userObject);
                panel.x = w * j;
                panel.y = h * i;
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
                }
                panelCounter ++;
            }
            }
           this.backgroundCont.scale.x = this.backgroundCont.scale.y = 0.25;

        },
        BouncePlatform () {
            let cont = new PIXI.Container();
            let platform = new PIXI.Graphics();
            let w = (this.utils.returnCanvasWidth() * 0.1);
            let h = (w * 0.05);
            platform.beginFill(0x000000).drawRect(0,0,w, h).endFill();
            platform.pivot.x = platform.pivot.y = 0.5;
            cont.addChild(platform);
            return cont;
        },
        Doorway (w,h) {
            let cont = new PIXI.Container();
            let platform = new PIXI.Graphics();
            platform.beginFill(0xFF0000).drawRect(0,0,w, h).endFill();
            //platform.pivot.x = platform.pivot.y = 0.5;
            cont.addChild(platform);
            return cont;
        },
        PegPanel: function (num, userData) {
            let peg,
                pegPanel = new PIXI.Container();

            let horizQ = 2;//(this.canvasWidth / this.spacer) + 1;
            let vertQ = 2;//this.canvasHeight / this.spacer;

            this.horizSpacer = 100;
            this.vertSpacer = 50;

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


            for (let i = 0; i < vertQ; i ++) {
                for (let j = 0; j < horizQ; j ++) {
                    peg = this.Peg();
                    peg.x = j*this.panelWidth;
                    peg.y = i*this.panelHeight;
                    pegPanel.addChild(peg);
                }
            }

             let frame = new PIXI.Graphics();
                frame.lineStyle(3, 0xFF00FF)
                .moveTo(0,0)
                .lineTo(this.panelWidth, 0)
                .lineTo(this.panelWidth,this.panelHeight)
                .lineTo(0,this.panelHeight).lineTo(0,0)
                pegPanel.addChild(frame);


            let offset = [0.33, 0.66, 1];
            let storeX = 0;
            for (let i = 0; i < 3; i ++) {
                let bp = this.BouncePlatform();
                bp.x = this.utils.randomNumberBetween(storeX, (this.canvasWidth - bp.width) * offset[i]);
                bp.y = (this.utils.randomNumberBetween(0, this.canvasHeight)) * 0.66;
                storeX = bp.x + bp.width;
                pegPanel.addChild(bp)
            }

            let topDoor = this.Doorway(this.characterHeight, 10);
            topDoor.loc = 'top';
            topDoor.x = (this.canvasWidth - this.characterHeight)/2;
            pegPanel.addChild(topDoor);

            let bottomDoor = this.Doorway(this.characterHeight, 10);
            bottomDoor.x = (this.canvasWidth - this.characterHeight)/2;
            bottomDoor.y = this.panelHeight - 10;
            bottomDoor.loc = 'bottom';
            pegPanel.addChild(bottomDoor);

            let leftDoor = this.Doorway(10, this.characterHeight);
            leftDoor.x = 0;
            leftDoor.y = (this.canvasHeight - this.characterHeight)/2;
            leftDoor.loc = 'left';
            pegPanel.addChild(leftDoor);

            let rightDoor = this.Doorway(10, this.characterHeight);
            rightDoor.x = this.canvasWidth - 10;
            rightDoor.y = (this.canvasHeight - this.characterHeight)/2;
            pegPanel.addChild(rightDoor);
            rightDoor.loc = 'right';
            this.doors = [topDoor, bottomDoor, leftDoor, rightDoor];

            if(num === this.panelForArtBoard){
                this.ball = this.Ball();
                this.ball.x = this.halfWidth;
                this.ball.y = this.halfHeight;
                this.ball.bottom = this.panelHeight - (this.characterHeight / 2);
                this.ball.panel = pegPanel;
                pegPanel.addChild(this.ball);
            }

            return pegPanel;
        },
        Peg: function () {
            let dot = new PIXI.Graphics();
            dot.beginFill(0x333333).drawCircle(0,0,50).endFill();
            return dot;
        },
        stop: function () {
            this.app.ticker.destroy();
            this.renderer.destroy();
            window.onresize = undefined;
            console.log(this.renderer)
           
        },
        reset: function () {
            this.BricksReset();
            this.build();

        },
        update: function (items) {
            
            items.forEach(item => {
                if(item.active){
                    let sprite = new PIXI.Sprite.fromImage(item.url);
                    sprite.anchor.x = sprite.anchor.y = 0.5;
                    sprite.y = -110;
                    this.ball.addChild(sprite)
                }
                
            })
        },
        build: function () { 
            this.gamePlay = true;
        },
        toggleAvi: function (stopAction) {
            if(!stopAction){
                this.foregroundCont.addChild(this.ball);
                this.homePanel.x = this.storeX;
                this.homePanel.y = this.storeY;
                this.move = true;
                this.hidePanels(false);
            } else {
                this.foregroundCont.removeChild(this.ball);
                this.move = false;
                this.hidePanels(true);
                this.storeX = this.homePanel.x;
                this.storeY = this.homePanel.y;
                this.homePanel.x = this.homePanel.y = 0;
            }
        },
        hidePanels: function (hide) {
             for(let i = 0; i < this.total; i++){
                if (this.panels[i] !== this.homePanel) {
                    this.panels[i].visible = !hide;
                }
             }
        },
        Ball: function () {
            if(!this.cont){
                let sprite = new PIXI.Sprite.fromImage('/bmps/character.png');
                sprite.anchor.x = sprite.anchor.y =0.5;
                const cont = new PIXI.Container();
                const ball = new PIXI.Graphics();
                ball
                .beginFill(0x000000)
                .drawCircle(0,0,40)
                .endFill();
                ball.radius = cont.radius = this.characterHeight / 2;
                ball.vx = ball.vy = cont.vy = 10;
                cont.sprite = sprite;
                cont.addChild(sprite);
                return cont;
            } else {
                return this.cont;
            }
          
        },
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
            console.log(panel.index+" "+door.loc)
            if(door.loc === 'up') {

            } else if (door.loc === 'down') {

            } else if (door.loc === 'left'){

            } else if (door.loc === 'right') {

            }

        },
        animate: function () {
            if (this.move) {
                for(let i = 0; i < this.total; i++){
                    this.panels[i].y += this.velY;
                    this.panels[i].x += this.velX;
                    if(this.panels[i].y > this.panelHeight * this.placeBehindRows){
                        this.panels[i].y = -this.panelHeight;
                    }
                    if(this.panels[i].x > this.panelWidth * this.placeBehindCols){
                        this.panels[i].x = -this.panelWidth;
                    }
                     if(this.panels[i].y < -this.panelHeight * this.placeBehindRows){
                        this.panels[i].y = this.panelHeight;
                    }
                    if(this.panels[i].x < -this.panelWidth * this.placeBehindCols){
                        this.panels[i].x = this.panelWidth;
                    }
                }
            }

            if(this.moveAllow) {

                this.ball.y += this.vy;
                this.ball.x += this.vx;

                if(this.ball.y < (this.characterHeight / 2)) {
                    this.vy = 0;
                    this.ball.y = (this.characterHeight / 2)
                }

                if(this.ball.y > (this.panelHeight - (this.characterHeight / 2))) {
                    this.vy = 0;
                    this.ball.y = (this.panelHeight - (this.characterHeight / 2));
                }

                if(this.ball.x < (this.characterHeight / 2)) {
                    this.vx = 0;
                    this.ball.x = (this.characterHeight / 2);
                }

                if(this.ball.x > (this.panelWidth - (this.characterHeight / 2))) {
                    this.vx = 0;
                    this.ball.x = (this.panelWidth - (this.characterHeight / 2));
                }

                for (let i = 0; i < 4; i ++ ) {
                    let circle = this.ball;
                    let rect = new PIXI.Rectangle(this.doors[i].x, this.doors[i].y, this.doors[i].width, this.doors[i].height)
                    if (this.utils.circleRectangleCollision(circle, rect)) {
                        //console.log("hit");
                        this.whichPanel(this.doors[i], this.ball.panel)
                    }
                }


         
            }
         

            // let globalPoint = this.panels[4].toGlobal(new PIXI.Point(this.panels[4].x,this.panels[4].y ));
            // if(this.panels[4].y > this.panelHeight*2){
            //     this.panels[4].y = -this.panelHeight;
            // }
            this.renderer.render(this.stage);
        }
    }
}
