import SwimAction from './swimAction';
import SwimBackground from './swimBackground';
import Ripples from './ripples';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
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
			
			this.maskedItems = [
				// this.swimBackground.cont, 
				// this.swimBackground.cont2, 
				// this.swimBackground.background,
				// this.fishSchool.cont,
				// this.lilypadLotuses.cont
			];
		},
		addToStage: function () {
			Utils.root.grid.changeGridSize(Config.swimBlockSize[0], Config.swimBlockSize[1])
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
		animate: function () {
			this.ripples.animate();
			this.swimBackground.animate();
			
		}
	}
}