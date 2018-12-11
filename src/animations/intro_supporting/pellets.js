export default function Pellets (PIXI, app, utils, wh) {
	return {
		pelletsArray: [],
		utils: utils,
		edgeBuffer: 200,
		init: function () {
			var pellets = new PIXI.particles.ParticleContainer(10000, {
			    scale: true,
			    position: true,
			    rotation: true,
			    uvs: true,
			    alpha: true
			});
			app.stage.addChild(pellets);
			this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 1000 : 100;
			console.log(this.pelletQ)
			 for(let i = 0; i < this.pelletQ; i ++ ){
            	let s =  PIXI.Sprite.fromImage('/bmps/pellet.png');
            	s.tint = Math.random() * 0xFFFFFF;
            	s.vx = 0;
            	s.vy = this.utils.randomNumberBetween(1,5); 
            	s.x = this.utils.randomNumberBetween(0, wh.canvasWidth);
            	s.y = this.utils.randomNumberBetween(0, wh.canvasHeight);

            	s.scale.set(this.utils.randomNumberBetween(0.05, 0.25));
            	pellets.addChild(s);
            	this.pelletsArray.push(s);
            }
            this.bottomEdge = wh.canvasHeight + this.edgeBuffer;
			this.rightEdge = wh.canvasWidth + this.edgeBuffer;

		},
		rotate: function (str, obj) {
			// let inc = 90;
			// if(str === 'right'){
			// 	this.idle = false;
			// 	this.radius += (Math.PI * 2) / inc;
				for(let i = 0; i < this.pelletQ; i++){
					//this.velocity = this.utils.randomNumberBetween(4, 6);
					//console.log(obj)
					this.pelletsArray[i].vx = obj.vx;
	            	this.pelletsArray[i].vy = obj.vy;
	            }
			// } else if(str === 'left') {
			// 	this.idle = false;
			// 	this.radius -= (Math.PI * 2) / inc;
			// 	for(let i = 0; i < this.pelletQ; i++){
			// 		this.velocity = this.utils.randomNumberBetween(4, 6);
			// 		this.pelletsArray[i].vx = obj.vx;
	  //           	this.pelletsArray[i].vy = obj.vy;
	  //           }
			// }
		},
		animate: function () {

			for(let i = 0; i < this.pelletQ; i++){
				this.pelletsArray[i].x += this.pelletsArray[i].vx;// * rate;
            	this.pelletsArray[i].y += this.pelletsArray[i].vy;// * rate;

            	if(this.pelletsArray[i].y > this.bottomEdge) {
            		this.pelletsArray[i].y = this.utils.randomNumberBetween(-this.edgeBuffer, 0);

            	} else if(this.pelletsArray[i].y < -this.edgeBuffer) {
            		this.pelletsArray[i].y = this.utils.randomNumberBetween(wh.canvasHeight, this.bottomEdge);
            	}

            	if(this.pelletsArray[i].x > this.rightEdge) {
            		this.pelletsArray[i].x = this.utils.randomNumberBetween(-this.edgeBuffer, 0);
            	} else if(this.pelletsArray[i].x < -this.edgeBuffer) {
            		this.pelletsArray[i].x = this.utils.randomNumberBetween(wh.canvasWidth, this.rightEdge);
            	}

			}
		}


	}
} 