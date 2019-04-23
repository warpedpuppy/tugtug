import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
export default function () {
	return {
	cont: Assets.Container(),
	startScore: 0,
	score: 0,
	scoreText: undefined,
	changeAllow: false,
	targetNumber: undefined,
	counter: 0,
	utils: Utils,
	dragonTotal: 0,
	fishTotal: 0,
	spaceTotal: 0,
	bounceTotal: 0,
	init: function (optionalStartScore) {

		this.createTotals();
		//this.cont = this.utils.app.stage;

		if(optionalStartScore)this.startScore = optionalStartScore;
		this.scoreTexts = this.stringCreate();
		let counter = 0;
		for(let key in this.scoreTexts){
			this.scoreTexts[key].y = counter * 25;
			this.cont.addChild(this.scoreTexts[key])
			counter ++;
		}
		this.utils.app.stage.addChild(this.cont)
		
		//this.makeScore(this.startScore);

		//this.cont.addChild(this.scoreText);
	},
	createTotals: function () {

		// dragon
		this.dragonTotal = Config.treasureChestQ * Config.treasureChestScoreIncrease;
		// fish
		this.fishTotal = Config.treasureChestQ * Config.treasureChestScoreIncrease;
		// space
		this.spaceTotal = Config.spaceColQ * Config.spaceRowQ * Config.spaceDotsPerPlanet;
		// bounce
		this.bounceTotal = Config.bouncePoints;
	},
	stringCreate: function (dragon, fish, space, bounce) {
		return {
				dragonText:  Assets.BitmapText(`dragon points: ${dragon} / ${this.dragonTotal}`),
				fishText:  Assets.BitmapText(`fish points: ${fish}/ ${this.fishTotal}`), 
				spaceText:  Assets.BitmapText(`space points: ${space} / ${this.spaceTotal}`),
				bounceText:  Assets.BitmapText(`bounce points: ${bounce} / ${this.bounceTotal}`)
			};
	},
	makeScore: function (score) {
		// this.cont.removeChild(this.scoreText)
		// score = this.utils.numberWithCommas(score);
		// this.scoreText.text = `score: ${score}`;
		// this.scoreText.x = (this.utils.canvasWidth - this.scoreText.width) / 2;
		// this.cont.addChild(this.scoreText);
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
			//if (!(this.counter % 2)) {
				//console.log('new score = ', this.targetNumber)
				if(this.score < this.targetNumber) {
					this.score ++;
					this.makeScore(this.score);

				} else if (this.score > this.targetNumber) {
					this.score --;
					this.makeScore(this.score);
				} else {

					this.changeAllow = false;
					this.counter = 0;
				}
			//}
			




		}
	}
}
}


