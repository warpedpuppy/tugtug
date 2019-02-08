import Assets from '../utils/assetCreation';
import Utils from '../utils/utils';
export default function () {
	return {
	startScore: 0,
	score: 0,
	scoreText: undefined,
	increaseAllow: false,
	targetNumber: undefined,
	counter: 0,
	utils: Utils,
	init: function (cont, wh, optionalStartScore) {
		this.canvasWidth = wh.canvasWidth;
		this.canvasHeight = wh.canvasHeight;
		this.cont = cont;

		if(optionalStartScore)this.startScore = optionalStartScore;
		this.makeScore(this.startScore);
		this.scoreText = Assets.BitmapText(`score: 0`);
	},
	makeScore: function (score) {
		score = this.utils.numberWithCommas(score);
		this.scoreText.text = `score: ${score}`;
		this.scoreText.x = (this.canvasWidth - this.scoreText.width) / 2;
		this.cont.addChild(this.scoreText);
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

					this.makeScore(this.score);

				} else {
					this.increaseAllow = false;
					this.counter = 0;
				}
			}
			




		}
	}
}
}


