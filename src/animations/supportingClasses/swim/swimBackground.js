import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		texture: new PIXI.Texture.fromImage('/bmps/water.png'),
		eelTexture: new PIXI.Texture.fromImage('/bmps/eel.png'),
		sprite1: undefined,
		sprite2: undefined,
		speed1: 0.5,
		speed2: 0.75,
		sizeIncrement: 2,
		init: function (cont, wh) {
			this.wh = wh;
			this.sprite1 = new PIXI.Sprite(this.texture);
			this.sprite1.width = this.wh.canvasWidth * this.sizeIncrement;
			this.sprite1.height = this.wh.canvasHeight * this.sizeIncrement;
			this.sprite1.vx = this.speed1;
			this.sprite1.vy = this.speed1;
			this.sprite1.alpha = 0.15;

			this.sprite2 = new PIXI.Sprite(this.texture);
			this.sprite2.width = this.wh.canvasWidth * this.sizeIncrement;
			this.sprite2.height = this.wh.canvasHeight * this.sizeIncrement;
			this.sprite2.x = -this.wh.canvasWidth / this.sizeIncrement;
			this.sprite2.y = -this.wh.canvasHeight / this.sizeIncrement;
			this.sprite2.alpha = 0.5;
			this.sprite2.vx = this.speed2;
			this.sprite2.vy = this.speed2;

			// this.count = 0;
			// this.points = [];
			// this.pointsQ = 5;

			// for (var i = 0; i < this.pointsQ; i++) {
			//     this.points.push(new PIXI.Point(i * 300, 0));
			// }
			// let eel = new PIXI.mesh.Rope(PIXI.Texture.fromImage('/bmps/koi.png'), this.points);
			// eel.y = 100;
			// cont.addChild(eel)

			cont.addChildAt(this.sprite2, 0);
			cont.addChild(this.sprite1);

		},
		animate: function () {

			// this.count += 0.1;

		 //    // make the snake
		 //    for (var i = 0; i < this.pointsQ; i++) {
		 //        this.points[i].y = Math.sin((i * 0.5) + this.count) * 30;
		 //        this.points[i].x = i * 300 + Math.cos((i * 0.3) + this.count) * 20;
		 //    }



			this.sprite2.x += this.sprite2.vx;
			this.sprite2.y += this.sprite2.vy;

			if (this.sprite2.x > 0) {
				this.sprite2.x = 0;
				this.sprite2.vx *= -1;
			} else if(this.sprite2.x < -this.wh.canvasWidth / this.sizeIncrement){
				this.sprite2.x = -this.wh.canvasWidth / this.sizeIncrement;;
				this.sprite2.vx *= -1;
			}

			if (this.sprite2.y > 0) {
				this.sprite2.y = 0;
				this.sprite2.vy *= -1;
			} else if(this.sprite2.y < -this.wh.canvasHeight / this.sizeIncrement){
				this.sprite2.y = -this.wh.canvasHeight / this.sizeIncrement;
				this.sprite2.vy *= -1;
			}

			this.sprite1.x += this.sprite1.vx;
			this.sprite1.y += this.sprite1.vy;

			if (this.sprite1.x > 0) {
				this.sprite1.x = 0;
				this.sprite1.vx *= -1;
			} else if(this.sprite1.x < -this.wh.canvasWidth / this.sizeIncrement){
				this.sprite1.x = -this.wh.canvasWidth / this.sizeIncrement;;
				this.sprite1.vx *= -1;
			}

			if (this.sprite1.y > 0) {
				this.sprite1.y = 0;
				this.sprite1.vy *= -1;
			} else if(this.sprite1.y < -this.wh.canvasHeight / this.sizeIncrement){
				this.sprite1.y = -this.wh.canvasHeight / this.sizeIncrement;
				this.sprite1.vy *= -1;
			}
		}

	}
}