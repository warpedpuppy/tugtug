import Utils from './utils/utils';
import Assets from './utils/assetCreation';
import PixiFps from "pixi-fps";

export default function () {
    return {
        utils: Utils,
        init: function (startGameFunction) {

            this.canvasWidth =  this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();

            var app = this.app = Assets.Application( 400, 400, true);
            document.getElementById('startGameCanvas').appendChild(app.view);

            this.stage = app.stage;
        
            const fpsCounter = new PixiFps();
            app.stage.addChild(fpsCounter);

            this.startGameFunction = startGameFunction;

            let test = this.test = Assets.Graphics();
            test.beginFill(0xFF00FF).drawRect(0,0,100, 50).endFill();
            this.stage.addChild(test);
            test.interactive = true;
            test.buttonMode = true;
            this.startGame = this.startGame.bind(this);
            test.mousedown = test.touchdown = this.startGame;

            this.app.ticker.add(this.animate.bind(this));
        },
        startGame: function () {
            this.stage.removeChild(this.test);

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