import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
//import Config from './animationsConfig';
export default  {
	utils: Utils,
	init: function () {
		this.Sprite = Assets.Sprite("swipeScreen.png");
		this.Sprite.anchor.set(0.5);
		this.Sprite.x = this.utils.canvasWidth / 2;
		this.Sprite.y = this.utils.canvasHeight / 2;
		return this;
	},
	addToStage: function () {
		this.utils.app.stage.addChild(this.Sprite)
	},
	removeFromStage: function () {
		this.utils.app.stage.removeChild(this.Sprite)
	},
	resize: function () {
		this.Sprite.x = this.utils.canvasWidth / 2;
		this.Sprite.x = this.utils.canvasHeight / 2;
	},
	animate: function () {

	}
}
