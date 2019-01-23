import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		texture: new PIXI.Texture.fromImage('/bmps/koi.png'),
		points: [],
		imageWidth: 300,
		pointQ: 5,
		fishQ: 30,
		fishArray: [],
		utils: Utils,
		init: function (cont, wh) {
			this.cont = cont;
			this.wh = wh;
			this.fish = this.fish.bind(this);
 			let steps = this.imageWidth / this.pointQ;
            for (var i = 0; i < this.pointQ; i++) {
            	let startPoint = i * 10;
			    this.points.push(new PIXI.Point( i * steps, 0));
			}

           for(let i = 0; i < this.fishQ; i ++) {
           		let f = this.fish(this.texture, this.points, this.utils);
           		f.x = this.utils.randomNumberBetween(0, this.wh.canvasWidth);
           		f.y = this.utils.randomNumberBetween(0, this.wh.canvasHeight);
           		let num = this.utils.randomNumberBetween(0, 360)
           		f.vx = this.utils.randomNumberBetween(-3, 3);
				f.vy = this.utils.randomNumberBetween(-3, 3);
				f.alpha = 0.25;
				f.rotation = Math.atan2(f.vy , f.vx);
           		this.fishArray.push(f)
           }
            


            


		},
		addToStage: function () {
		 	for(let i = 0; i < this.fishQ; i ++) {
		        this.cont.addChildAt(this.fishArray[i], 0);
		  	}
		},
		fish: function (texture, points, utils) {
			let stripCont = new PIXI.Container();
			stripCont.pivot.set(0.5);
			var strip = this.strip = new PIXI.mesh.Rope(texture, points);
			stripCont.addChild(strip);
			return stripCont;
		},
		animate: function () {

	

			this.points[0].y = this.utils.cosWave(0, 40, 0.01);
			this.points[3].y = this.utils.cosWave(0, -3, 0.01);

			 for(let i = 0; i < this.fishQ; i ++) {
			 	let f = this.fishArray[i];
			 	f.x += f.vx;
			 	f.y += f.vy;
			 	if(f.x < 0) {
			 		f.x = 0;
			 		f.vx *= -1;
			 		f.vy *= -1;
			 		f.rotation = Math.atan2(f.vy , f.vx)
			 	}
			 	if(f.x > this.wh.canvasWidth) {
			 		f.x = this.wh.canvasWidth;
			 		f.vx *= -1;
			 		f.vy *= -1;
			 		f.rotation = Math.atan2(f.vy , f.vx)
			 	}

			 	if(f.y < 0) {
			 		f.y = 0;
			 		f.vx *= -1;
			 		f.vy *= -1;
			 		f.rotation = Math.atan2(f.vy , f.vx)
			 	}
			 	if(f.y > this.wh.canvasHeight) {
			 		f.y = this.wh.canvasHeight;
			 		f.vx *= -1;
			 		f.vy *= -1;
			 		f.rotation = Math.atan2(f.vy , f.vx)
			 	}

			 }
			

						
		}

	}
}