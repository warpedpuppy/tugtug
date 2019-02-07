import SwimAction from '../actions/swimAction';
import SwimBackground from './swimBackground';
import FishSchool from './fishSchool';
import LilypadsLotuses from './lilypadsLotuses';
import Ripples from './ripples';
import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		ripples: Ripples(),
		swimAction: SwimAction(),
		fishSchool: FishSchool(),
		swimBackground: SwimBackground(),
		lilypadLotuses: LilypadsLotuses(),
		init: function (cont) {
			this.ripples.init();
			this.swimAction.init(cont);
			this.fishSchool.init(cont);
			this.swimBackground.init(cont);
			this.lilypadLotuses.init(cont);
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

		},
		animate: function () {
			this.ripples.animate();
			this.fishSchool.animate();
			this.swimBackground.animate();
			this.lilypadLotuses.animate();
		}
	}
}