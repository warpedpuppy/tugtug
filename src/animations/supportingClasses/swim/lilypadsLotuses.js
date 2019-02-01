import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function (spritesheet) {
	return {
		array: [],
		utils: Utils,
		cont: new PIXI.Container(),
		buffer: 10, 
		init: function (parentCont, wh) {
			this.parentCont = parentCont;
			this.wh = wh;
			this.strs = [
				['/bmps/lilyPad2.png', 178],
				['/bmps/lilypad1.png',211]
			];
			this.loopingQ = 6;

			for(let i = 0; i < this.loopingQ; i ++){
				//let s1 = new PIXI.Sprite.fromImage(this.strs[i]);

				let t = this.utils.randomItemFromArray(this.strs);
				let s1 = new PIXI.Sprite.fromImage(t[0]);
				// let ballWidth =  this.utils.randomNumberBetween(50, 100);
				// let halfWidth = ballWidth / 2;
				// s1.beginFill(0x98FB98).drawCircle(-halfWidth,-halfWidth,ballWidth).endFill();

				s1.anchor.set(0.5);
				s1.x = this.utils.randomNumberBetween(0, this.wh.canvasWidth);
				s1.y = this.utils.randomNumberBetween(0, this.wh.canvasHeight);

				//s1.pivot.set(0.5);
				s1.radius = s1.r = t[1] / 2;
				s1.vx = this.utils.randomNumberBetween(-1, 1);
				s1.vy = this.utils.randomNumberBetween(-1, 1);
				s1.rotate = this.utils.randomNumberBetween(-1, 1);
				this.cont.addChild(s1);
				this.array.push(s1);
			}

		
		},
		addToStage: function () {
		  	this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
		  	this.parentCont.removeChild(this.cont);
		},
	
		animate: function () {

			for(var ball of this.array){
				this.utils.update(ball, this.wh);
				for(var ball2 of this.array){
					if(ball !== ball2){
						let collision = this.utils.circleToCircleCollisionDetection(ball, ball2);
						if(collision[0]){
							this.utils.adjustPositions(ball, ball2, collision[1]);
							this.utils.resolveCollision(ball, ball2);
						}
					}
				
				}
			}

	}

	}
}