import Utils from '../../utils/utils';
import * as PIXI from 'pixi.js';
export default function () {
	return {
		mode: undefined,
		radius: 0,
		storeRadius: 0,
		spinning: false,
		utils: Utils,
		vx: 0,
		vy: 0,
		airBubbleCounter: 0,
		airBubbleStart: 0,
		countAllow: true,
		expand: [],
		bubblesCont: new PIXI.Container(),
		times: [50, 100], 
		setupBubbles: function (cont) {
			this.wh = this.utils.wh;
			let hero = this.hero = this.utils.hero.heroSwim;
			let startTimes = [0,10, 20,30];
			this.bubblesCont.x = this.wh.canvasWidth / 2;
			this.bubblesCont.y = this.wh.canvasHeight / 2;
			for (let i = 0; i < hero.airBubbles.length; i ++) {
				let ab = this.hero.airBubbles[i];
				ab.y = -this.hero.fishRadius;
				ab.counter = 0;
				ab.startTime = startTimes[i];
				this.expand.push(ab);
				this.bubblesCont.addChild(ab);
			}
			this.airBubbleStart = this.utils.randomIntBetween(this.times[0],this.times[1]);
			cont.addChild(this.bubblesCont);
		},
		fishExhale: function () {
			for(let i = 0; i < this.expand.length; i ++){
				let ab = this.expand[i];
				if(ab.counter >= ab.startTime){
					ab.scale.x += 0.01;
					ab.scale.y += 0.01;
					if(ab.alpha > 0)ab.alpha -= 0.01;
				}
				ab.counter ++;
			}
			if(this.expand[this.expand.length - 1].alpha < 0){
				this.resetAirBubbles();
			}
		},
		resize: function () {
			this.bubblesCont.x = this.utils.canvasWidth / 2;
			this.bubblesCont.y = this.utils.canvasHeight / 2;
		},
		resetAirBubbles: function () {
			for(let i = 0; i < this.expand.length; i ++){
				let ab = this.expand[i];
				ab.counter = 0;
				ab.scale.set(0);
				ab.alpha = 1;
			}
			this.airBubbleCounter = 0;
			this.airBubbleStart = this.utils.randomIntBetween(this.times[0],this.times[1]);
			this.countAllow = true;
		},
		animate: function () {

	        	if (this.countAllow) {
	        		this.airBubbleCounter ++;
		        	if (this.airBubbleCounter === this.airBubbleStart) {
		        		this.countAllow = false;
		        	}
	        	} else {
	        		this.fishExhale();
	        	}

		}
	}
}