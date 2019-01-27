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
		bounceBlockIndex: 4, 
		doneCounter: 0, 
		init: function (parentCont, wh, spritesheet) {
			this.parentCont = parentCont;
			for(let i = 0; i < this.blockQ; i ++){
				let b = new PIXI.Graphics();
				b.beginFill(0x666600).drawRect(-this.w / 2, - this.h / 2,this.w, this.h).endFill();

				b.y = b.bottomY = i * (this.h + this.spacer);
				b.topY = i * this.h;
				b.bounceTop = b.y - this.spacer;
				if(i === 0)b.topY -= this.spacer;
				let distanceToTravel = Math.abs(b.topY - b.bottomY);
				let vy = distanceToTravel / 4;
				b.vy = b.storeVY = vy;
				this.blocks.push(b);
				this.cont.addChild(b);
				this.cont.y = -b.y;
			}
			this.blocks[this.bounceBlockIndex].active = true;
		},
		addToStage: function () {
			this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont);
		},
		resize: function () {

		},
		bounce: function () {
			this.bounceAllow = true;
			this.blocks[4].active = true;
			this.doneCounter = 0;
			this.bounceBlockIndex = this.blocks.length - 1;
			for(let i = 0; i < this.blockQ; i ++){
				let b = this.blocks[i];
				b.y = b.bottomY;
				b.vy = b.storeVY;

			}
		},
		bounceStyle1: function () {
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
		},
		bounceStyle2: function (vx, vy) {

			//console.log(this.blocks[0].y, this.blocks[0].bounceTop)

			if (!this.bounceAllow) {
				return;
			}

			//console.log(this.blocks[1].y, this.blocks[1].bottomY)
			for(let i = 0; i < this.blockQ; i ++){
				let b = this.blocks[i];
				if (b.active) {
					b.y -= b.vy;
					if (b.y < b.bounceTop) {
						b.y = b.bounceTop;
						b.vy *= -1;
						//TRIGGER NEXT BRICK
						this.bounceBlockIndex --;
						if (this.bounceBlockIndex >= 0) {
							this.blocks[this.bounceBlockIndex].active = true;
						}

					} else if(b.y > b.bottomY) {
						b.y = b.bottomY;
						b.vy *= -1;
						b.active = false;
						this.doneCounter ++;
						if (this.doneCounter === this.blocks.length) {
							this.counter = 0;
							this.doneCounter = 0;
							this.bounceBlockIndex = this.blocks.length - 1;
							
							this.bounceAllow = false;
						}
					}
				}
				
			}
			

		},
		animate: function (vx, vy) {
			//console.log(this.counter, this.trigger)
			//return;
			// this.counter ++;
			// if (this.counter === this.trigger ) {
			// 	this.bounce();
			// } 
			//console.log('boom')
			//this.cont.y += this.blocks[4].vy;
			// if(this.bounceAllow){
			// 	this.blocks[this.bounceBlockIndex].active = true;
			// }
			//if(this.bounceAllow){
			this.bounceStyle2(vx, vy);
			//}
			
		
			// for(let i = 0; i < 5; i ++){
			// 	let b = this.blocks[i];
			// 	b.y = this.utils.cosWave(b.storeY, b.differential, 0.01)	
			// }
			
			
		
		}
	}
}