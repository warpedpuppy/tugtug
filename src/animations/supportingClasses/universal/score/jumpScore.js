import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Tweens from '../../../utils/Tweens';
import Config from '../../../animationsConfig';

export default function () {
	return {
	utils: Utils,
	jumpDotHit: function (str) {

		let activeMode = this.utils.root.activeMode,
			jumpBackground = this.utils.root.jump.jumpBackground,
			dotsEaten = this.utils.root.jump.jumpBackground.eatenDots.length,
			score = this.utils.root.score;
	
		score[`${activeMode}Points`] = dotsEaten;

		score.scoreTexts[`${activeMode}Text`].text = `space points: ${score[`${activeMode}Points`]} / ${score[`${activeMode}Total`]}`;
		//console.log(jumpBackground.jumpTokenUnlocked, 
			//score[`${activeMode}Points`], score.jumpTokenUnlockPoints);
		if (
			!jumpBackground.jumpTokenUnlocked && 
			score[`${activeMode}Points`] >= score.jumpTokenUnlockPoints
			) {
			jumpBackground.jumpTokenUnlocked = true;
			jumpBackground.jumpTokenUnlockedGraphic.addToStage();
			Tweens.tween(jumpBackground.tokenLock, 0.5, {alpha: [1,0], onComplete: this.jumpRemoveLock.bind(this)});
		}
	},
	jumpRemoveLock: function () {
		let jumpBackground = this.utils.jump.jumpBackground;
		jumpBackground.tokenLock.removeChild(jumpBackground.tokenLock);
	}
}
}