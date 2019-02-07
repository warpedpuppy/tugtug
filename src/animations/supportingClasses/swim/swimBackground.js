import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		texture: new PIXI.Texture.fromImage('/bmps/water.png'),
		sprite1: undefined,
		sprite2: undefined,
		speed1: 0.5,
		speed2: 0.75,
		sizeIncrement: 2,
		utils: Utils,
		init: function (cont) {
			this.cont = cont;
			this.wh = this.utils.wh;
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

		},
		addToStage: function () {
			this.cont.addChildAt(this.sprite2, 0);
			this.cont.addChild(this.sprite1);
		},
		removeFromStage: function () {
			this.cont.removeChild(this.sprite2);
			this.cont.removeChild(this.sprite1);
		},
		animate: function () {


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