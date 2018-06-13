export default function Game (PIXI, Utils){
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
        speed: 0.5,
        init: function () {
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
            //this.handleKeyDown = this.handleKeyDown.bind(this);
            //document.addEventListener('keydown', this.handleKeyDown);
            this.stage.addChild(this.backgroundCont);
            this.stage.addChild(this.foregroundCont);
            this.app.ticker.add(this.animate.bind(this));
            this.keyPress = this.keyPress.bind(this);
            this.velX = this.velY = this.speed;
            window.addEventListener('keydown', this.keyPress);

        },
        keyPress: function(e){
            e.preventDefault();
             switch (e.keyCode) {
                case 37:
                    //alert('left');
                    this.velX = -this.speed;
                    break;
                case 38:
                    //alert('up');
                    this.velY = -this.speed;
                    break;
                case 39:
                    //alert('right');
                    this.velX = this.speed;
                    break;
                case 40:
                    //alert('down');
                    this.velY = this.speed;
                    break;
                default:
                    console.log('')
            }
        },
        addPegPanels: function () {
            let panel,
                panelCounter = 0;
            for(let i = 0; i < 3; i++){
                for (let j = 0; j < 3; j ++) {
                panel = this.PegPanel(panelCounter);
                console.log(panel.width);
                let w = this.panelWidth = panel.width;
                let h = this.panelHeight = panel.height;
                if(panelCounter === 0){
                    panel.y = -h;
                    panel.x = -w;
                } else if (panelCounter === 1){
                    panel.y = -h;
                    panel.x = 0;
                } 
                else if (panelCounter === 2){
                    panel.y = -h;
                    panel.x = w;
                } else if (panelCounter === 3){
                    panel.y = 0;
                    panel.x = -w;
                } else if (panelCounter === 4){
                    panel.y = 0;
                    panel.x = 0;
                } else if (panelCounter === 5){
                    panel.y = 0;
                    panel.x = w;
                } else if (panelCounter === 6){
                    panel.y = h;
                    panel.x = -w;
                } else if (panelCounter === 7){
                    panel.y = h;
                    panel.x = 0;
                } else if (panelCounter === 8){
                    panel.y = h;
                    panel.x = w;
                }
                this.panels.push(panel)
                //this.backgroundCont.scale.x = this.backgroundCont.scale.y = 0.15;
                this.backgroundCont.x = 400
                this.backgroundCont.y = 300;
                this.backgroundCont.addChild(panel);

                let frame = new PIXI.Graphics();
                frame.lineStyle(3, 0xFF0000).moveTo(0,0).lineTo(w, 0).lineTo(w,h).lineTo(0,h).lineTo(0,0)
                this.backgroundCont.addChild(frame);
                panelCounter ++;
            }
            }

        },
        PegPanel: function (num) {
            let peg,
                pegPanel = new PIXI.Container();

            let horizQ = 2;//(this.canvasWidth / this.spacer) + 1;
            let vertQ = 2;//this.canvasHeight / this.spacer;

            let dot = new PIXI.Graphics();
            dot.beginFill(0x000000).drawCircle(0,0,20).endFill();
            dot.x = this.spacer/2;
            dot.y = this.spacer/2;
            dot.pivot.x = dot.pivot.y = 0.5;
            pegPanel.addChild(dot);

             let text = new PIXI.Text(num,{fontFamily : 'Arial', fontSize: 24, fill : 0xffffff, align : 'center'});
             text.x = this.spacer/2;
            text.y = this.spacer/2;
            text.anchor.x = text.anchor.y = 0.5;
             pegPanel.addChild(text)


            for (let i = 0; i < vertQ; i ++) {
                for (let j = 0; j < horizQ; j ++) {
                    peg = this.Peg();
                    peg.x = j*this.spacer;
                    peg.y = i*this.spacer;
                    pegPanel.addChild(peg);
                }
            }
            return pegPanel;
        },
        Peg: function () {
            let dot = new PIXI.Graphics();
            dot.beginFill(0x333333).drawCircle(0,0,2).endFill();
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
            this.ball = this.Ball();
            this.ball.x = this.halfWidth;
            this.ball.y = this.halfHeight;
            //this.foregroundCont.addChild(this.ball);
            this.gamePlay = true;
        },
        Ball: function () {
            if(!this.cont){
                let sprite = new PIXI.Sprite.fromImage('/bmps/character.png');
                sprite.anchor.x = sprite.anchor.y =0.5;
                const cont = new PIXI.Container();
                // const ball = new PIXI.Graphics();
                // ball
                // .beginFill(0x000000)
                // .drawCircle(0,0,40)
                // .endFill();
                // ball.radius = 20;
                // ball.vx = ball.vy = 10;
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
        },
        handleKeyDown: function (event) {
            event.preventDefault();
            switch(event.keyCode) {
                case 39:
                    //right
                    this.paddle.vx = this.paddle.speed;
                    this.paddle.moveLeft = false;
                    this.paddle.moveRight= true;
                    this.paddle.peterOut = false;

                    break;
                case 37:
                    //left
                    this.paddle.vx = this.paddle.speed;
                    this.paddle.moveLeft = true;
                    this.paddle.moveRight= false;
                    this.paddle.peterOut = false;
                    break;
                case 13:
                    this.startButton.classRef.startGame();
                    break;
                default:
                    this.paddle.vx = 0;
                    break;

            }
        },
        handleKeyUp: function (event) {
            switch(event.keyCode) {
                case 39:
                    //right
                    this.paddle.moveRight= false;
                    this.paddle.peterOut = true;
                    break;
                case 37:
                    //left
                    this.paddle.peterOut = true;
                    this.paddle.moveLeft = false;
                    break;
                default:
                    this.paddle.moveRight= false;
                    this.paddle.peterOut = false;
                    this.paddle.peterOut = false;
                    this.paddle.moveLeft = false;
                    break;

            }
        },
        animate: function () {
            for(let i = 0; i < 9; i++){
                this.panels[i].y += this.velY;
                this.panels[i].x += this.velX;
                if(this.panels[i].y > this.panelHeight*2){
                    this.panels[i].y = -this.panelHeight;
                }
                if(this.panels[i].x > this.panelWidth*2){
                    this.panels[i].x = -this.panelWidth;
                }
                 if(this.panels[i].y < -this.panelHeight*2){
                    this.panels[i].y = this.panelHeight;
                }
                if(this.panels[i].x < -this.panelWidth*2){
                    this.panels[i].x = this.panelWidth;
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
