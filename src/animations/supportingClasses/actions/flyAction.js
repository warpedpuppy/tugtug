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
		increment: 5,
		colors: [0xFF0000, 0xFFFF00, 0xFF9900],
		colorCounter:0,
		flameArray: [],
		shootingFlames: [],
		flameCounter: 0,
		flameOn:false,
		init: function (hero, mode, wh, app, spritesheet) {
			this.hero = hero;
			this.mode = mode;
			this.wh = wh;
			this.stage = app.stage;
			this.vx = this.utils.randomNumberBetween(1,2); 
            this.vy = this.utils.randomNumberBetween(1,2);

            this.flameQ = app.renderer instanceof PIXI.WebGLRenderer ? 500 : 10;
            this.flames = new PIXI.particles.ParticleContainer(this.flameQ, {
			    scale: true,
			    position: true,
			    rotation: true,
			    uvs: true,
			    alpha: true
			});
			let item;
			for (let i = 0; i < this.flameQ; i ++) {
				item = new PIXI.Sprite(spritesheet.textures['star.png']);
				item.scale.set(0.15);
				item.anchor.set(0.5);
				item.angle = this.utils.deg2rad(this.utils.randomNumberBetween(-110, -70));
				item.fade = this.utils.randomNumberBetween(0.001, 0.01);
				item.maxDistance = this.utils.randomNumberBetween(100, 1000);
				item.vx = Math.cos(item.angle) * 10;
	        	item.vy = Math.sin(item.angle) * 10;
				
				item.tint = this.colors[this.colorCounter];
				this.colorCounter ++;
				if (this.colorCounter > this.colors.length - 1) {
					this.colorCounter = 0;
				}
				this.flames.addChild(item);
				this.flameArray.push(item);

			}
			this.flames.x = wh.canvasWidth / 2;
			this.flames.y = wh.canvasHeight / 2;
			app.stage.addChild(this.flames);
				

			


		},
		resize: function (wh) {
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
		},
		switchMode: function(mode) {
			this.mode = mode;
			this.maxLength = this.increment * this.hero.activeHero.segmentsQ;
		},
		rotate: function (obj) {
				this.vx = -obj.vx;
				this.vy = -obj.vy
		},
		fire: function (boolean) {
			this.flameOn = boolean;
		},
		animate: function () {

			if (!this.spinning) {
				this.radius = this.utils.cosWave(this.storeRadius, 0.15, 0.01);
			}
			this.hero.activeHero.eyeCont.rotation = this.radius;
			this.hero.activeHero.segments[0].rotation = this.radius;
	        this.hero.pos.push(this.radius);

	        if (this.hero.pos.length > this.maxLength) {
	            this.hero.pos = this.hero.pos.slice(-this.maxLength);
	        }

	        for (let i = 1; i <= this.hero.activeHero.segmentsQ; i++) {
	            let index = this.hero.pos.length - (i * this.increment);
	            if (this.hero.pos.length >= index) {
	                this.hero.activeHero.segments[i].rotation = this.hero.pos[index];
	            }
	        }
	        if (this.flameOn){
	        	 for(let i = 0; i < this.flameArray.length; i ++) {
	        	let item = this.flameArray[i];
	        	item.x += item.vx;
	        	item.y += item.vy;
	        	item.alpha -= item.fade;
	        	if(Math.abs(item.y) > item.maxDistance){
	        		item.x = item.y = 0;
	        		item.alpha = 1;
	        	}

	        }
	        }
	       


        	this.hero.activeHero.wingCont.rotation = this.storeRadius;
        	this.hero.activeHero.leftWing.rotation = this.utils.deg2rad(this.utils.cosWave(0, 20, 0.004));
        	this.hero.activeHero.leftWing2.rotation = this.utils.deg2rad(this.utils.cosWave(0, 20, 0.004));

        	this.hero.activeHero.rightWing.rotation = this.utils.deg2rad(this.utils.cosWave(0, -20, 0.004));
        	this.hero.activeHero.rightWing2.rotation = this.utils.deg2rad(this.utils.cosWave(0, -20, 0.004));
	        

		}
	}
}