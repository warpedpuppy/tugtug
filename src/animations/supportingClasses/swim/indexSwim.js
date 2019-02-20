import SwimAction from './swimAction';
import SwimBackground from './swimBackground';
import FishSchool from './fishSchool';
import LilypadsLotuses from './lilypadsLotuses';
import Ripples from './ripples';
export default function () {
	return {
		lilypadLotuses: LilypadsLotuses(),
		ripples: Ripples(),
		swimAction: SwimAction(),
		fishSchool: FishSchool(),
		swimBackground: SwimBackground(),
		init: function (cont) {
			this.background = this.swimBackground;
			this.ripples.init();
			this.lilypadLotuses.init(cont);
			this.swimAction.init(cont);
			this.fishSchool.init(cont);
			this.swimBackground.init(cont);
			this.maskedItems = [
				this.swimBackground.cont, 
				this.swimBackground.cont2, 
				this.swimBackground.background,
				this.fishSchool.cont,
				this.lilypadLotuses.cont
			];
		},
		addToStage: function () {
			this.ripples.on(true);
			this.fishSchool.addToStage();
			this.lilypadLotuses.addToStage();
			this.swimBackground.addToStage();
			this.swimAction.start();
			return this.swimAction;
		},
		removeFromStage: function () {
			this.ripples.on(false);
			this.fishSchool.removeFromStage();
			this.lilypadLotuses.removeFromStage();
			this.swimBackground.removeFromStage();
			this.swimAction.airBubbles.resetAirBubbles();
		},
		resize: function () {
			this.swimAction.resize();
			this.swimBackground.resize();
		},
		animate: function () {
			this.ripples.animate();
			this.fishSchool.animate();
			this.swimBackground.animate();
			this.lilypadLotuses.animate();
		}
	}
}