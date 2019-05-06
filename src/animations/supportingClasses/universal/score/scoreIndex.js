import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Tweens from '../../../utils/tweens';
import Config from '../../../animationsConfig';
import BounceScore from './bounceScore';
import JumpScore from './jumpScore';
import GridScore from './gridScore';
import ScoreGraphics from './scoreGraphics';
export default function () {
	return {
		scoreTexts: {},
		utils: Utils,
		flyTotal: 0,
		swimTotal: 0,
		jumpTotal: 0,
		bounceTotal: 0,
		flyPoints: 0,
		swimPoints: 0,
		jumpPoints: 0,
		bouncePoints: 0,
		grandTotal: 0,
		storeTotal: 0,
		bounceTokenEarned: false,
		jumpTokenEarned: false,
		gridScore: GridScore, 
		jumpScore: JumpScore,
		bounceScore: BounceScore,
		init: function () {
			this.flyTreasureChestQ = Config.flyTreasureChestQ;
			this.flyCoinsPerTreasureChest = Config.flyCoinsPerTreasureChest;
			this.swimTreasureChestQ = Config.swimTreasureChestQ;
			this.swimCoinsPerTreasureChest = Config.swimCoinsPerTreasureChest;
			this.jumpTokenUnlockPoints = Config.jumpTokenUnlockPoints;
			this.createTotals();
			
			this.scoreTexts = this.stringCreate();
			this.topBanner = ScoreGraphics.returnTopBar();
			this.popUp = ScoreGraphics.returnMainBar();
		},
		hide: function () {
			ScoreGraphics.hide();
		},
		show: function () {
			ScoreGraphics.show();
		},
		createTotals: function () {
			// dragon
			this.flyTotal = Config.flyTreasureChestQ * Config.flyCoinsPerTreasureChest;
			// fish
			this.swimTotal = Config.swimTreasureChestQ * Config.swimCoinsPerTreasureChest;
			// space
			this.jumpTotal = Config.spaceColQ * Config.spaceRowQ * Config.spaceDotsPerPlanet;
			// bounce
			this.bounceTotal = Config.bounceTotalPoints;
		},
		nextLevel: function () {
			//console.log('assign ', this.grandTotal, 'to', this.storeTotal)
			this.storeTotal += this.grandTotal;
			this.flyPoints = 0;
			this.swimPoints = 0;
			this.jumpPoints = 0;
			this.bouncePoints = 0;

			this.scoreTexts.flyText.text = `dragon points: ${this.flyPoints} / ${this.flyTotal}`;
			this.scoreTexts.swimText.text = `fish points: ${this.swimPoints} / ${this.swimTotal}`; 
			this.scoreTexts.jumpText.text = `space points: ${this.jumpPoints} / ${this.jumpTotal}`;
			this.scoreTexts.bounceText.text=`bounce points: ${this.bouncePoints} / ${this.bounceTotal}`;
			this.scoreTexts.grandTotal.text= `grand total: ${this.grandTotal}`;
		},
		switchMode: function () {
			ScoreGraphics.buildTopBanner();
		},
		stringCreate: function (dragon, fish, space, bounce) {
			this.grandTotal = this.flyPoints + this.swimPoints + this.jumpPoints + this.bouncePoints;
			return {
					flyText:  Assets.BitmapText(`dragon points: ${this.flyPoints} / ${this.flyTotal}`),
					swimText:  Assets.BitmapText(`fish points: ${this.swimPoints}/ ${this.swimTotal}`), 
					jumpText:  Assets.BitmapText(`space points: ${this.jumpPoints} / ${this.jumpTotal}`),
					bounceText:  Assets.BitmapText(`bounce points: ${this.bouncePoints} / ${this.bounceTotal}`),
					grandTotal: Assets.BitmapText(`grand total: ${this.grandTotal}`)
				};
		},
		setGrandTotal: function () {
			this.grandTotal = this.storeTotal + this.flyPoints + this.swimPoints + this.jumpPoints + this.bouncePoints;
			this.scoreTexts.grandTotal.text = `grand total: ${this.grandTotal}`;
		},
		resize: function (wh) {

			this.topBanner.x = (this.utils.canvasWidth - this.topBanner.width) /2;
			this.popUp.x = this.utils.canvasWidth / 2;
			this.popUp.y = this.utils.canvasHeight / 2;
		}
	}
}


