import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Tweens from '../../../utils/tweens';
import Config from '../../../animationsConfig';

export default {
	jumpDotHit: function (str) {

		let activeMode = this.utils.root.activeMode;
		let jumpBackground = this.utils.root.jump.jumpBackground;
		let dotsEaten = this.utils.root.jump.jumpBackground.eatenDots.length;
	
		this[`${activeMode}Points`] = dotsEaten;

		this.scoreTexts[`${activeMode}Text`].text = `space points: ${this[`${activeMode}Points`]} / ${this[`${activeMode}Total`]}`;

		if (!jumpBackground.jumpTokenUnlocked && this[`${activeMode}Points`] >= this.jumpTokenUnlockPoints) {
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