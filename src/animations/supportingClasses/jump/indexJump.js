import JumpAction from './jumpAction';
import JumpBackground from './jumpBackground';
// import Utils from '../../utils/utils';
// import Config from '../../animationsConfig';
export default function () {
	return {
		jumpAction: JumpAction(),
		jumpBackground: JumpBackground(),
		init: function (stage) {
			this.removeFromStage = this.removeFromStage.bind(this);
			this.background = this.jumpBackground;
            this.jumpAction.init(stage);
            this.jumpBackground.init(stage, this.jumpAction);
		},
		reset: function () {
			this.jumpBackground.tokenTaken = false;
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
			this.jumpAction.animate();
		}
			
	}
}