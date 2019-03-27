import JumpAction from './jumpAction';
import JumpBackground from './jumpBackground';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
export default function () {
	return {
		jumpAction: JumpAction(),
		jumpBackground: JumpBackground(),
		init: function (stage) {
			this.background = this.jumpBackground;
            this.jumpAction.init(stage);
            this.jumpBackground.init(stage, this.jumpAction);
            this.maskedItems = [
				this.jumpBackground.cont
			];
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