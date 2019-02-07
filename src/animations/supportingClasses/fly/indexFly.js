import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
import FlyBackground from './flyBackground';
import FlyAction from '../actions/flyAction';
export default function () {
	return {
		flyBackground: FlyBackground(),
		flyAction: FlyAction(),
		init: function (stage) {

			this.flyBackground.init(stage);
			this.flyAction.init();
		},
		addToStage: function () {

			this.flyBackground.addToStage();
			return this.flyAction;
		},
		removeFromStage: function () {
			this.flyBackground.removeFromStage();
		},
		resize: function () {
			this.flyBackground.resize();
			this.flyAction.resize();
		},
		animate: function () {
			this.flyAction.animate();
		}
	}
}