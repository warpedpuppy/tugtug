import BouncePlatform from './bouncePlatform';
import BounceBackground from './bounceBackground/bounceBackgroundIndex';
import BounceAction from './bounceAction';
import BounceInstructions from './bounceInstructions';
//import BouncePoints from './bouncePoints';
 import Utils from '../../utils/utils';
// import Config from '../../animationsConfig';
export default function () {
	return {
		utils: Utils,
		bouncePlatform: BouncePlatform(),
		bounceAction: BounceAction(),
		bounceBackground: BounceBackground(),
		//bouncePoints: BouncePoints(),
		init: function (cont) {
			this.background = this.bounceBackground;
			this.bounceInstructions = BounceInstructions.init();
    		this.bouncePlatform.init(cont, this.bounceInstructions);
    		this.bouncePlatform.on(false); 
    		this.bounceAction.init(this.bouncePlatform);
    		//this.bouncePoints.init();
    		this.bounceBackground.init(this.bounceAction, this.bouncePoints);
		},
		reset: function () {
			this.bounceBackground.reset();
		},
		addToStage: function () {
			this.bouncePlatform.start();
			this.bouncePlatform.on(true);
			this.bounceBackground.addToStage();
			this.bounceInstructions.addToStage();
			//this.bouncePoints.addToStage();
			return this.bounceAction
		},
		removeFromStage: function () {
			this.bouncePlatform.on(false);
			this.bounceBackground.removeFromStage();
			this.bounceInstructions.removeFromStage();
			//this.bouncePoints.removeFromStage();
		},
		tokenEarn: function () {
			this.utils.root.earnToken(this.utils.root.grid.gridBuild.tokens[2]);
		},
		resize: function () {
			BounceInstructions.resize();
			this.bouncePlatform.resize();
			//this.bouncePoints.resize();
			this.bounceBackground.resize();
		},
		startSpaceShipJourney: function () {
		   this.bounceBackground.startSpaceShipJourney();
           this.bouncePlatform.on(false);
        },
        endSpaceShipJourney: function () {
        	this.bounceBackground.endSpaceShipJourney();
            this.bouncePlatform.on(true);
        },
		animate: function () {
			this.bouncePlatform.animate();
			this.bounceBackground.animate();
			this.bounceAction.animate();
			//this.bouncePoints.animate();
		}
	}
}