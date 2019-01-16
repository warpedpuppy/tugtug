import * as PIXI from 'pixi.js';
export default {
	textures: [],
	currentItem: undefined,
	wh: undefined,
	speed: 1,
	textureCounter: 1,
	init: function (arr, cont, wh, spritesheet) {
		this.itemStrings = arr;
		this.wh = wh;
		this.cont = cont;
		this.spritesheet = spritesheet;
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
		for(let item of this.itemStrings){
			let s = this.spritesheet.textures[`${item}Trans.png`];
		
			this.textures.push(s);
		}

		this.currentItem = new PIXI.Sprite(this.textures[this.textureCounter]);
		this.currentItem.name = this.itemStrings[this.textureCounter];
		this.currentItem.anchor.set(0.5);
		this.currentItem.x = this.wh.canvasWidth / 2;
		this.currentItem.y = 0;
		this.cont.addChild(this.currentItem);
	},
	returnItem: function () {
		return {
			x: this.currentItem.x, 
			y: this.currentItem.y, 
			height: this.currentItem.height, 
			width: this.currentItem.width
		}
	},
	animate: function () {
		this.currentItem.y += this.speed;

		if(this.currentItem.y > this.wh.canvasHeight){
			this.currentItem.y = 0;
		}

	}
}