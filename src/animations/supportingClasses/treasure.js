import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
export default {
	ringQ: 0,
	chestQ: 0,
	rings: [],
	chests: [],
	utils: Utils,
	hit: false,
	activeChest: undefined,
	line: undefined,
	radialQ: undefined,
	radialCont: new PIXI.Container(),
	ringCont: new PIXI.Container(),
	radials: [],
	gravity: 0.3,
	counter: 0,
	animationLimit: 120,
	init: function (app, wh, spritesheet, hero) {
		this.stage = app.stage;
		this.wh = wh;
		this.hero = hero;
		this.ringQ = app.renderer instanceof PIXI.WebGLRenderer ? 500 : 10;
		this.chestQ = app.renderer instanceof PIXI.WebGLRenderer ? 1 : 1;
		this.radialQ = this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 100 : 10;
		this.halfWidth = this.wh.canvasWidth / 2;
		this.halfHeight = this.wh.canvasHeight / 2;
		for (let i = 0; i < this.ringQ; i ++) {
			let r = new PIXI.Sprite(spritesheet.textures['treasureRing.png']);
			r.scale.set(this.utils.randomNumberBetween(0.1, 0.5));
			r.vy = this.utils.randomNumberBetween(-20, -1);
			r.vx = this.utils.randomNumberBetween(-4, 4);
			r.floor = this.halfHeight - r.height;
			this.ringCont.addChild(r);
			this.rings.push(r);

			if (!(i >= this.chestQ)) {
				let c = new PIXI.Sprite(spritesheet.textures['treasureChest.png']);
				c.scale.set(this.utils.randomNumberBetween(0.1, 0.5));
				c.anchor.set(0.5);
				c.x = wh.canvasWidth / 2;
				this.stage.addChild(c);
				this.chests.push(c);
			}

		}

		for(let i = 0; i < this.radialQ; i ++){
			let r = new PIXI.Sprite(spritesheet.textures['line.png']);
			r.width = 1;
			r.height = this.utils.randomNumberBetween(100, 500);
			r.alpha = this.utils.randomNumberBetween(0.2, 0.8);
			r.anchor.x = 0;
			r.anchor.y = 0;
			r.storeHeight = r.height;
			r.variance = this.utils.randomNumberBetween(20, 50);
			r.rotation = this.utils.deg2rad(i*(360 / this.radialQ));
			r.speed = this.utils.randomNumberBetween(.0003, .003);
			r.tint = 0xFFFF00;
			this.radials.push(r);
			this.radialCont.addChild(r);
		}

	},
	playAnimation: function () {
		//place chest in center and rock it back and forth;
		this.storeObject = {
			scale: this.activeChest.scale.x,
			x: this.activeChest.x,
			y: 0
		}
		this.activeChest.scale.set(1);
		this.activeChest.x = this.radialCont.x = this.wh.canvasWidth / 2;
		this.activeChest.y = this.radialCont.y = this.wh.canvasHeight / 2;

		this.stage.addChildAt(this.radialCont, this.activeChest._zIndex - 1)

		//explode coins
		this.ringCont.x = this.wh.canvasWidth / 2;
		this.ringCont.y = this.wh.canvasHeight / 2;
		this.stage.addChild(this.ringCont);
	},
	animateSpecial: function () {
		for (let i = 0; i < this.ringQ; i ++) {
			let r = this.rings[i];
			r.vy += this.gravity;
			r.y += r.vy;
			r.x += r.vx;

			if (r.y >= r.floor) {
				r.vy *= -1;
			} 

			if(r.x < -this.halfWidth || r.x > this.halfWidth) {
				r.vx *= -1;
			}
		}
		this.counter ++;
		if(this.counter === this.animationLimit) {
			this.reset();
		}
	},
	reset: function () {

		for (let i = 0; i < this.ringQ; i ++) {
			let r = this.rings[i];
			r.vy = this.utils.randomNumberBetween(-20, -1);
			r.vx = this.utils.randomNumberBetween(-4, 4);
		}
		this.counter = 0;
		this.hit = false;
		this.stage.removeChild(this.ringCont);
		this.activeChest.scale.set(this.storeObject.scale);
		this.activeChest.x = this.storeObject.x;
		this.activeChest.y = this.storeObject.y;
	},
	animate: function () {
		for (let i = 0; i < this.chestQ; i ++) {
			let c = this.chests[i];
			c.y += 4;

			let tempRect = {x: c.x, y: c.y, width: c.width, height: c.height};
			if(this.utils.circleRectangleCollisionRegPointCenter(this.hero, tempRect)){
				this.hit = true;
				this.activeChest = c;
				this.playAnimation();
			} 

		}
	}

}