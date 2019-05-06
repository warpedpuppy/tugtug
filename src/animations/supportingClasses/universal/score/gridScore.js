import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Tweens from '../../../utils/tweens';
import Config from '../../../animationsConfig';
export default {
	utils: Utils,
	treasureIncrease: function () {
		let activeMode = this.utils.root.activeMode,
			score = this.utils.root.score;
		score[`${activeMode}Points`] += Config[`${activeMode}CoinsPerTreasureChest`];
		//console.log(activeMode,this[`${activeMode}Points`],  Config[`${activeMode}CoinsPerTreasureChest`])
		score.scoreTexts[`${activeMode}Text`].text = `dragon points: ${score[`${activeMode}Points`]} / ${score[`${activeMode}Total`]}`;
	},
	treasureChange: function (str) {
		let activeMode = this.utils.root.activeMode,
			score = this.utils.root.score;
		
		if(str === 'down') {
			score[`${activeMode}Points`] --;
		} else if (str === 'up') {
			score[`${activeMode}Points`] ++;
		}
		//console.log(activeMode,this[`${activeMode}Points`],  Config[`${activeMode}CoinsPerTreasureChest`])
		score.scoreTexts[`${activeMode}Text`].text = `dragon points: ${score[`${activeMode}Points`]} / ${score[`${activeMode}Total`]}`;
	},
	gridWeaponHit: function () {
		if(this[`${this.utils.root.activeMode}Points`] <= 0)return;
		this.treasureChange('down');
		this.utils.root.grid.gridBuild.addCoinToGrid();
	}
}