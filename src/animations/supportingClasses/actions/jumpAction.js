import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		gravity: 0.3,
		speedLimit: 20,
		vy: 0,
		vx: 0.5,
		jumpTimer: 0,
		jumpTimeLimit: 21,
		utils: Utils,
		init: function (hero, platforms, canvasWidth, canvasHeight, platformCont, stage) {
			this.hero = hero;
			this.platforms = platforms;
			this.canvasWidth = canvasWidth;
			this.canvasHeight = canvasHeight;
			this.platformCont = platformCont;
			this.stage = stage;

		},
		jump: function () {
			console.log("JUMP")
			this.vy = -3;
			this.jumpTimer = 1;
			this.hero.heroJump.bounce();
			this.hero.heroJump.jumpMouth();
		},
		resize: function (wh){
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
		},
		move: function (str) {
			if(str === 'left'){
				this.vx = -0.5;
				//if(this.vx > this.speedLimit)this.vx = this.speedLimit;
				this.hero.heroJump.look('left');
			} else if (str === 'right'){
				 this.vx = 0.5;
				// if(this.vx < this.speedLimit)this.vx = -this.speedLimit;
				 this.hero.heroJump.look('right');
			} else {
				this.vx = 0;
			}


		},
		animate: function () {
			this.hero.cont.y += this.vy;
			if(this.hero.cont.y > this.hero.floor) {
				this.hero.cont.y = this.hero.floor;
				this.vy = 0;
				this.hero.heroJump.grimaceMouth();
			} else if (this.hero.cont.y < this.hero.floor) {
				this.vy += this.gravity;
			}



			// this.hero.heroJump.animate(this.vx, this.vy);

			// //this.vy -= this.gravity;
			// this.platformCont.y += this.vy;
			// this.platformCont.x += this.vx;
			// if(this.jumpTimer === 0){
			// 	if(this.vy > this.speedLimit){
			// 		this.vy = this.speedLimit;
			// 	} else if(this.vy < -this.speedLimit){
			// 		this.vy = -this.speedLimit;
			// 	}
			// } else {
			// 	this.jumpTimer ++;
			// 	if(this.jumpTimer >= this.jumpTimeLimit){
			// 		this.jumpTimer = 0;
			// 	}
			// }
			
			// // 


			// for(let i = 0; i < this.platforms.length; i++){
			// 	let globalPoint = this.platforms[i].toGlobal(this.stage, undefined, true);
			// 	//console.log(globalPoint)
			// 	let tempRect = new PIXI.Rectangle(
			// 		globalPoint.x - this.platforms[i].halfWidth, globalPoint.y , this.platforms[i].width, this.platforms[i].height)

			// 	if(this.utils.circleRectangleCollision(this.hero.cont, tempRect)){
			// 		//console.log('hit')
			// 		this.hero.heroJump.bounce(this.vx, this.vy);
			// 		let newY = ((this.canvasHeight / 2) - this.platforms[i].y) + this.hero.cont.radius + 10;

			// 		this.platformCont.y = newY;//this.hero.cont.radius;

			// 		this.vy *= -1;
			// 	}
			// }
			// // if(this.cont.y > (this.canvasHeight - this.cont.radius)) {
			// // 	this.cont.y -= 1;
			// // 	this.vy *= -1;
			// // }
			// if(this.hero.cont.x <= this.hero.cont.radius){
			// 	this.cont.x +=1;
			// 	this.vx *=-1;
			// }
			// if(this.hero.cont.x >= (this.canvasWidth - this.hero.cont.radius)){
			// 	this.hero.cont.x +=1;
			// 	this.vx *=-1;
			// }

		}
	}
}








