import FlyBackground from './flyBackground';
import FlyAction from './flyAction';
export default function () {
	return {
		flyBackground: FlyBackground(),
		flyAction: FlyAction(),
		init: function (stage) {
			this.background = this.flyBackground;
			this.flyBackground.init(stage);
			this.flyAction.init();
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