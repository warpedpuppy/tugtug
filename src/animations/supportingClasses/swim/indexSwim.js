import SwimAction from './swimAction';
import SwimBackground from './swimBackground';
import Ripples from './ripples';
// import Utils from '../../utils/utils';
// import Config from '../../animationsConfig';
export default function () {
	return {
		ripples: Ripples(),
		swimAction: SwimAction(),
		swimBackground: SwimBackground(),
		init: function (cont) {
			this.background = this.swimBackground;
			this.swimBackground.init(cont);
			this.ripples.init();
			this.swimAction.init(cont);
			
		},
		addToStage: function () {
			this.ripples.on(true);
			this.swimBackground.addToStage();
			this.swimAction.start();
			return this.swimAction;
		},
		removeFromStage: function () {
			this.ripples.on(false);
			this.swimBackground.removeFromStage();
			this.swimAction.airBubbles.resetAirBubbles();
		},
		resize: function () {
			this.swimAction.resize();
			this.swimBackground.resize();
		},
		startSpaceShipJourney: function () {
			this.ripples.on(false);
            this.swimBackground.startSpaceShipJourney();
        },
        endSpaceShipJourney: function () {
        	this.ripples.on(true);
            this.swimBackground.endSpaceShipJourney();
        },
		animate: function () {
			this.ripples.animate();
			this.swimBackground.animate();
			this.swimAction.animate();
			
		}
	}
}