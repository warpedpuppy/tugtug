import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		speedLimit: 7,
		vx: 0,
		vy: 0,
		angle: 0,
		velocity: 10,
		utils: Utils,
		init: function (hero, bouncePlatform, canvasWidth, canvasHeight) {
			this.hero = hero;
			this.bouncePlatform = bouncePlatform;
			this.canvasWidth = canvasWidth;
			this.canvasHeight = canvasHeight;
		},
		resize: function (wh) {
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
		},
		animate: function () {
			//this.hero.vy += 0.25;
				if (this.vy < this.speedLimit) {
		            this.vy += 0.5;
		        } 
				

		        if(this.vy > 0) {
		        	//console.log('up');
		        	if (this.vy > this.speedLimit) {
		                this.vy -= 0.5;
		            }
		        } else {
		        	//console.log('down')
		        }


				let dot1 = this.bouncePlatform.dot1;
				let dot2 = this.bouncePlatform.dot2;
				let line = this.bouncePlatform.line;
				 if (this.bouncePlatform.mouseDown !== true) {

	                dot1.y -= this.vy;
	                dot2.y -= this.vy;
	                line.y -= this.vy;

	                dot1.x -= this.vx;
	                dot2.x -= this.vx;
	                line.x -= this.vx;
	            }

				 //BOUNCING PLATFORM COLLISION DETECTION
				
		        let A = new PIXI.Point(this.bouncePlatform.dot1.x, this.bouncePlatform.dot1.y);
		        let B = new PIXI.Point(this.bouncePlatform.dot2.x, this.bouncePlatform.dot2.y);
		        let C = new PIXI.Point(this.canvasWidth / 2, this.canvasHeight / 2);
		        if (this.bouncePlatform.mouseDown !== true && this.utils.lineIntersectCircle(A, B, C, 20)) {
		         
		            let delta_x = dot1.x - dot2.x;
					let delta_y = dot1.y - dot2.y;
					let theta_radians = Math.atan2(delta_y, delta_x);

		            this.vx = this.velocity * -Math.sin(theta_radians);
					this.vy = (this.velocity * Math.cos(theta_radians)) * 1.75;


		           
		        }

		}
	}
}