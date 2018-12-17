export default function Pellets (PIXI, app, utils, wh, cont) {
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
			
			if(!cont){
				app.stage.addChild(pellets);
			} else {
				cont.addChild(pellets);
			}
			
			this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 1000 : 100;
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
			this.wh = wh;
		},
		resize: function (wh) {
			this.wh = wh;
			this.bottomEdge = this.wwh.canvasHeight + this.edgeBuffer;
			this.rightEdge = this.wwh.canvasWidth + this.edgeBuffer;
			for(let i = 0; i < this.pelletQ; i ++ ){
            	this.pelletsArray[i].x = this.utils.randomNumberBetween(0, this.wh.canvasWidth);
            	this.pelletsArray[i].y = this.utils.randomNumberBetween(0, this.wh.canvasHeight);
            }
		},
		rotate: function (str, obj) {
			for(let i = 0; i < this.pelletQ; i++){
				this.pelletsArray[i].vx = obj.vx;
            	this.pelletsArray[i].vy = obj.vy;
            }
		},
		animate: function () {

			for(let i = 0; i < this.pelletQ; i++){
				this.pelletsArray[i].x += this.pelletsArray[i].vx;// * rate;
            	this.pelletsArray[i].y += this.pelletsArray[i].vy;// * rate;

            	if(this.pelletsArray[i].y > this.bottomEdge) {
            		this.pelletsArray[i].y = this.utils.randomNumberBetween(-this.edgeBuffer, 0);

            	} else if(this.pelletsArray[i].y < -this.edgeBuffer) {
            		this.pelletsArray[i].y = this.utils.randomNumberBetween(this.wh.canvasHeight, this.bottomEdge);
            	}

            	if(this.pelletsArray[i].x > this.rightEdge) {
            		this.pelletsArray[i].x = this.utils.randomNumberBetween(-this.edgeBuffer, 0);
            	} else if(this.pelletsArray[i].x < -this.edgeBuffer) {
            		this.pelletsArray[i].x = this.utils.randomNumberBetween(this.wh.canvasWidth, this.rightEdge);
            	}

			}
		}


	}
} 