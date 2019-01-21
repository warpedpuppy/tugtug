import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
export default function () {
	return {
		pills: [],
		edgeBuffer: 200,
		effect: false,
		lifeSpan: 100,
		counter: 0,
		utils: Utils,
		init: function (app, wh, effectFunction, cont, spritesheet) {
			this.effectFunction = effectFunction;
			var pills = new PIXI.particles.ParticleContainer(10000, {
			    scale: true,
			    position: true,
			    rotation: true,
			    uvs: true,
			    alpha: true
			});
			
	
			cont.addChild(pills);
			
			this.vx = this.utils.randomNumberBetween(1,5); 
            this.vy = this.utils.randomNumberBetween(1,5);

			this.pillQ = app.renderer instanceof PIXI.WebGLRenderer ? 4 : 1;

			 for(let i = 0; i < this.pillQ; i ++ ){
            	let s = new PIXI.Sprite(spritesheet.textures['star.png']);
            	s.anchor.set(0.5);
            	s.tint = Math.random() * 0xFFFFFF;
            	s.vx = 0;
            	s.vy = this.utils.randomNumberBetween(1,5); 
            	s.x = this.utils.randomNumberBetween(0, wh.canvasWidth);
            	s.y = this.utils.randomNumberBetween(0, wh.canvasHeight);
            	s.scale.set(this.utils.randomNumberBetween(0.25, 0.5));
            	s.rotate = this.utils.randomNumberBetween(-4, 4);
            	s.radius = s.width;
            	pills.addChild(s);
            	this.pills.push(s);
            }
            this.bottomEdge = wh.canvasHeight + this.edgeBuffer;
			this.rightEdge = wh.canvasWidth + this.edgeBuffer;
			this.wh = wh;
		},
		playEffect: function () {
			if(!this.effect) {
				this.effect = true;
				this.effectFunction();
			}
		},
		rotate: function (obj) {
				this.vx = obj.vx;
				this.vy = obj.vy;
		},
		resize: function (wh) {
			this.wh = wh;
			this.bottomEdge = this.wh.canvasHeight + this.edgeBuffer;
			this.rightEdge = this.wh.canvasWidth + this.edgeBuffer;
			for (let i = 0; i < this.pelletQ; i ++ ) {
            	this.pills[i].x = this.utils.randomNumberBetween(0, wh.canvasWidth);
            	this.pills[i].y = this.utils.randomNumberBetween(0, wh.canvasHeight);
            }
		},
		animate: function (vx, vy) {

			for(let i = 0; i < this.pillQ; i++){
				let p = this.pills[i];
				p.x -= vx || this.vx;
             	p.y -= vy || this.vy;
             	p.rotation += this.utils.deg2rad(p.rotate);

            	if(p.y > this.bottomEdge) {
            		p.y = this.utils.randomNumberBetween(-this.edgeBuffer, 0);

            	} else if(p.y < -this.edgeBuffer) {
            		p.y = this.utils.randomNumberBetween(this.wh.canvasHeight, this.bottomEdge);
            	}

            	if(p.x > this.rightEdge) {
            		p.x = this.utils.randomNumberBetween(-this.edgeBuffer, 0);
            	} else if(p.x < -this.edgeBuffer) {
            		p.x = this.utils.randomNumberBetween(this.wh.canvasWidth, this.rightEdge);
            	}
            	// let c1 = {radius: 20, x: (this.wh.canvasWidth / 2), y: (this.wh.canvasHeight / 2)};

            	// if(!this.effect && this.utils.circleToCircleCollisionDetection(c1, this.pills[i])) {
            	// 	this.playEffect();
            	// } else if(this.effect === true){
            	// 	this.counter ++;

            	// 	if (this.counter >= this.lifeSpan){
            	// 		this.effectFunction();
            	// 		this.effect = false;
            	// 		this.counter = 0;
            	// 	}
            	// }

			}

		}
	}
	
}