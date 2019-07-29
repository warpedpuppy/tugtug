import SwimAction from './swimAction';
import SwimBackground from './swimBackground';
import Ripples from './ripples';
import Utils from '../../utils/utils';
// import Config from '../../animationsConfig';
export default function () {
	return {
		ripples: Ripples(),
		swimAction: SwimAction(),
		swimBackground: SwimBackground(),
		onGridCoins: [],
		utils: Utils,
		init: function (cont) {
			this.background = this.swimBackground;
			this.swimBackground.init(cont);
			this.ripples.init();
			this.swimAction.init(cont);
			
		},
		addToStage: function () {

			this.utils.root.grid.changeGridSize();
			let index = this.utils.root.stage.getChildIndex(this.utils.root.clock.cont) + 1;
			this.utils.root.grid.addToStage(index);

			this.ripples.on(true);
			this.swimBackground.addToStage();
			this.swimAction.start();
			
			this.swimAction.vx = this.swimAction.vy = 0;
			
            
			return this.swimAction;
		},
		removeFromStage: function () {
			this.ripples.on(false);
			this.swimBackground.removeFromStage();
			this.swimAction.airBubbles.resetAirBubbles();

			// this.utils.root.grid.clearGrid();
			// this.utils.root.grid.removeFromStage();
		},
		resize: function () {
			this.swimAction.resize();
			this.swimBackground.resize();
		},
		addCoinToGrid: function () {

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