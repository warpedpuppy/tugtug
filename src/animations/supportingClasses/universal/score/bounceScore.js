import Utils from '../../../utils/utils';
export default function () {
	return {
	bounceTokenUnlocked: false,
	bounceRingHit: function () {

		let score = Utils.root.score;
		score.bouncePoints ++;
		score.scoreTexts.bounceText.text =  `bounce points: ${score.bouncePoints} / ${score.bounceTotal}`;


		if (!this.bounceTokenUnlocked && score.bouncePoints >= score.bounceTotal) {
			this.bounceTokenUnlocked = true;
			Utils.root.bounce.tokenUnlock();
		}


	},
	bounceSpikeHit: function (q) {
			
			let score = Utils.root.score;
			    
			q = (q > score.bouncePoints)? score.bouncePoints: q;
			score.bouncePoints -= q;
			score.scoreTexts.bounceText.text = `bounce points: ${score.bouncePoints} / ${score.bounceTotal}`;
		
		
	}
}
}


