import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Config from '../../../animationsConfig';
export default  {
		cont: Assets.Container, 
		rings: [],
		expandingRings: [],
		ringQ: 10,
		utils: Utils, 
		counter: 0,
		ringCounter: 0,
		maxRingSize: 0,
		expand: true,
		rate: 0.025,
		init: function () {
			let counter = 0;
			for (let i = 0; i < this.ringQ; i ++) {
				let ring = Assets.Sprite('whiteConcentricCircle.png');
				ring.tint = Config.colors[counter];
				//console.log(ring)
				ring.anchor.set(0.5);
				ring.scale.set(0);
				this.rings.push(ring);
				counter ++;
				if (counter > Config.colors.length){
					counter = 0;
				}
			}
		},
		setMaxScaleHandler: function () {
			this.rings[0].width = this.rings[0].height = this.maxRingSize;
			this.setMaxScale = this.rings[0].scale.x;
		},
		addToStage: function (expand) {
			this.expand = expand;
			this.maxRingSize = Math.max(this.utils.canvasWidth, this.utils.canvasHeight) * 1.2;
			this.setMaxScaleHandler();
			this.counter = 0;
			this.rings.forEach(ring => {
				ring.x = this.utils.canvasWidth / 2;
				ring.y = this.utils.canvasHeight / 2;
				this.utils.app.stage.addChild(ring);
			})
			if(!this.expand){
				this.rate *= -1;
			}
		},
		removeFromStage: function () {
			this.rings.forEach(ring => {
				this.utils.app.stage.removeChild(ring);
			})
		},
		resize: function () {

		},
		animate: function () {
			this.counter ++;
			if(this.counter % 10 === 0){
				let ring = this.rings[this.ringCounter];
				//console.log(ring)
				if (this.expand) {
					ring.scale.set(0);
				} else {
					ring.scale.set(this.setMaxScale);
					ring.width = ring.height = this.maxRingSize;
				}
				
				this.expandingRings.push(ring);
				this.ringCounter ++;
				if(this.ringCounter > this.rings.length - 1){
					this.ringCounter = 0;
				}
			}
			this.expandingRings.forEach((ring, index) => {
				ring.scale.x += this.rate;
				ring.scale.y += this.rate;
				if ((this.expand && ring.width > this.maxRingSize) || (!this.expand && ring.scale.x < 0)) {
				 	this.expandingRings.splice(index, 1)
				} 
			})
		}
	
}