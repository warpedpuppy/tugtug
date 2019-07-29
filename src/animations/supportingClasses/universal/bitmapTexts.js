import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
export default function () {
	return {
	init: function () {
		let bitmapText = Assets.BitmapText(`score: ${this.score}`);
		this.stage.addChild(bitmapText)
	},
	returnString: function (str) {

	}
}
}


