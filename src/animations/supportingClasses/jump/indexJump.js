import JumpAction from './jumpAction';
import JumpBackground from './jumpBackground';
import Utils from '../../utils/utils';
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

            //console.log(this.jumpBackground.currentOrb.width)
            Utils.hero.activeHero.cont.y = this.jumpBackground.currentOrb.background.width / 2
			Utils.hero.activeHero.floor = -this.jumpBackground.currentOrb.background.width / 2
		},
		reset: function () {
			this.jumpBackground.reset();
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