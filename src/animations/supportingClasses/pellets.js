import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
export default function () {
	return {
		pelletsArray: [],
		utils: Utils,
		edgeBuffer: 200,
		activeMode: undefined,
		init: function (app, wh, cont, str, spritesheet) {
			this.activeMode = str;

			var pellets = new PIXI.particles.ParticleContainer(10000, {
			    scale: true,
			    position: true,
			    rotation: true,
			    uvs: true,
			    alpha: true
			});
			
			cont.addChild(pellets);
				
			this.vx = this.utils.randomNumberBetween(1,5); 
            this.vy = this.utils.randomNumberBetween(1,5); 
			
			this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 100 : 10;
			for(let i = 0; i < this.pelletQ; i ++ ){
			 	this.pelletTexture = spritesheet.textures['pellet.png'];
            	this.starTexture = spritesheet.textures['star.png'];
            	let s = new PIXI.Sprite(this.pelletTexture);
            	s.tint = Math.random() * 0xFFFFFF;
            	
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
		changeMode: function (str) {
			this.activeMode = str;
		},
		change: function () {
			if(this.pelletsArray[0].texture === this.pelletTexture){
				for(let i = 0; i < this.pelletQ; i ++ ){
					this.pelletsArray[i].texture = this.starTexture; 
					this.pelletsArray[i].scale.set(this.utils.randomNumberBetween(0.005, 0.025)); 
					this.pelletsArray[i].tint = 0xFFFF00;
				}
			} else {
				for (let i = 0; i < this.pelletQ; i ++ ) {
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
			for (let i = 0; i < this.pelletQ; i ++ ) {
            	this.pelletsArray[i].x = this.utils.randomNumberBetween(0, this.wh.canvasWidth);
            	this.pelletsArray[i].y = this.utils.randomNumberBetween(0, this.wh.canvasHeight);
            }
		},
		rotate: function (obj) {
			this.vx = obj.vx;
			this.vy = obj.vy;
		
		},
		animate: function (vx, vy) {
			for (let i = 0; i < this.pelletQ; i++) {
				if (this.activeMode === 'bounce') {
					this.pelletsArray[i].y -= vy;// * rate;
					this.pelletsArray[i].x -= vx;// * rate;
				} else {
					this.pelletsArray[i].x -= this.vx;// * rate;
		       		this.pelletsArray[i].y -= this.vy;// * rate;
				}
			
            	if (this.pelletsArray[i].y > this.bottomEdge) {
            		this.pelletsArray[i].y = this.utils.randomNumberBetween(-this.edgeBuffer, 0);

            	} else if (this.pelletsArray[i].y < -this.edgeBuffer) {
            		this.pelletsArray[i].y = this.utils.randomNumberBetween(this.wh.canvasHeight, this.bottomEdge);
            	}

            	if (this.pelletsArray[i].x > this.rightEdge) {
            		this.pelletsArray[i].x = this.utils.randomNumberBetween(-this.edgeBuffer, 0);
            	} else if (this.pelletsArray[i].x < -this.edgeBuffer) {
            		this.pelletsArray[i].x = this.utils.randomNumberBetween(this.wh.canvasWidth, this.rightEdge);
            	}
			}
			
		}

}
	
} 