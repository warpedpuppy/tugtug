import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
export default function () {
	return {
		texture: 'waterSmall.png',
		sprite1: undefined,
		sprite2: undefined,
		speed1: 0.5,
		speed2: 0.75,
		sizeIncrement: 2,
		utils: Utils,
		init: function (cont) {
			this.cont = cont;
			this.wh = this.utils.wh;

			let arr = [
				[0,0,1,1],
				[2000, 0, -1,1],
				[0,1000,1,-1],
				[2000,1000,-1,-1]
			]

			this.cont1 = this.build(arr);
			this.cont2 = this.build(arr);
			
			this.cont1.width = this.wh.canvasWidth * this.sizeIncrement;
			this.cont1.height = this.wh.canvasHeight * this.sizeIncrement;

			this.cont1.vx = this.speed1;
			this.cont1.vy = this.speed1;
			this.cont1.alpha = 0.15;

			this.cont2.width = this.wh.canvasWidth * this.sizeIncrement;
			this.cont2.height = this.wh.canvasHeight * this.sizeIncrement;
			this.cont2.x = -this.wh.canvasWidth / this.sizeIncrement;
			this.cont2.y = -this.wh.canvasHeight / this.sizeIncrement;
			this.cont2.alpha = 0.5;
			this.cont2.vx = this.speed2;
			this.cont2.vy = this.speed2;

		},
		build: function (arr) {
			let s, cont = Assets.Container();
			for(let i = 0; i < 4; i ++){
				s = Assets.Sprite(this.texture);
				s.x = arr[i][0];
				s.y = arr[i][1];
				s.scale.x = arr[i][2];
				s.scale.y = arr[i][3];
				cont.addChild(s);
			}
			return cont;
		},
		addToStage: function () {
			//this.cont.addChildAt(this.sprite2, 0);
			this.cont.addChildAt(this.cont2, 0);
			this.cont.addChildAt(this.cont1, this.cont.children.length - 2);
		},
		removeFromStage: function () {
			this.cont.removeChild(this.cont2);
			this.cont.removeChild(this.cont1);
		},
		animate: function () {


			this.cont2.x += this.cont2.vx;
			this.cont2.y += this.cont2.vy;

			if (this.cont2.x > 0) {
				this.cont2.x = 0;
				this.cont2.vx *= -1;
			} else if(this.cont2.x < -this.wh.canvasWidth / this.sizeIncrement){
				this.cont2.x = -this.wh.canvasWidth / this.sizeIncrement;;
				this.cont2.vx *= -1;
			}

			if (this.cont2.y > 0) {
				this.cont2.y = 0;
				this.cont2.vy *= -1;
			} else if(this.cont2.y < -this.wh.canvasHeight / this.sizeIncrement){
				this.cont2.y = -this.wh.canvasHeight / this.sizeIncrement;
				this.cont2.vy *= -1;
			}

			this.cont1.x += this.cont1.vx;
			this.cont1.y += this.cont1.vy;

			if (this.cont1.x > 0) {
				this.cont1.x = 0;
				this.cont1.vx *= -1;
			} else if(this.cont1.x < -this.wh.canvasWidth / this.sizeIncrement){
				this.cont1.x = -this.wh.canvasWidth / this.sizeIncrement;;
				this.cont1.vx *= -1;
			}

			if (this.cont1.y > 0) {
				this.cont1.y = 0;
				this.cont1.vy *= -1;
			} else if(this.cont1.y < -this.wh.canvasHeight / this.sizeIncrement){
				this.cont1.y = -this.wh.canvasHeight / this.sizeIncrement;
				this.cont1.vy *= -1;
			}
		}

	}
}