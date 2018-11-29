export default function Protagonist (PIXI, diameter, utils) {
	return {
		numBalls: 5,
		balls: [],
		gravity: 2.5,
		friction: 0.8,
		width: 50,
		spring: 0.075,
		cont: new PIXI.Container(),
		colors: [0x333333, 0xFF00FF, 0x339900, 0x333333, 0x991100],
		scales: [0.1, 0.25, 0.5, 0.75, 1],
		pos: [],
		increment: 10,
		counter: 0,
		build: function () {

			for (let i = 0; i < this.numBalls; i++) {
                let ball = this.Ball(this.width, this.colors[i]);
                this.balls.push(ball);
                ball.scale.x = ball.scale.y = this.scales[i];
                this.cont.addChildAt(ball, 0);

                this.pos.push(0);
            }
            this.cont.balls = this.balls;
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
		animate: function () {
          
		  
           this.cont.x = 300 ;
           this.cont.y = 0;
           this.balls[0].x = Math.floor(utils.cosWave(300, 50, 0.0015));
           this.pos.push(this.balls[0].x);

          for (let i = 1; i < this.numBalls; i++) {
	          	this.balls[i].x = this.pos[this.pos.length - (i*this.increment)];
	       }
	       let maxLength = this.increment * this.numBalls;
	       if (this.pos.length > maxLength) {
	       	 this.pos = this.pos.slice(-maxLength);
	       }
         	// let increment = 2;

         	// if(this.counter % increment === 0){
         	// 	this.pos[this.counter] = this.balls[0].x;
         	// }

         	// let maxLength = this.numBalls * increment;
         	// // if(this.xs.length < arrayMaxLegth) return;

         	// for (let i = this.numBalls-1; i >= 1; i--) {
	         //  	this.balls[i].x = this.pos[i*10];
	         // }

	         // // this.xs = this.xs.slice(-arrayMaxLegth)
	         //  this.counter ++;
	         //  if (this.counter > maxLength) {
	         //  	this.counter = 0;
	         //  }
	         //  console.log(this.pos)
           
        },
       
        returnChain: function () {
        	this.cont.radius = this.width / 2;
        	return this.cont;
        }
	}
}