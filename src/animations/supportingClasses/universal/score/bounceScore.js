import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Tweens from '../../../utils/tweens';
import Config from '../../../animationsConfig';
export default {
	bounceTokenUnlocked: false,
	bounceRingHit: function () {

		let score = Utils.root.score;
		score.bouncePoints ++;
		score.scoreTexts.bounceText.text =  `bounce points: ${score.bouncePoints} / ${score.bounceTotal}`;

		// if (!score.bounceTokenEarned && score.bouncePoints >= score.bounceTotal) {
		// 	score.bounceTokenEarned = true;
		// 	this.utils.root.bounce.tokenEarn();
		// }

		if (!this.bounceTokenUnlocked && score.bouncePoints >= score.bounceTotal) {
			this.bounceTokenUnlocked = true;
			Utils.root.bounce.tokenUnlock();
		}


	},
	bounceSpikeHit: function (q) {
			
			let score = Utils.root.score,
			    store = score.bouncePoints;
			    
			q = (q > score.bouncePoints)? score.bouncePoints: q;
			score.bouncePoints -= q;
			score.scoreTexts.bounceText.text = `bounce points: ${score.bouncePoints} / ${score.bounceTotal}`;
		
		
	}
}


