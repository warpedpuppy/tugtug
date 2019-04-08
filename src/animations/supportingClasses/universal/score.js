import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
export default function () {
	return {
	startScore: 0,
	score: 0,
	scoreText: undefined,
	changeAllow: false,
	targetNumber: undefined,
	counter: 0,
	utils: Utils,
	init: function (optionalStartScore) {

		this.cont = this.utils.app.stage;

		if(optionalStartScore)this.startScore = optionalStartScore;
		this.scoreText = Assets.BitmapText(`score: 0`);
		this.makeScore(this.startScore);
		//this.cont.addChild(this.scoreText);
	},
	makeScore: function (score) {
		this.cont.removeChild(this.scoreText)
		score = this.utils.numberWithCommas(score);
		this.scoreText.text = `score: ${score}`;
		this.scoreText.x = (this.utils.canvasWidth - this.scoreText.width) / 2;
		this.cont.addChild(this.scoreText);
	},
	increase: function (num) {
		if (!this.changeAllow) {
	       this.targetNumber = num + this.score;
		   this.changeAllow = true;
		}
	},
	decrease: function (num) {
		if (!this.changeAllow) {
	       this.targetNumber =  this.score - num;
		   this.changeAllow = true;
		}
	},
	resize: function (wh) {

		this.scoreText.x = (this.utils.canvasWidth - this.scoreText.width) / 2;
	},
	animate: function () {

		if(this.changeAllow){

			this.counter ++;
			if (!(this.counter % 2)) {
				//console.log('new score = ', this.targetNumber)
				if(this.score < this.targetNumber) {
					this.score ++;
					this.makeScore(this.score);

				} else if(this.score > this.targetNumber){
					this.score --;
					this.makeScore(this.score);
				} else {

					this.changeAllow = false;
					this.counter = 0;
				}
			}
			




		}
	}
}
}


