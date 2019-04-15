import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
export default function () {
	return {
		utils: Utils,
		init: function () {
			this.text = Assets.BitmapText("bounce points: 0 / 10,000");
			this.text.x = this.utils.canvasWidth / 2;
			this.text.y = this.utils.canvasHeight  - this.text.height;
			this.text.anchor.set(0.5);

		},
		addToStage: function () {
			this.utils.app.stage.addChild(this.text);
		},
		removeFromStage: function () {
			this.utils.app.stage.removeChild(this.text);
		},
		resize: function () {
			this.text.x = this.utils.canvasWidth / 2;
			this.text.y = this.utils.canvasHeight  - this.text.height;
		},
		animate: function () {

		}
	}
}