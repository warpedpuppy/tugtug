import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		gravity: 0.0003,
		speedLimit: 7,
		init: function (hero, platforms, canvasWidth, canvasHeight, stage) {
			this.hero = hero;
			this.platforms = platforms;
			this.canvasWidth = canvasWidth;
			this.canvasHeight = canvasHeight;
			this.utils = Utils();
			this.stage = stage;
		},
		animate: function () {
			this.hero.vy += this.gravity;
			// this.hero.cont.y += this.hero.vy;
			// this.hero.cont.x += this.hero.vx;
			 this.stage.y -= this.hero.vy;
			// this.stage.x -= this.hero.vx;


			for(let i = 0; i < this.platforms.length; i++){
				let globalPoint = this.platforms[i].toGlobal(this.stage, undefined, true);
				//console.log(globalPoint)
				let tempRect = new PIXI.Rectangle(globalPoint.x, globalPoint.y, this.platforms[i].width, this.platforms[i].height)

				if(this.utils.circleRectangleCollision(this.hero.cont, tempRect)){
					this.stage.y += 10;
					this.hero.vy *= -1;
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
				this.hero.vx *=-1;
			}

		}
	}
}