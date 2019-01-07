import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
export default function MagicPills(app, wh, effectFunction) {
	return {
		pills: [],
		edgeBuffer: 200,
		effect: false,
		lifeSpan: 100,
		counter: 0,
		init: function () {
			this.utils = Utils();

			var pills = new PIXI.particles.ParticleContainer(10000, {
			    scale: true,
			    position: true,
			    rotation: true,
			    uvs: true,
			    alpha: true
			});
			
		
			app.stage.addChild(pills);
			
			
			this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 1 : 1;

			 for(let i = 0; i < this.pelletQ; i ++ ){
            	let s =  PIXI.Sprite.fromImage('/bmps/star.png');
            	s.anchor.x = s.width / 2;
            	s.tint = Math.random() * 0xFFFFFF;
            	s.vx = 0;
            	s.vy = this.utils.randomNumberBetween(1,5); 
            	s.x = wh.canvasWidth / 2;
            	s.y = this.utils.randomNumberBetween(0, wh.canvasHeight);
            	s.scale.set(this.utils.randomNumberBetween(0.05, 0.25));
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
				effectFunction();
			}
		},
		resize: function (wh) {
			this.wh = wh;
			this.bottomEdge = this.wh.canvasHeight + this.edgeBuffer;
			this.rightEdge = this.wh.canvasWidth + this.edgeBuffer;
			for(let i = 0; i < this.pelletQ; i ++ ){
            	this.pills[i].x = this.wh.canvasWidth / 2;
            	this.pills[i].y = this.utils.randomNumberBetween(0, this.wh.canvasHeight);
            }
		},
		animate: function () {

			for(let i = 0; i < this.pelletQ; i++){
				this.pills[i].x += this.pills[i].vx;
            	this.pills[i].y += this.pills[i].vy;

            	if(this.pills[i].y > this.bottomEdge) {
            		this.pills[i].y = this.utils.randomNumberBetween(-this.edgeBuffer, 0);

            	} else if(this.pills[i].y < -this.edgeBuffer) {
            		this.pills[i].y = this.utils.randomNumberBetween(this.wh.canvasHeight, this.bottomEdge);
            	}

            	if(this.pills[i].x > this.rightEdge) {
            		this.pills[i].x = this.utils.randomNumberBetween(-this.edgeBuffer, 0);
            	} else if(this.pills[i].x < -this.edgeBuffer) {
            		this.pills[i].x = this.utils.randomNumberBetween(this.wh.canvasWidth, this.rightEdge);
            	}
            	let c1 = {radius: 20, x: (this.wh.canvasWidth / 2), y: (this.wh.canvasHeight / 2)};

            	if(!this.effect && this.utils.circleToCircleCollisionDetection(c1, this.pills[i])) {
            		this.playEffect();
            	} else if(this.effect === true){
            		this.counter ++;

            		if (this.counter >= this.lifeSpan){
            			effectFunction();
            			this.effect = false;
            			this.counter = 0;
            		}
            	}

			}

		}
	}
}