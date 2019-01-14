import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		gravity: 0.3,
		speedLimit: 7,
		vy: 0,
		vx: 0,
		jumpTimer: 0,
		jumpTimeLimit: 21,
		init: function (hero, platforms, canvasWidth, canvasHeight, platformCont, stage) {
			this.hero = hero;
			this.platforms = platforms;
			this.canvasWidth = canvasWidth;
			this.canvasHeight = canvasHeight;
			this.utils = Utils();
			this.platformCont = platformCont;
			this.stage = stage;

		},
		jump: function () {
			this.vy = 9;
			this.jumpTimer = 1;
		},
		resize: function (wh){
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
		},
		move: function (str) {
			if(str === 'left'){
				this.vx = 3;
			} else if (str === 'right'){
				this.vx = -3;
			} else {
				this.vx = 0;
			}
		},
		animate: function () {
			this.vy -= this.gravity;

			if(this.jumpTimer === 0){
				if(this.vy > this.speedLimit){
					this.vy = this.speedLimit;
				} else if(this.vy < -this.speedLimit){
					this.vy = -this.speedLimit;
				}
			} else {
				this.jumpTimer ++;
				if(this.jumpTimer >= this.jumpTimeLimit){
					this.jumpTimer = 0;
				}
			}
			

			// this.hero.cont.y += this.hero.vy;
			// this.hero.cont.x += this.hero.vx;
			this.platformCont.y += this.vy;
			this.platformCont.x += this.vx;


			for(let i = 0; i < this.platforms.length; i++){
				let globalPoint = this.platforms[i].toGlobal(this.stage, undefined, true);
				//console.log(globalPoint)
				let tempRect = new PIXI.Rectangle(globalPoint.x, globalPoint.y, this.platforms[i].width, this.platforms[i].height)

				if(this.utils.circleRectangleCollision(this.hero.cont, tempRect)){

					let newY = ((this.canvasHeight / 2) - this.platforms[i].y) + this.hero.cont.radius + 10;

					this.platformCont.y = newY;//this.hero.cont.radius;

					this.vy *= -1;
				}
			}
			// if(this.cont.y > (this.canvasHeight - this.cont.radius)) {
			// 	this.cont.y -= 1;
			// 	this.vy *= -1;
			// }
			if(this.hero.cont.x <= this.hero.cont.radius){
				this.cont.x +=1;
				this.vx *=-1;
			}
			if(this.hero.cont.x >= (this.canvasWidth - this.hero.cont.radius)){
				this.hero.cont.x +=1;
				this.vx *=-1;
			}

		}
	}
}