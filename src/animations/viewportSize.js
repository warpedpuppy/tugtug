import Utils from './utils/utils';
import Assets from './utils/assetCreation';
import Clock from './supportingClasses/clock';
import Swim from './supportingClasses/swim/indexSwim';
import Bounce from './supportingClasses/bounce/indexBounce';
import Fly from './supportingClasses/fly/indexFly';
import Jump from './supportingClasses/jump/indexJump';
import Pellets from './supportingClasses/pellets';
import Treasure from '../animations/supportingClasses/treasure';
import MagicPills from './supportingClasses/magicPills';
import TransitionItems from './supportingClasses/transitionItems';
import FilterAnimation from './supportingClasses/filterAnimation';
import Gears from './supportingClasses/gears';
import Hero from './supportingClasses/hero';
import Score from '../animations/supportingClasses/score';
import ControlPanel from './supportingClasses/controlPanel';
import LevelSlots from './supportingClasses/level/levelSlots';
//import IntroScreen from './supportingClasses/introScreen';
import PixiFps from "pixi-fps";
import Config from './animationsConfig';

export default function(obj) {
    return {
        idle: true,
        vx: 0,
        vy: 5,
        rotateLeftBoolean: false,
        rotateRightBoolean: false,
        renderTextureTestBoolean: false,
        inc: 90,
        mode: ['jump','bounce','fly','swim'],
        activeModeIndex: 0,
        activeMode: undefined,
        backgroundCont: Assets.Container(),
        foregroundCont: Assets.Container(),
        filterContainer: Assets.Container(),
        ripples: undefined,
        action: false,
        spriteSheet: undefined,
        gears: Gears,
        clock: Clock,
        pellets: Pellets(),
        magicPills: MagicPills(),
        filterAnimation: FilterAnimation(),
        hero: Hero(),
        transitionItems: TransitionItems(),
        utils: Utils,
        treasure: Treasure(),
        score: Score(),
        loader: Assets.Loader(),
        activeAction: undefined,
        config: Config,
        swim: Swim(),
        bounce: Bounce(),
        fly: Fly(),
        jump: Jump(),
        levelSlots: LevelSlots(),
        screen: Assets.Graphics(),
        controlPanel: ControlPanel(),
       // introScreen: IntroScreen(),
        init: function () {

        

            this.canvasWidth =  this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();

            var app = this.app = Assets.Application( this.canvasWidth,  this.canvasHeight, false);
            document.getElementById('homeCanvas').appendChild(app.view);

            this.stage = app.stage;
        
            const fpsCounter = new PixiFps();
            app.stage.addChild(fpsCounter);

            let box = this.box = Assets.Graphics();
            box.beginFill(0xFF00FF).drawRect(-5,-5,10,10).endFill();
            box.y = this.canvasHeight / 2;
            box.x = this.canvasWidth / 2;
            this.stage.addChild(box)
             window.onresize = this.resizeHandler.bind(this);
            this.app.ticker.add(this.animate.bind(this));

        },
        resizeHandler: function () {
            this.canvasWidth =  this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();

            this.utils.resize(this.canvasWidth, this.canvasHeight);

            this.app.renderer.resize(this.canvasWidth, this.canvasHeight);

            this.box.y = this.canvasHeight / 2;
            this.box.x = this.canvasWidth / 2;
        },
        animate: function () {
           
            
            


        }
    }
}