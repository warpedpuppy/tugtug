import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
export default function () {
	return {
		points: [],
		sharkPoints: [],
		imageWidth: 300,
		pointQ: 5,
		fishQ: 30,
		fishArray: [],
		sharkArray: [],
		utils: Utils,
		sharkCont: Assets.Container(),
		fishCont: Assets.Container(),
		sharkQ: 20,
		buffer: 10, 
		init: function (cont) {
			this.cont = cont;
			this.wh = this.utils.wh;
			this.fish = this.fish.bind(this);
			this.spritesheet = this.utils.spritesheet;
 			let steps = this.imageWidth / this.pointQ;
 			this.texture = this.spritesheet.textures['koi.png'];
		    this.sharkTexture = this.spritesheet.textures['shark.png'];
            for (var i = 0; i < this.pointQ; i++) {
			    this.points.push({x: i * steps, y:0});
			    this.sharkPoints.push({x: i * steps, y: 0});
			}

           for(let i = 0; i < this.fishQ; i ++) {
           		let f = this.fish(this.texture, this.points, this.utils);
           		f.x = this.utils.randomNumberBetween(0, this.wh.canvasWidth);
           		f.y = this.utils.randomNumberBetween(0, this.wh.canvasHeight);
           		f.vx = this.utils.randomNumberBetween(-3, 3);
				f.vy = this.utils.randomNumberBetween(-3, 3);
				f.alpha = 0.5;
				f.rotation = Math.atan2(f.vy , f.vx);
           		this.fishArray.push(f)
           		this.fishCont.addChild(f);
           }
            
            for(let i = 0; i < this.sharkQ; i ++) {
           		let f = this.fish(this.sharkTexture, this.sharkPoints, this.utils);
           		f.x = this.utils.randomNumberBetween(0, this.wh.canvasWidth);
           		f.y = this.utils.randomNumberBetween(0, this.wh.canvasHeight);
           		f.vx = this.utils.randomNumberBetween(-3, 3);
				f.vy = this.utils.randomNumberBetween(-3, 3);
				f.alpha = 0.25;
				f.rotation = Math.atan2(f.vy , f.vx);
				f.scale.set(this.utils.randomNumberBetween(3, 5))
           		this.fishArray.push(f);
           		this.sharkCont.addChild(f);
           }

            this.loopingQ = this.fishQ + this.sharkQ;


		},
		addToStage: function () {
		 	this.cont.addChildAt(this.fishCont, 3);
		  	this.cont.addChildAt(this.sharkCont, 0);
		},
		removeFromStage: function () {
			this.cont.removeChild(this.fishCont);
		  	this.cont.removeChild(this.sharkCont);
		},
		fish: function (texture, points, utils) {
			let stripCont = Assets.Container();
			stripCont.pivot.set(0.5);
			var strip = this.strip = Assets.Rope(texture, points);
			stripCont.addChild(strip);
			return stripCont;
		},
		animate: function () {

			this.points[0].y = this.utils.cosWave(0, 40, 0.01);
			this.points[3].y = this.utils.cosWave(0, -3, 0.01);
			this.sharkPoints[0].y = this.utils.cosWave(0, 40, 0.001);
			this.sharkPoints[3].y = this.utils.cosWave(0, -3, 0.001);

			for (let i = 0; i < this.loopingQ; i ++) {
			 	let f = this.fishArray[i];
			 	f.x += f.vx;
			 	f.y += f.vy;
			 	if(f.x < -f.width - this.buffer) {
			 		f.x += this.buffer;
			 		f.vx *= -1;
			 		f.vy *= -1;
			 		f.rotation = Math.atan2(f.vy , f.vx)
			 	} else if(f.x > this.utils.canvasWidth + f.width + this.buffer) {
			 		f.x -= this.buffer;
			 		f.vx *= -1;
			 		f.vy *= -1;
			 		f.rotation = Math.atan2(f.vy , f.vx)
			 	}

			 	if(f.y < -f.width - this.buffer) {
			 		f.y += this.buffer;
			 		f.vx *= -1;
			 		f.vy *= -1;
			 		f.rotation = Math.atan2(f.vy , f.vx)
			 	} else if(f.y > this.utils.canvasHeight + f.width+ this.buffer) {
			 		f.y -= this.buffer;
			 		f.vx *= -1;
			 		f.vy *= -1;
			 		f.rotation = Math.atan2(f.vy , f.vx)
			 	}
			}
			

						
		}

	}
}