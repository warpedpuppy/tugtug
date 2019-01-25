import Utils from '../../utils/utils';
import * as PIXI from 'pixi.js';
import AirBubbles from '../swim/airBubbles';
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
		percApply: true,
		airBubbles: AirBubbles(),
		init: function (hero, mode, wh, stage) {
			this.hero = hero;
			this.mode = mode;
			this.wh = wh;
			this.stage = stage;
			this.vx = this.utils.randomNumberBetween(1,2); 
            this.vy = this.utils.randomNumberBetween(1,2);
            this.airBubbles.setupBubbles(wh, this.hero.activeHero, stage);
		},
		resize: function (wh) {
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
		},
		switchMode: function(mode) {
			// this.airBubbleCounter = 0;
			// this.airBubbleStart = this.utils.randomIntBetween(10,20);
			this.mode = mode;
		},
		rotate: function (obj) {
				this.vx = -obj.vx;
				this.vy = -obj.vy;
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

	        this.hero.activeHero.segments[0].rotation = this.radius;
	        this.hero.activeHero.finCont.rotation = this.radius;
	        this.hero.activeHero.eyeCont.rotation = this.radius;
	        this.airBubbles.bubblesCont.rotation = this.storeRadius; // this is why airbubbles needs to be in here


	        for (let i = 1; i < this.hero.segmentsQ; i++) {
	            let index = this.hero.pos.length - (i * this.increment);
	            if (this.hero.pos.length >= index) {
	              this.hero.activeHero.segments[i].rotation = this.hero.pos[index];
	            }
	        }
	        if (this.mode === 'swim') {
	        	this.airBubbles.animate();
	        	this.hero.activeHero.leftFin.rotation = this.utils.deg2rad(this.utils.cosWave(0, 20, 0.004));
	        	this.hero.activeHero.rightFin.rotation = this.utils.deg2rad(this.utils.cosWave(0, -20, 0.004));
	        	this.hero.activeHero.tail.rotation = this.utils.deg2rad(this.utils.cosWave(0, 60, 0.01));


	        } else if(this.mode === 'fly'){
	        	this.hero.wingCont.rotation = this.storeRadius;
	        	this.hero.leftWing.rotation = this.utils.deg2rad(this.utils.cosWave(0, 20, 0.004));
	        	this.hero.rightWing.rotation = this.utils.deg2rad(this.utils.cosWave(0, -20, 0.004));
	        }

		}
	}
}