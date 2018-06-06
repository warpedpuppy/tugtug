export default function Game (PIXI, Utils){
    return {
        utils: new Utils(),
        stage: new PIXI.Container(),
        app: new PIXI.Application(),
        loader: PIXI.loader,
        PIXI: PIXI,
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
          
            this.build();
            //this.handleKeyDown = this.handleKeyDown.bind(this);
            //document.addEventListener('keydown', this.handleKeyDown);
            this.app.ticker.add(this.animate.bind(this));

        },
        stop: function () {
            console.log(this.renderer)
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
                    this.ball.addChild(sprite)
                }
                
            })
        },
        build: function () { 
            this.ball = this.Ball();
            this.ball.x = this.halfWidth;
            this.ball.y = this.halfHeight;
            this.stage.addChild(this.ball);
            this.gamePlay = true;
        },
        Ball: function () {
            if(!this.cont){
                const cont = new PIXI.Container();
                const ball = new PIXI.Graphics();
                ball
                .beginFill(0x000000)
                .drawCircle(0,0,40)
                .endFill();
                ball.radius = 20;
                ball.vx = ball.vy = 10;
                cont.addChild(ball);
                return cont;
            } else {
                return this.cont;
            }
          
        },
        resize: function () {
            this.stage.removeChildren();
            this.canvasWidth = this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();
            this.halfHeight = this.canvasHeight / 2;
            this.halfWidth = this.canvasWidth / 2;
            this.renderer.resize(this.canvasWidth,this.canvasHeight);
            this.build();
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
            this.renderer.render(this.stage);
        }
    }
}
