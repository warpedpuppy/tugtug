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
		init: function (hero, mode, wh, stage) {
			this.hero = hero;
			this.mode = mode;
			this.wh = wh;
			this.stage = stage;
			this.vx = this.utils.randomNumberBetween(1,2); 
            this.vy = this.utils.randomNumberBetween(1,2);
            this.setupBubbles();
		},
		resize: function (wh) {
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
		},
		switchMode: function(mode) {
			this.airBubbleCounter = 0;
			this.airBubbleStart = this.utils.randomIntBetween(10,20);
			this.mode = mode;
		},
		rotate: function (obj) {
				this.vx = -obj.vx;
				this.vy = -obj.vy;
		},
		setupBubbles: function () {
			let startTimes = [0,10, 20,30];
			this.bubblesCont = new PIXI.Container();
			this.bubblesCont.x = this.wh.canvasWidth / 2;
			this.bubblesCont.y = this.wh.canvasHeight / 2;
			for (let i = 0; i < this.hero.airBubbles.length; i ++) {
				let ab = this.hero.airBubbles[i];
				ab.y = -this.hero.fishRadius;
				ab.counter = 0;
				ab.startTime = startTimes[i];
				this.expand.push(ab);
				this.bubblesCont.addChild(ab);
			}
			this.stage.addChild(this.bubblesCont);
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
		resetAirBubbles: function () {
			for(let i = 0; i < this.expand.length; i ++){
				let ab = this.expand[i];
				ab.counter = 0;
				ab.scale.set(0);
				ab.alpha = 1;
			}
			this.airBubbleCounter = 0;
			this.airBubbleStart = this.utils.randomIntBetween(50,250);
			this.countAllow = true;
		},
		animate: function () {
			if(!this.spinning){
				this.radius = this.utils.cosWave(this.storeRadius, 0.15, 0.01);
			}
				

	        this.hero.pos.push(this.radius);
	        this.increment = 5;
	        let maxLength = this.increment * this.hero.segmentsQ;

	        if (this.hero.pos.length > maxLength) {
	            this.hero.pos = this.hero.pos.slice(-maxLength);
	        }

	        this.hero.segments[0].rotation = this.radius;
	        this.hero.finCont.rotation = this.radius;
	        this.hero.eyeCont.rotation = this.radius;
	        this.bubblesCont.rotation = this.storeRadius;


	        for (let i = 1; i < this.hero.segmentsQ; i++) {
	            let index = this.hero.pos.length - (i * this.increment);
	            if (this.hero.pos.length >= index) {
	              this.hero.segments[i].rotation = this.hero.pos[index];
	            }
	        }
	        if (this.mode === 'swim') {

	        	if (this.countAllow) {
	        		this.airBubbleCounter ++;
		        	if (this.airBubbleCounter === this.airBubbleStart) {
		        	
		        		this.countAllow = false;
		        	}
	        	} else {
	        		this.fishExhale();
	        	}
	        	this.hero.leftFin.rotation = this.utils.deg2rad(this.utils.cosWave(0, 20, 0.004));
	        	this.hero.rightFin.rotation = this.utils.deg2rad(this.utils.cosWave(0, -20, 0.004));
	        	this.hero.tail.rotation = this.utils.deg2rad(this.utils.cosWave(0, 60, 0.01));


	        } else if(this.mode === 'fly'){
	        	this.hero.wingCont.rotation = this.storeRadius;
	        	this.hero.leftWing.rotation = this.utils.deg2rad(this.utils.cosWave(0, 20, 0.004));
	        	this.hero.rightWing.rotation = this.utils.deg2rad(this.utils.cosWave(0, -20, 0.004));
	        }

		}
	}
}