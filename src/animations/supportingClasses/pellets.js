import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
export default function Pellets (app, wh, cont) {
	return {
		pelletsArray: [],
		utils: Utils(),
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
			
			this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 100 : 10;
			 for(let i = 0; i < this.pelletQ; i ++ ){
			 	this.pelletTexture =  new PIXI.Texture.fromImage('/bmps/pellet.png');
            	this.starTexture =  new PIXI.Texture.fromImage('/bmps/star.png');
            	let s = new PIXI.Sprite(this.pelletTexture);
            	s.tint = Math.random() * 0xFFFFFF;
            	s.vx = this.utils.randomNumberBetween(1,5); 
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
		change: function () {
			if(this.pelletsArray[0].texture === this.pelletTexture){
				for(let i = 0; i < this.pelletQ; i ++ ){
					this.pelletsArray[i].texture = this.starTexture; 
					this.pelletsArray[i].scale.set(this.utils.randomNumberBetween(0.005, 0.025)); 
					this.pelletsArray[i].tint = 0xFFFF00;
				}
			} else {
				for(let i = 0; i < this.pelletQ; i ++ ){
					this.pelletsArray[i].texture = this.pelletTexture; 
					this.pelletsArray[i].scale.set(this.utils.randomNumberBetween(0.05, 0.25)); 
					this.pelletsArray[i].tint = Math.random() * 0xFFFFFF;
				}
			}
			
		},
		resize: function (wh) {
			this.wh = wh;
			this.bottomEdge = this.wh.canvasHeight + this.edgeBuffer;
			this.rightEdge = this.wh.canvasWidth + this.edgeBuffer;
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
		changeVY: function (stop) {
			// for(let i = 0; i < this.pelletQ; i++){
			// 	this.pelletsArray[i].vy = (stop)?0:this.utils.randomNumberBetween(1,5); 
			// }
		},
		changeVX: function (stop) {
			// for(let i = 0; i < this.pelletQ; i++){
			// 	this.pelletsArray[i].vx = (stop)?0:this.utils.randomNumberBetween(1,5); 
			// }
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