import FlyBackground from './flyBackground';
import FlyAction from './flyAction';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
export default function () {
	return {
		flyBackground: FlyBackground(),
		flyAction: FlyAction(),
		init: function (parent, grassSquare) {
			this.background = this.flyBackground;
			this.flyBackground.init(parent);
			this.flyAction.init(parent, this.background);
			this.maskedItems = [
				this.flyBackground.cont
			];
		},
		addToStage: function () {
			this.flyBackground.addToStage();
			this.flyAction.createPool();
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