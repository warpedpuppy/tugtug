import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';

export default function () {
	return {
		cont: Assets.ParticleContainer(1000), 
		rings: [],
		expandingRings: [],
		ringQ: 10,
		utils: Utils, 
		counter: 0,
		ringCounter: 0,
		maxRingSize: 0,
		expand: true,
		absValueRate: 0.025,
		init: function () {
			for (let i = 0; i < this.ringQ; i ++) {
				let ring = Assets.Sprite('gear.png');
				ring.anchor.set(0.5);
				this.rings.push(ring);
				this.cont.addChild(ring);
			}
		},
		setMaxScaleHandler: function () {
			this.rings[0].width = this.rings[0].height = this.maxRingSize;
			return this.rings[0].scale.x;
		},
		addToStage: function (expand) {
			
			this.expand = expand;
			this.maxRingSize = Math.max(this.utils.canvasWidth, this.utils.canvasHeight) * 1.2;
			this.setMaxScale = this.setMaxScaleHandler();
			this.counter = 0;
			this.rings.forEach((ring, index) => {
				//ring.scale.set(0)
				ring.x = this.utils.canvasWidth / 2;
				ring.y = this.utils.canvasHeight / 2;
				ring.width = ring.height = index * 100;
			})
			if (!this.expand) {
				this.rate = -this.absValueRate;
			} else {
				this.rate = this.absValueRate;
			}
			let index = this.utils.app.stage.getChildIndex(this.utils.hero.cont) - 1;
			this.utils.app.stage.addChildAt(this.cont, index);
		},
		removeFromStage: function () {
	
			this.utils.app.stage.removeChild(this.cont);
		},
		resize: function () {

		},
		animate: function () {
			//console.log('rings length ', this.rings.length)
			this.rings.forEach((ring, index) => {
				ring.scale.x += this.rate;
			 	ring.scale.y += this.rate;
			 	if (ring.scale.x < 0){
			 		ring.scale.set(1)
			 	} 
			 	// if (!this.expand && ring.scale.x < 0) {
					// //ring.scale.set(this.setMaxScale);
					// ring.scale.set(0.5);
					// //ring.width = ring.height = this.maxRingSize;
			 	// } else if (this.expand && ring.scale.x > this.setMaxScale) {
			 	// 	ring.scale.set(0);
			 	// 	ring.width = ring.height = 0;
			 	// }
			})
		
		}
	}
	
}