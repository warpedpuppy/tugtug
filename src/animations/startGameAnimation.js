import Utils from './utils/utils';
import Assets from './utils/assetCreation';
import PixiFps from "pixi-fps";

export default function () {
    return {
        utils: Utils,
        startButton: Assets.Sprite('startButton.png'),
        init: function (startGameFunction) {

            this.canvasWidth =  this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();

            var app = this.app = Assets.Application( 400, 400, false);
            document.getElementById('startGameCanvas').appendChild(app.view);

            this.stage = app.stage;
        
            const fpsCounter = new PixiFps();
            app.stage.addChild(fpsCounter);

            this.startGameFunction = startGameFunction;

            this.startButton.anchor.set(0.5);
            this.startButton.x = 200;
            this.startButton.y = 100;
            this.stage.interactive = true;
            this.stage.addChild(this.startButton);
            this.startButton.interactive = true;
            this.startButton.buttonMode = true;
            this.startGame = this.startGame.bind(this);
            this.startButton.pointerdown = this.startGame;

            this.app.ticker.add(this.animate.bind(this));
        },
        startGame: function () {
            this.stage.removeChild(this.startButton);

             if(this.app)this.app.destroy(true);
             this.startGameFunction();
        },
        stop: function () {
            // window.onresize = undefined;
           
            // window.removeEventListener('keydown', this.keyDown);
            // window.removeEventListener('keyup', this.keyUp);
        },
        animate: function () {

            
            
        }
    }
}