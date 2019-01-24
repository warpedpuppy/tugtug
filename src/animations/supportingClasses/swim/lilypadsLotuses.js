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
			// '/bmps/lotus1.png',
			// '/bmps/lotus2.png',
			'/bmps/lilypad1.png',
			'/bmps/lilypad1.png',
			'/bmps/lilypad1.png',
			];
			this.loopingQ = 10;
			for(let i = 0; i < this.loopingQ; i ++){
				//let s1 = new PIXI.Sprite.fromImage(this.strs[i]);
				let s1 = new PIXI.Graphics();
				let ballWidth =  this.utils.randomNumberBetween(50, 100);
				let halfWidth = ballWidth / 2;
				s1.beginFill(0x98FB98).drawCircle(-halfWidth,-halfWidth,ballWidth).endFill();
				s1.x = this.utils.randomNumberBetween(0, this.wh.canvasWidth);
				s1.y = this.utils.randomNumberBetween(0, this.wh.canvasHeight);

				//s1.pivot.set(0.5);
				s1.radius = s1.r = ballWidth;
				s1.dx = this.utils.randomNumberBetween(-1, 1);
				s1.dy = this.utils.randomNumberBetween(-1, 1);
				s1.rotate = this.utils.randomNumberBetween(-1, 1);
				this.cont.addChild(s1);
				this.array.push(s1);
			}

		
		},
		update: function (ball) {
			ball.x += ball.dx;
			ball.y += ball.dy;
			if(ball.x > this.wh.canvasWidth - ball.r) {
				ball.x = this.wh.canvasWidth - ball.r;
				ball.dx *= -1;
			} else if(ball.x < ball.r) {
				ball.x = ball.r;
				ball.dx *= -1;
			}
			if(ball.y > this.wh.canvasHeight - ball.r) {
				ball.y = this.wh.canvasHeight - ball.r;
				ball.dy *= -1;
			} else if(ball.y < ball.r) {
				ball.y = ball.r + 1;
				ball.dy *= -1;
			}
		},
		addToStage: function () {
		  	this.parentCont.addChild(this.cont);
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
			var relVel = [ballB.dx - ballA.dx,ballB.dy - ballA.dy];
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
			ballA.dx -= 1/ballA.r * impulse[0];
			ballA.dy -= 1/ballA.r * impulse[1];
			ballB.dx += 1/ballB.r * impulse[0];
			ballB.dy += 1/ballB.r * impulse[1];
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