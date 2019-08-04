import FlyBackground from './flyBackground';
import FlyAction from './flyAction';
import Utils from '../../utils/utils';
// import Config from '../../animationsConfig';
export default function () {
	return {
		flyBackground: FlyBackground(),
		flyAction: FlyAction(),
		onGridCoins: [],
		utils: Utils,
		init: function (parent, grassSquare) {
			this.background = this.flyBackground;
			this.flyBackground.init(parent);
			this.flyAction.init(parent, this.background);
		},
		addToStage: function () {
			this.utils.root.grid.changeGridSize();
			let index = this.utils.root.stage.getChildIndex(this.utils.root.clock.cont) + 1;
			this.utils.root.grid.addToStage(index);

			this.flyBackground.addToStage();
			this.flyAction.createPool();
			
            this.flyAction.radius = this.flyAction.storeRadius = 0;
            this.flyAction.vx = this.flyAction.vy = 0;
			return this.flyAction;
		},
		removeFromStage: function () {
			this.flyBackground.removeFromStage();
			// this.utils.root.grid.clearGrid();
			// this.utils.root.grid.removeFromStage();
		},
		resize: function () {
			this.flyBackground.resize();
			this.flyAction.resize();
		},
		addCoinToGrid: function () {

		},
		startSpaceShipJourney: function () {
            
        },
        endSpaceShipJourney: function () {
            
        },
		animate: function () {
			this.flyAction.animate();
		}
	}
}