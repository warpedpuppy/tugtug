import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Tweens from '../../../utils/tweens';
export default {
		textCont: Assets.Container(),
		utils: Utils,
		build: function () {
			
			this.token = Assets.Sprite("token.png");
			this.token.anchor.set(0.5);
			this.token.y = -100;
			
			this.earned = Assets.Sprite("earned.png");
			this.earned.anchor.set(0.5);
			this.textCont.addChild(this.earned);
			this.textCont.addChild(this.token);
			this.textCont.x = this.utils.canvasWidth / 2;
			this.textCont.y = this.utils.canvasHeight / 2;
		},
		playEarnedTokenAnimation: function () {
			this.utils.app.stage.addChild(this.textCont);
			Tweens.tween(this.textCont, 2, {alpha: [1,0]}, this.removeText.bind(this))
		},
		// clearText: function () {
		// 	this.utils.app.stage.removeChild(this.textCont);
		// },
		removeText: function () {
			this.utils.app.stage.removeChild(this.textCont);
		}
	
}