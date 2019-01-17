import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
export default {
	startScore: 0,
	score: 0,
	scoreText: undefined,
	increaseAllow: false,
	targetNumber: undefined,
	counter: 0,
	init: function (cont, wh) {
		this.canvasWidth = wh.canvasWidth;
		this.canvasHeight = wh.canvasHeight;
		this.scoreText = new PIXI.extras.BitmapText(`score: ${this.startScore}`, {font: "38px Hobo Std"});
		this.scoreText.x = (this.canvasWidth - this.scoreText.width) / 2;
		cont.addChild(this.scoreText);
		this.cont = cont;
	},
	getScoreFromServer: function () {

	},
	increase: function (num) {
		if (!this.increaseAllow) {
	       this.targetNumber = num + this.score;
		   this.increaseAllow = true;
		}
	},
	resize: function (wh) {
		this.canvasWidth = wh.canvasWidth;
		this.canvasHeight = wh.canvasHeight;
		this.scoreText.x = (this.canvasWidth - this.scoreText.width) / 2;
	},
	animate: function () {

		if(this.increaseAllow){

			this.counter ++;
			if (!(this.counter % 2)) {
				//console.log('new score = ', this.targetNumber)
				if(this.score < this.targetNumber) {
					this.score ++;
					this.cont.removeChild(this.scoreText)
					this.scoreText = new PIXI.extras.BitmapText(`score: ${this.score}`, {font: "38px Hobo Std"});
					this.scoreText.x = (this.canvasWidth - this.scoreText.width) / 2;
					this.cont.addChild(this.scoreText);
				} else {
					this.increaseAllow = false;
					this.counter = 0;
				}
			}
			




		}
	}
}


