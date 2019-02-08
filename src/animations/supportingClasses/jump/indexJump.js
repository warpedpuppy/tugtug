import JumpAction from './jumpAction';
import JumpBackground from './jumpBackground';

export default function () {
	return {
		jumpAction: JumpAction(),
		jumpBackground: JumpBackground(),
		init: function (stage) {
            this.jumpAction.init(stage);
            this.jumpBackground.init(stage, this.jumpAction);
		},
		addToStage: function () {
			this.jumpBackground.addToStage();
			return this.jumpAction;
		},
		removeFromStage: function () {
			this.jumpBackground.removeFromStage();
		},
		resize: function () {
			this.jumpBackground.resize();
		},
		animate: function () {
			this.jumpBackground.animate();
		}
			
	}
}