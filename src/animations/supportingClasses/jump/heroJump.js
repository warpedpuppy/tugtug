import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		cont: new PIXI.Container(),
		w: 50,
		h: 10,
		spacer: 0.05,
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
		init: function (parentCont, wh, spritesheet) {
			this.parentCont = parentCont;
			for(let i = 0; i < 5; i ++){
				let g = new PIXI.Graphics();
				g.beginFill(0x666600).drawRect(-this.w / 2, - this.h / 2,this.w, this.h).endFill();
				g.pivot.set(0.5);
				g.topY = i * (-this.h * 2);
				g.y = g.bottomY = this.h * i * -1;
				let distanceToTravel = Math.abs(g.topY - g.bottomY);
				let vy = distanceToTravel / 10;
				g.vy = g.storeVY = vy;
				g.y = g.topY;
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
			//console.log(this.counter, this.trigger)
			if(this.counter !== this.trigger){
				this.counter ++;
				return;
			}

			for(let i = 0; i < 5; i ++){
				let b = this.blocks[i];
				b.y += b.vy;
				b.vy *= this.gravity;
				if(b.y > b.bottomY) {
					b.y = b.bottomY;
					b.vy *= -1;
				} else if (b.y < b.topY) {
					b.y = b.topY;
					b.vy *= -1;
					b.vy = b.storeVY;
					this.counter = 0;
				}
			}
		
			// for(let i = 0; i < 5; i ++){
			// 	let b = this.blocks[i];
			// 	b.y = this.utils.cosWave(b.storeY, b.differential, 0.01)	
			// }
			
			
		
		}
	}
}