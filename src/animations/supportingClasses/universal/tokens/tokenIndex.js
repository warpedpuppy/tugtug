import Utils from '../../../utils/utils';
import Tokens from './tokens';
import TokenSlots from './tokenSlots';
import TokenAnimations from './tokenAnimations';
export default function () {
	return {
		utils: Utils,
		tokens: [],
		init: function () {

			this.tokenSlots = TokenSlots();
			this.tokenAnimations = TokenAnimations();
			this.tokensClass = Tokens();
			this.tokens = this.tokensClass.build();
			this.slotsCont = this.tokenSlots.build();
			this.tokenSlots.addToStage();
			this.tokenAnimations.build();
				
		},
		reset: function () {
			this.tokenCounter = 0;
			for (let i = 0; i < 4; i ++) {
				let t =  this.utils.root.grid.gridBuild.tokens[i];
				if(t.parent)t.parent.removeChild(t)
				t.placed = false;
			}
		},
		fillSlot: function (token) {
			this.tokenSlots.fillSlot(token);
			this.tokenAnimations.playEarnedTokenAnimation();
		},
		wrongTokenAnimation: function (token) {
			this.tokenAnimations.wrongTokenAnimation(token);
		},
		removeFromStage: function () {

		},
		resize: function () {
			this.tokenSlots.resize();
			this.tokenAnimations.textCont.x = this.utils.canvasWidth / 2;
			this.tokenAnimations.textCont.y = this.utils.canvasHeight / 2;
		},
		animate: function () {

		}
	}
}