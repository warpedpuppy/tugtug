import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		speedLimit: 7,
		init: function (hero, bouncePlatform, canvasWidth, canvasHeight) {
			this.hero = hero;
			this.bouncePlatform = bouncePlatform;
			this.canvasWidth = canvasWidth;
			this.canvasHeight = canvasHeight;
			this.utils = Utils();
		},
		animate: function () {
			//this.hero.vy += 0.25;
				if (this.hero.vy < this.speedLimit) {
		            this.hero.vy += 0.5;
		        } 
				

		        if(this.hero.vy > 0) {
		        	//console.log('up');
		        	if (this.hero.vy > this.speedLimit) {
		                this.hero.vy -= 0.5;
		            }
		        } else {
		        	//console.log('down')
		        }


				let dot1 = this.bouncePlatform.dot1;
				let dot2 = this.bouncePlatform.dot2;
				let line = this.bouncePlatform.line;
				 if (this.bouncePlatform.mouseDown !== true) {

	                dot1.y -= this.hero.vy;
	                dot2.y -= this.hero.vy;
	                line.y -= this.hero.vy;

	                dot1.x -= this.hero.vx;
	                dot2.x -= this.hero.vx;
	                line.x -= this.hero.vx;
	            }

				 //BOUNCING PLATFORM COLLISION DETECTION
				
		        let A = new PIXI.Point(this.bouncePlatform.dot1.x, this.bouncePlatform.dot1.y);
		        let B = new PIXI.Point(this.bouncePlatform.dot2.x, this.bouncePlatform.dot2.y);
		        let C = new PIXI.Point(this.canvasWidth / 2, this.canvasHeight / 2);
		        if (this.bouncePlatform.mouseDown !== true && this.utils.lineIntersectCircle(A, B, C, 20)) {
		            if ((dot1.x > dot2.x && dot1.y < dot2.y) || (dot1.y > dot2.y && dot1.x < dot2.x)) {
		                this.hero.vx = -2;
		            } else if ((dot1.x > dot2.x && dot1.y > dot2.y) || (dot1.y < dot2.y && dot1.x < dot2.x)) {
		                this.hero.vx = 2;
		            }
		            this.hero.vy *= -1.75;
		           
		        }

		}
	}
}