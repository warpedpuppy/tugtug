export default function Protagonist (PIXI, diameter) {
	return {
		numBalls: 5,
		balls: [],
		gravity: 2.5,
		friction: 0.8,
		width: 50,
		spring: 0.1,
		cont: new PIXI.Container(),
		build: function () {
			for (let i = 0; i < this.numBalls; i++){
                let ball = this.Ball(this.width, 0xFF0000);
                this.balls.push(ball);
                this.cont.addChild(ball);
            }
		},
		Ball: function (radius, color) {

			let cont = new PIXI.Container();
            cont.radius = radius;
            cont.height = cont.radius * 4;
            cont.vx = 0;
            cont.vy = 0;
            cont.xpos = 0;
            cont.ypos = 0;

            let b = new PIXI.Graphics();
            b.beginFill(color).drawCircle(0,0, cont.radius * 2);
            cont.addChild(b);
            cont.body = b;

            return cont;
		},
		animate: function (event) {
            // this.line.clear();
            // this.line.lineStyle(4, 0xFFFFFF, 1);
            // this.line.moveTo(this.mousePosition.x, this.mousePosition.y);
            this.moveBall(this.balls[0], this.cont.x, this.cont.y);
            // this.line.lineTo(this.balls[0].x, this.balls[0].y);
            let i, ballA, ballB;
            for (i = 1; i < this.numBalls; i++) {

                ballA = this.balls[i-1];
                ballB = this.balls[i];
                this.moveBall(ballB, ballA.x, ballA.y);
                //this.line.lineTo(ballB.x, ballB.y);
            };
        },
        moveBall: function (ball, targetX, targetY) {

            var tempBallBody = ball;
            ball.vx += (targetX - tempBallBody.x) * this.spring;
            ball.vy += (targetY - tempBallBody.y) * this.spring;
            ball.vy += this.gravity;
            ball.vx *= this.friction;
            ball.vy *= this.friction;
             tempBallBody.x += ball.vx;
             tempBallBody.y += ball.vy;
        },
        returnChain: function () {
        	this.cont.radius = this.width / 2;
        	return this.cont;
        }
	}
}