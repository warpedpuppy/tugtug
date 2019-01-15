import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
export default {
	items: [],
	itemStrings: ['flyTrans', 'jumpTrans', 'bounceTrans', 'swimTrans'],
	currentItem: undefined,
	wh: undefined,
	speed: 3,
	init: function (cont, wh) {
		this.wh = wh;
		this.cont = cont;
		
	},
	build: function () {
		for(let item of this.itemStrings){
			let s = PIXI.Sprite.fromImage(`/bmps/${item}.png`);
			s.anchor.set(0.5);
			s
			this.items.push(s);
		}

		this.currentItem = this.items[0];
		this.currentItem.x = this.wh.canvasWidth / 2;
		this.currentItem.y = 0;
		this.cont.addChild(this.currentItem);
	},
	returnItem: function () {
		return {x: this.currentItem.x, y: this.currentItem.y, height: this.currentItem.height, width: this.currentItem.width}
	},
	animate: function () {
		this.currentItem.y += this.speed;

		if(this.currentItem.y > this.wh.canvasHeight){
			this.currentItem.y = 0;
		}

	}
}