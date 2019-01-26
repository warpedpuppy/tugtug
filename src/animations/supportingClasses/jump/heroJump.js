import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		cont: new PIXI.Container(),
		w: 50,
		h: 10,
		spacer: 10,
		blocks: [],
		utils: Utils,
		pos: {},
		counter: 0,
		counterLimit: 5,
		max: 0, 
		contractBoolean: true,
		expandBoolean: false,
		counter: 0,
		trigger: 100,
		gravity: 1.01,
		bounceAllow: false,
		blockQ: 5, 
		init: function (parentCont, wh, spritesheet) {
			this.parentCont = parentCont;
			for(let i = 0; i < this.blockQ; i ++){
				let g = new PIXI.Graphics();
				g.beginFill(0x666600).drawRect(-this.w / 2, - this.h / 2,this.w, this.h).endFill();

				g.y = g.bottomY = i * (this.h + this.spacer);
				g.topY = i * this.h;
				let distanceToTravel = Math.abs(g.topY - g.bottomY);
				let vy = distanceToTravel / 8;
				g.vy = g.storeVY = vy;
				this.blocks.push(g);
				this.cont.addChild(g);
				this.cont.y = -g.y;
			}
		},
		addToStage: function () {
			this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont);
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
		bounce: function () {
			this.bounceAllow = true;
		},
		animate: function (vx, vy) {
			//console.log(this.counter, this.trigger)
			//return;
			// if(this.counter !== this.trigger ){
			// 	this.counter ++;
			// 	return
			// }
			//this.cont.y += this.blocks[4].vy;
			if(this.bounceAllow){
				for(let i = 0; i < this.blockQ; i ++){
					let b = this.blocks[i];
					b.y -= b.vy;
					//b.vy *= this.gravity;
					if(b.y < b.topY) {
						b.y = b.topY;
						b.vy *= -1;
					} else if (b.y > b.bottomY) {
						b.y = b.bottomY;
						b.vy *= -1;
						this.counter = 0;
					//	this.cont.y = this.blocks[4].topY;
						this.bounceAllow = false;
					}
				}
			}
			
		
			// for(let i = 0; i < 5; i ++){
			// 	let b = this.blocks[i];
			// 	b.y = this.utils.cosWave(b.storeY, b.differential, 0.01)	
			// }
			
			
		
		}
	}
}