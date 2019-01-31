import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
export default function () {
	return {
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
	bounce: 0.8,
	animationLimit: 120,
	vys: [-10, -1],
	vxs: [-8, 8],
	fallSpeeds: [2, 4],
	edgeBuffer: 200,
	init: function (app, wh, spritesheet, hero, parent) {
		this.parent = parent;
		this.wh = wh;
		this.hero = hero;
		this.ringQ = app.renderer instanceof PIXI.WebGLRenderer ? 500 : 10;
		this.chestQ = app.renderer instanceof PIXI.WebGLRenderer ? 0 : 1;
		this.radialQ = this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 1000 : 10;
		this.halfWidth = this.wh.canvasWidth / 2;
		this.halfHeight = this.wh.canvasHeight / 2;

		var ringsPC = new PIXI.particles.ParticleContainer(500, {
			    scale: true,
			    position: true,
			    rotation: true,
			    uvs: true,
			    alpha: true
			});
			this.ringCont.addChild(ringsPC);

		for (let i = 0; i < this.ringQ; i ++) {
			let r = new PIXI.Sprite(spritesheet.textures['treasureRing.png']);
			r.scale.set(this.utils.randomNumberBetween(0.1, 0.5));
			r.vy = this.utils.randomNumberBetween(this.vys[0], this.vys[1]);
			r.vx = this.utils.randomNumberBetween(this.vxs[0], this.vxs[1]);
			r.rotate = this.utils.randomNumberBetween(-4, 4);
			r.floor = this.halfHeight - r.height;
			//THESE RINGS NEED TO BE ADDED TO A PARTICLE CONTAINER
			ringsPC.addChild(r);
			this.rings.push(r);

			if (!(i >= this.chestQ)) {
				let c = new PIXI.Sprite(spritesheet.textures['treasureChest.png']);
				c.scale.set(this.utils.randomNumberBetween(0.05, 0.15));
				c.anchor.set(0.5);
				c.fallSpeed = this.utils.randomNumberBetween(this.fallSpeeds[0], this.fallSpeeds[1]);
				c.x = this.utils.randomNumberBetween(0, this.wh.canvasWidth);
				c.y = this.utils.randomNumberBetween(0, this.wh.canvasHeight);
				c.vx = this.utils.randomNumberBetween(1,5); 
            	c.vy = this.utils.randomNumberBetween(1,5);
            	c.variance = this.utils.randomNumberBetween(5, 20);
            	c.rotateSpeed = this.utils.randomNumberBetween(0.01, 0.025);
				this.parent.addChild(c);
				this.chests.push(c);
			}
			this.bottomEdge = wh.canvasHeight + this.edgeBuffer;
			this.rightEdge = wh.canvasWidth + this.edgeBuffer;
		}
		this.radialCont.scale.set(0);
		for(let i = 0; i < this.radialQ; i ++){
			let r = new PIXI.Sprite(spritesheet.textures['line.png']);
			r.width = 1;
			r.height = this.utils.randomNumberBetween(100, 500);
			//r.alpha = this.utils.randomNumberBetween(0.2, 0.8);
			r.anchor.x = 0;
			r.anchor.y = 0;
			r.storeHeight = r.height;
			r.variance = this.utils.randomNumberBetween(20, 50);
			r.rotation = this.utils.deg2rad(i*(360 / this.radialQ));
			r.speed = this.utils.randomNumberBetween(.0003, .003);
			r.tint = this.utils.randomColor();
			this.radials.push(r);
			this.radialCont.addChild(r);
		}

	},
	resize: function (wh) {
		this.wh = wh;
		this.bottomEdge = this.wh.canvasHeight + this.edgeBuffer;
		this.rightEdge = this.wh.canvasWidth + this.edgeBuffer;
		for (let i = 0; i < this.chestQ; i ++ ) {
			let c = this.chests[i];
        	c.x = this.utils.randomNumberBetween(0, wh.canvasWidth);
        	c.y = this.utils.randomNumberBetween(0, wh.canvasHeight);
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

		this.parent.addChildAt(this.radialCont, this.activeChest._zIndex - 1)

		//explode coins
		this.ringCont.x = this.wh.canvasWidth / 2;
		this.ringCont.y = this.wh.canvasHeight / 2;
		this.parent.addChild(this.ringCont);
	},
	animateSpecial: function () {
		for (let i = 0; i < this.ringQ; i ++) {
			let r = this.rings[i];
			r.vy += this.gravity;
			r.y += r.vy;
			r.x += r.vx;
			r.rotation += this.utils.deg2rad(r.rotate)

			if (r.y >= r.floor) {
				r.vy *= -this.bounce;
			} 

			if(r.x < -this.halfWidth || r.x > this.halfWidth) {
				r.vx *= -this.bounce;
			}
		}
		this.counter ++;
		if(this.counter === this.animationLimit) {
			this.reset();
		}


		if(this.radialCont.scale.x < 10){
			this.radialCont.scale.x += 0.1;
			this.radialCont.scale.y += 0.1;			
		}

		this.radialCont.rotation += this.utils.deg2rad(0.5);
        for (let i = 0; i < this.radialQ; i ++) {
            let r = this.radials[i];
            r.height = this.utils.cosWave(r.storeHeight, r.variance, r.speed);
        }
	},
	reset: function () {

		for (let i = 0; i < this.ringQ; i ++) {
			let r = this.rings[i];
			r.x = r.y = 0;
			r.vy = this.utils.randomNumberBetween(this.vys[0], this.vys[1]);
			r.vx = this.utils.randomNumberBetween(this.vxs[0], this.vxs[1]);
		}
		this.counter = 0;
		this.hit = false;
		this.parent.removeChild(this.ringCont);
		this.activeChest.scale.set(this.storeObject.scale);
		this.activeChest.x = this.storeObject.x;
		this.activeChest.y = this.storeObject.y;
		this.radialCont.scale.set(0);
		this.radialCont.parent.removeChild(this.radialCont);
	},
	animate: function (vx, vy) {
		for (let i = 0; i < this.chestQ; i ++) {
			let c = this.chests[i];
			c.x -= vx;
			c.y -= vy;
			c.rotation = this.utils.cosWave(this.utils.deg2rad(0), this.utils.deg2rad(c.variance), c.rotateSpeed);
			let tempRect = {x: c.x, y: c.y, width: c.width, height: c.height};
			// if(this.utils.circleRectangleCollisionRegPointCenter(this.hero, tempRect)){
			// 	this.hit = true;
			// 	this.activeChest = c;
			// 	this.playAnimation();
			// } 

			if(c.y > this.bottomEdge) {
            	c.y = this.utils.randomNumberBetween(-this.edgeBuffer, 0);
        	} else if(c.y < -this.edgeBuffer) {
        		c.y = this.utils.randomNumberBetween(this.wh.canvasHeight, this.bottomEdge);
        	}

        	if(c.x > this.rightEdge) {
        		c.x = this.utils.randomNumberBetween(-this.edgeBuffer, 0);
        	} else if(c.x < -this.edgeBuffer) {
        		c.x = this.utils.randomNumberBetween(this.wh.canvasWidth, this.rightEdge);
        	}

		}
	}
}

}