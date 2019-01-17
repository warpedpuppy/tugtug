import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
export default {
	init: function () {
		console.log(this.loader.resources.testing)
			let bitmapText = new PIXI.extras.BitmapText(`score: ${this.score}`, {font: "38px Hobo Std"});
			this.stage.addChild(bitmapText)
	},
	returnString: function (str) {

	}
}


