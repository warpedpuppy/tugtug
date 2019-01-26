import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		cont: new PIXI.Container(),
		w: 50,
		h: 10,
		spacer: 2,
		blocks: [],
		utils: Utils,
		pos: {},
		counter: 0,
		counterLimit: 5,
		max: 0, 
		contractBoolean: true,
		expandBoolean: false,
		counter: 0,
		init: function (parentCont, wh, spritesheet) {
			this.parentCont = parentCont;
			for(let i = 0; i < 5; i ++){
				let g = new PIXI.Graphics();
				g.beginFill(0x666600).drawRect(-this.w / 2,-this.h / 2,this.w, this.h).endFill();
				g.pivot.set(0.5);
				g.differential = i * 15 * -1;
				g.y = g.yPos = g.storeY = (this.h + this.spacer) * i * -1;
				g.distToTravel = (g.differential - g.storeY) / 2;
				g.destY = g.storeY - g.differential * -1;
				g.y = g.destY;
				g.done = false;
				this.blocks.push(g);
				this.cont.addChild(g);

			}
			
			
		},
		addToStage: function () {
			this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont);
		},
		expand: function () {
			for(let i = 0; i < 5; i ++){
				let b = this.blocks[i];
				if(b.y > b.destY){
					b.y += b.distToTravel;
				} else if(!b.done) {
					b.done = true;
					b.y = b.destY;
				}
			}
		},
		contract: function () {
			for(let i = 0; i < 5; i ++){
				let b = this.blocks[i];
				 if(b.y < b.storeY){
				 	
				 	b.y -= b.distToTravel;
				 } else if(!b.done) {
				 	b.done = true;
				 	b.y = b.storeY;
				 	this.counter ++;

				 	if(this.counter === 5){
				 		this.expandBoolean = true;
				 		this.contractBoolean = false;
				 	}
				 }
			}
		},
		reset: function () {
			this.counter = 0;
			for(let i = 0; i < 5; i ++){
				let b = this.blocks[i];
				b.done = false;
			}
		},
		resize: function () {

		},
		animate: function (vx, vy) {

			if(this.expandBoolean){
				this.expand();
			} else if(this.contractBoolean){
				this.contract();
			}
			//console.log(Math.floor(this.blocks[4].y), this.blocks[4].destY)
			// if(this.counter < this.counterLimit){
			// 	if(this.blocks[4].y < this.max){
			// 		this.max = this.blocks[4].y
			// 		//this.counter ++;
			// 	}
			// 	console.log(this.max)
			// 	for(let i = 0; i < 5; i ++){
			// 		let b = this.blocks[i];

					
			// 		b.y = this.utils.cosWave(b.storeY, b.differential, 0.01)	
			// 	}
			// }
			
		
		}
	}
}