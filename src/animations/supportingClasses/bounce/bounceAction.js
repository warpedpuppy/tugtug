import Utils from '../../utils/utils';
export default function () {
	return {
		speedLimit: 7,
		vx: 0,
		vy: 0,
		angle: 0,
		velocity: 10,
		legCounter: 0,
		legCounterLimit: 10,
		utils: Utils,
		init: function (bouncePlatform) {
			this.hero = this.utils.hero;
			this.bouncePlatform = bouncePlatform;
			this.canvasWidth = this.utils.canvasWidth;
			this.canvasHeight = this.utils.canvasHeight;
		},
		resize: function (wh) {
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
		},
		rotate: function () {

		},
		animate: function () {
			//this.hero.vy += 0.25;


				this.hero.activeHero.animate(); // this is the reticulated bouncing

				
				
				if (this.hero.activeHero.legStyle === 2) {
					this.legCounter ++;
					if(this.legCounter >= this.legCounterLimit){
						this.hero.activeHero.bounce(false);
						this.legCounter = 0;
					}
				}

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
				
		        let A = {x:this.bouncePlatform.dot1.x, y: this.bouncePlatform.dot1.y};
		        let B = {x: this.bouncePlatform.dot2.x, y: this.bouncePlatform.dot2.y};
		        let C = {x: this.utils.canvasWidth / 2, y: this.utils.canvasHeight / 2};
		        if (this.bouncePlatform.mouseDown !== true && this.utils.lineIntersectCircle(A, B, C, 20)) {
		        	
		         	this.hero.activeHero.bounce(true);
		            let delta_x = dot1.x - dot2.x;
					let delta_y = dot1.y - dot2.y;
					let theta_radians = Math.atan2(delta_y, delta_x);

		            this.vx = this.velocity * -Math.sin(theta_radians);
					this.vy = (this.velocity * Math.cos(theta_radians)) * 1.75;


		           
		        }

		}
	}
}