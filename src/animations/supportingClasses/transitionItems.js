import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
import TransitionAnimation from './transitionAnimation';
export default {
	textures: [],
	currentItem: undefined,
	wh: undefined,
	speed: 5,
	textureCounter: 1,
	hit: false,
	utils: Utils,
	transitionAnimation: TransitionAnimation,
	itemQ: 0,
	items: [],
	edgeBuffer: 200,
	init: function (arr, cont, wh, spritesheet, hero, app, switchPlayer) {
		this.itemQ = app.renderer instanceof PIXI.WebGLRenderer ? 10 : 5;
		this.switchPlayer = switchPlayer;
		this.app = app;
		this.itemStrings = arr;
		this.wh = wh;
		this.cont = cont;
		this.spritesheet = spritesheet;
		this.hero = hero;
		this.transitionAnimation = this.transitionAnimation.init(
			this.app, 
			this.wh, 
			this.spritesheet
			);
		this.transitionAnimation.addAnimations(this.cont, this.hero);
		this.bottomEdge = wh.canvasHeight + this.edgeBuffer;
		this.rightEdge = wh.canvasWidth + this.edgeBuffer;
		return this;
	},
	changeItem: function () {
		this.textureCounter ++;
		if (this.textureCounter >= this.textures.length) {
			this.textureCounter = 0;
		}
		this.currentItem.name = this.itemStrings[this.textureCounter];
		this.currentItem.texture = this.textures[this.textureCounter];
	},
	build: function () {
		for (let item of this.itemStrings) {
			let s = this.spritesheet.textures[`${item}Trans.png`];
			this.textures.push(s);
		}

		for (let i = 0; i < this.itemQ; i ++) {
			let c = new PIXI.Sprite(this.textures[this.textureCounter]);
			c.name = this.itemStrings[this.textureCounter];
			c.anchor.set(0.5);
			c.x = this.utils.randomNumberBetween(0, this.wh.canvasWidth);
			c.y = this.utils.randomNumberBetween(0, this.wh.canvasHeight);
			c.vx = this.utils.randomNumberBetween(1,5); 
        	c.vy = this.utils.randomNumberBetween(1,5);
			this.cont.addChild(c);
			this.items.push(c);
			this.textureCounter ++;
			if (this.textureCounter >= this.textures.length) {
				this.textureCounter = 0;
			}
		}
		
	},
	returnItem: function () {
		return {
			x: this.currentItem.x, 
			y: this.currentItem.y, 
			height: this.currentItem.height, 
			width: this.currentItem.width
		}
	},
	animate: function (vx, vy) {
		for (let i = 0; i < this.itemQ; i ++) {
			let c = this.items[i];
			c.x += vx;
			c.y += vy;

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

		// this.currentItem.y += this.speed;

		// if (this.currentItem.y > this.wh.canvasHeight) {
		// 	this.currentItem.y = 0;
		// }
		// if (this.utils.circleRectangleCollisionRegPointCenter(this.hero, this.returnItem())) {
		// 	this.hit = true;
		// } 


	},
	animateSpecial: function () {
		this.transitionAnimation.animate();
		if (this.transitionAnimation.done) {
			this.transitionAnimation.reset();
			this.currentItem.y = 0;
			this.switchPlayer(this.currentItem.name);
			this.changeItem();
			this.hit = false;
		}
	}
}