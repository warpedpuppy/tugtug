import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
export default function () {
	return {
		utils: Utils,
		score: 0,
		init: function () {
			this.text = Assets.BitmapText(`bounce points: ${this.score} / 10,000`);
			this.text.x = this.utils.canvasWidth / 2;
			this.text.y = this.utils.canvasHeight  - this.text.height;
			this.text.anchor.set(0.5);

		},
		ringHit: function () {
			this.score ++;
			this.text.text = `bounce points: ${this.score} / 10,000`;
		},
		spikeHit: function () {
			this.score -= 10;
			this.text.text = `bounce points: ${this.score} / 10,000`;
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