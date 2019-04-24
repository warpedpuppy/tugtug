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
	dragonPoints: 0,
	fishPoints: 0,
	spacePoints: 0,
	bouncePoints: 0,
	bounceTokenEarned: false,
	init: function (optionalStartScore) {

		this.createTotals();
		//this.cont = this.utils.app.stage;

		if(optionalStartScore)this.startScore = optionalStartScore;

		this.scoreTexts = this.stringCreate();
		
		this.cont.addChild(this.scoreTexts[`${this.utils.root.activeMode}Text`])
		
		this.seeScores = this.seeScores.bind(this);
		this.button = Assets.Sprite('arrow.png');
		this.button.anchor.set(0.5);
		this.button.buttonMode = this.button.interactive = true;
		this.button.x = this.cont.width + 20;
		this.button.y = 20;
		this.cont.addChild(this.button);
		this.button.on('pointerdown',this.seeScores);
	
		this.utils.app.stage.addChild(this.cont);
		this.cont.x = (this.utils.canvasWidth - this.cont.width) / 2;
		
		//this.makeScore(this.startScore);

		//this.cont.addChild(this.scoreText);
		this.popUp = Assets.Container();
		this.background = Assets.Graphics();
		this.background.beginFill(0x000000).drawRect(0,0,500,500).endFill();
		this.popUp.addChild(this.background);
		this.closeButton = Assets.Sprite('arrow.png');
		this.closeButton.anchor.set(0.5);
		this.closeButton.buttonMode = this.closeButton.interactive = true;
		this.popUp.addChild(this.closeButton);
		this.closeButton.on('pointerdown',this.seeScores);
	},
	seeScores: function () {

		if (this.utils.root.action) {
			this.utils.root.action = false;
			let spacer = 0;
			for (let key in this.scoreTexts) {
				this.scoreTexts[key].y = spacer * 20
				this.popUp.addChild(this.scoreTexts[key]);
				spacer ++;
			}
			this.utils.app.stage.addChild(this.popUp);
			this.cont.visible = false;
			this.popUp.pivot = Assets.Point(250, 250);
			this.popUp.x = this.utils.canvasWidth / 2;
			this.popUp.y = this.utils.canvasHeight / 2;
		} else {
			this.utils.root.action = true;
			this.utils.app.stage.removeChild(this.popUp);
			for (let key in this.scoreTexts) {
				this.popUp.removeChild(this.scoreTexts[key]);
			}
			this.cont.visible = true;
			this.cont.addChild(this.scoreTexts[`${this.utils.root.activeMode}Text`])
		}
		
	},
	switchMode: function () {
		this.cont.removeChildren();
		let newText = this.scoreTexts[`${this.utils.root.activeMode}Text`];
		newText.x = newText.y = 0;
		this.cont.addChild(newText);
		this.button.x = this.cont.width + 20;
		this.button.y = 20;
		this.cont.addChild(this.button);
	},
	createTotals: function () {

		// dragon
		this.dragonTotal = Config.treasureChestQ * Config.treasureChestScoreIncrease;
		// fish
		this.fishTotal = Config.treasureChestQ * Config.treasureChestScoreIncrease;
		// space
		this.spaceTotal = Config.spaceColQ * Config.spaceRowQ * Config.spaceDotsPerPlanet;
		// bounce
		this.bounceTotal = Config.bounceTotalPoints;
	},
	stringCreate: function (dragon, fish, space, bounce) {
		return {
				flyText:  Assets.BitmapText(`dragon points: ${this.dragonPoints} / ${this.dragonTotal}`),
				swimText:  Assets.BitmapText(`fish points: ${this.fishPoints}/ ${this.fishTotal}`), 
				jumpText:  Assets.BitmapText(`space points: ${this.spacePoints} / ${this.spaceTotal}`),
				bounceText:  Assets.BitmapText(`bounce points: ${this.bouncePoints} / ${this.bounceTotal}`)
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
	bounceRingHit: function () {
		this.bouncePoints ++;
		this.scoreTexts.bounceText.text =  `bounce points: ${this.bouncePoints} / ${this.bounceTotal}`;

		if (!this.bounceTokenEarned && this.bouncePoints >= this.bounceTotal) {
			this.bounceTokenEarned = true;
			this.utils.root.bounce.tokenEarn();
		}
	},
	bounceSpikeHit: function (q) {
		//alert('subtract' + q)
		if(this.bouncePoints > q){
			this.bouncePoints -= q;
		this.scoreTexts.bounceText.text = `bounce points: ${this.bouncePoints} / ${this.bounceTotal}`;
		}
		
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


