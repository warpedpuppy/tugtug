import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import TransitionAnimation from '../../transitionAnimation';
export default function () {
	return {
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
	init: function (arr, cont, switchPlayer) {
		this.itemQ = Assets.webgl ? 50 : 1;
		this.switchPlayer = switchPlayer;
		this.app = this.utils.app;
		this.itemStrings = arr;
		this.wh = this.utils.wh;
		this.cont = cont;
		this.spritesheet = this.utils.spritesheet;
		this.hero = this.utils.hero;
		//this.transitionAnimation = this.transitionAnimation.init();
		//this.transitionAnimation.start(this.cont);
		this.bottomEdge = this.utils.wh.canvasHeight + this.edgeBuffer;
		this.rightEdge = this.utils.wh.canvasWidth + this.edgeBuffer;
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
			let s = `${item}Trans.png`;
			this.textures.push(s);
		}

		this.vx = this.utils.randomNumberBetween(1,5); 
        this.vy = this.utils.randomNumberBetween(1,5);

		for (let i = 0; i < this.itemQ; i ++) {
			let c = Assets.Sprite(this.textures[this.textureCounter]);
			c.name = this.itemStrings[this.textureCounter];
			//c.scale.set(this.utils.randomNumberBetween(0.1, 0.5));
			c.anchor.set(0.5);
			c.hit = false;
			// c.x = this.utils.randomNumberBetween(0, this.wh.canvasWidth);
			// c.y = this.utils.randomNumberBetween(0, this.wh.canvasHeight);
			this.items.push(c);
			this.textureCounter ++;
			if (this.textureCounter >= this.textures.length) {
				this.textureCounter = 0;
			}
		}
		return this.items;
		
	},
	rotate: function (obj) {
			this.vx = -obj.vx;
			this.vy = -obj.vy;
	},
	returnItem: function (currentItem) {
		return {
			x: currentItem.x, 
			y: currentItem.y, 
			height: currentItem.height, 
			width: currentItem.width
		}
	},
	resize: function (wh) {
		this.wh = wh;
		this.transitionAnimation.resize(wh);

	},
	animate: function (vx, vy) {

		for (let i = 0; i < this.itemQ; i ++) {
			let c = this.items[i];
			c.x -= vx;// || this.vx;
			c.y -= vy;// || this.vy;

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

   //      	if (this.utils.circleRectangleCollisionRegPointCenter(this.hero, this.returnItem(c))) {
   //      		this.currentItem = c;
			// 	this.hit = true;
			// } 
		}

		

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
}