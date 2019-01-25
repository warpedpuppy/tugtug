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
		update: function (ball) {
			ball.x += ball.vx;
			ball.y += ball.vy;
			ball.rotation += this.utils.deg2rad(ball.rotate);
			if(ball.x > this.wh.canvasWidth - ball.r) {
				ball.x = this.wh.canvasWidth - ball.r;
				ball.vx *= -1;
			} else if(ball.x < ball.r) {
				ball.x = ball.r;
				ball.vx *= -1;
			}
			if(ball.y > this.wh.canvasHeight - ball.r) {
				ball.y = this.wh.canvasHeight - ball.r;
				ball.vy *= -1;
			} else if(ball.y < ball.r) {
				ball.y = ball.r + 1;
				ball.vy *= -1;
			}
		},
		addToStage: function () {
		  	this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
		  	this.parentCont.removeChild(this.cont);
		},
		adjustPositions: function (ballA, ballB, depth){
			const percent = 0.2;
			const slop = 0.01;
			var correction = (Math.max(depth - slop, 0) / (1/ballA.r + 1/ballB.r)) * percent;
			
			var norm = [ballB.x - ballA.x, ballB.y - ballA.y];
			var mag = Math.sqrt(norm[0]*norm[0] + norm[1]*norm[1]);
			norm = [norm[0]/mag,norm[1]/mag];
			correction = [correction*norm[0],correction*norm[1]];
			ballA.x -= 1/ballA.r * correction[0];
			ballA.y -= 1/ballA.r * correction[1];
			ballB.x += 1/ballB.r * correction[0];
			ballB.y += 1/ballB.r * correction[1];
		},
		resolveCollision: function (ballA, ballB){
			var relVel = [ballB.vx - ballA.vx,ballB.vy - ballA.vy];
			var norm = [ballB.x - ballA.x, ballB.y - ballA.y];
			var mag = Math.sqrt(norm[0]*norm[0] + norm[1]*norm[1]);
			norm = [norm[0]/mag,norm[1]/mag];
			
			var velAlongNorm = relVel[0]*norm[0] + relVel[1]*norm[1];
			if(velAlongNorm > 0)
				return;
			
			var bounce = 0.7;
			var j = -(1 + bounce) * velAlongNorm;
			j /= 1/ballA.r + 1/ballB.r;
			
			var impulse = [j*norm[0],j*norm[1]];
			ballA.vx -= 1/ballA.r * impulse[0];
			ballA.vy -= 1/ballA.r * impulse[1];
			ballB.vx += 1/ballB.r * impulse[0];
			ballB.vy += 1/ballB.r * impulse[1];
		},
		animate: function () {

			for(var ball of this.array){
				this.update(ball);
				for(var ball2 of this.array){
					if(ball !== ball2){
						let collision = this.utils.circleToCircleCollisionDetection(ball, ball2);
						if(collision[0]){
							this.adjustPositions(ball, ball2, collision[1]);
							this.resolveCollision(ball, ball2);
						}
					}
				
				}
			}

	}

	}
}