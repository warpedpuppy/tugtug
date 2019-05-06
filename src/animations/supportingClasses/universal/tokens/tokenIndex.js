import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Tokens from './tokens';
import TokenSlots from './tokenSlots';
import TokenAnimations from './tokenAnimations';
export default {
		utils: Utils,
		tokens: [],
		init: function () {
		
			this.tokens = Tokens.build();
			this.slotsCont = TokenSlots.build();
			TokenSlots.addToStage();
			TokenAnimations.build();
				
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
			TokenSlots.fillSlot(token);
			TokenAnimations.playEarnedTokenAnimation();
		},
		// clearText: function (){
		// 	TokenAnimations.clearText();
		// },
		// addToStage: function () {
		// 	this.slotsCont.x = (this.utils.canvasWidth + 50) / 2;
		// 	this.slotsCont.y = this.utils.canvasHeight - 100;
		// 	this.utils.stage.addChild(this.slotsCont);
		// },
		removeFromStage: function () {

		},
		resize: function () {
			this.slotsCont.x = (this.utils.canvasWidth + 50) / 2;
			this.slotsCont.y = this.utils.canvasHeight - 100;
			TokenAnimations.textCont.x = this.utils.canvasWidth / 2;
			TokenAnimations.textCont.y = this.utils.canvasHeight / 2;
		},
		animate: function () {

		}
}