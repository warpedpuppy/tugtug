import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
export default function Hero (wh, items) {
	return {
		segmentsQ: 5,
		cont: new PIXI.Container(),
		pos: [],
		radius: 0,
		storeRadius: 0,
		body: undefined,
		mode: undefined,
		gravity: 0.3,
		vy: 0,
		vx: 0,
		bounce: 0,
		platforms: [],
		radius: 20,
		yOffset: 0,
		parentCont: undefined,
		init: function (parentCont) {
			this.parentCont = parentCont;
			this.utils = Utils();
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
            this.cont.x = this.canvasWidth / 2;
            this.cont.y = (this.canvasHeight / 2) - this.yOffset;
            this.segments = [];
            this.dragon = [];
            this.fish = [];

            this.bounce = this.utils.randomNumberBetween(-.6, -.9);
            this.vy = this.utils.randomNumberBetween(3,5);

            if(items){
            	  for(let i = 0; i < items.length; i ++){
	            	var item = PIXI.Sprite.fromImage(items[i].url);
	            	if(items[i].active) {
		            	this.cont.addChild(item);
		            }
	            }
            }
          
		},
		move: function (str) {

			if(str === 'left'){
				this.vx = -3;
			} else if (str === 'right'){
				this.vx = 3;
			} else {
				this.vx = 0;
			}
		},
		jump: function () {
			if(this.mode === 'person'){
				this.vy = this.utils.randomNumberBetween(-5,-3);
			}
		},
		setPlatforms: function (arr) {
			this.platforms = arr;
		},
		assignStage: function (stage) {
			this.stage = stage;
		},
		personMode: function () {
			this.cont.removeChildren();
			if(!this.body){
				this.body = new PIXI.Graphics();
				this.body.beginFill(0xFF0000).drawCircle(0,0,this.radius).endFill();
				this.body.pivot.set(0.5);
			}
			this.cont.radius = this.radius;
			this.cont.addChild(this.body);

		},
		fishMode: function () {	
			this.cont.removeChildren();
			this.segmentsQ = 5;
			if(!this.fish.length){
				 for (let i = 0; i < this.segmentsQ; i++) {
	                let segment = this.bodySegment(25, 0xFFFF00, i*25);
	                this.fish.push(segment);
	                this.cont.addChild(segment);
	            }
			} else {
				 for (let i = 0; i < this.segmentsQ; i++) {
	                this.cont.addChild(this.fish[i]);
	            }
			}

			this.segments = this.fish;
			
		},
		dragonMode: function () {
			this.cont.removeChildren();
			this.segmentsQ = 10;
			if(!this.dragon.length){
				 for (let i = 0; i < this.segmentsQ; i++) {
	                let segment = this.bodySegment(25, 0xFFFF00, i*25);
	                this.dragon.push(segment);
	                this.cont.addChild(segment);
	            }
			} else {
				 for (let i = 0; i < this.segmentsQ; i++) {
	                this.cont.addChild(this.dragon[i]);
	            }
			}

			this.segments = this.dragon;
		},
		switchPlayer: function (string) {
			this.mode = string;
			this.vx = 0;
			if(string === 'person') {
                this.cont.y = (this.canvasHeight / 2) - this.yOffset;
				this.cont.x = this.canvasWidth / 2;
				this.personMode();
			} else if (string === 'fish') {
				this.cont.x = this.canvasWidth / 2;
                this.cont.y = this.canvasHeight / 2;
				this.fishMode();
			} else {
                this.cont.y = this.canvasHeight / 2;
                this.cont.x = this.canvasWidth / 2;
				this.dragonMode();
			}
			
		},
		bodySegment: function (radius, color, yVal) {
			let cont = new PIXI.Container();
            cont.radius = radius;
            cont.height = cont.radius * 4;
            cont.vx = 0;
            cont.vy = 0;
            cont.xpos = 0;
            cont.ypos = 0;

            let b = new PIXI.Graphics();
            b.y = yVal;
            let triangleWidth = 25,
		        triangleHeight = triangleWidth,
		        triangleHalfway = triangleWidth/2;

		    //draw triangle 
		    b.beginFill(0xFF0000, 1);
		    b.lineStyle(0, 0xFF0000, 1);
		    b.moveTo(triangleWidth, 0);
		    b.lineTo(triangleHalfway, triangleHeight); 
		    b.lineTo(0, 0);
		    b.lineTo(triangleHalfway, 0);
		    b.endFill();
		    b.pivot.x = b.pivot.y = 12.5;
		    b.rotation = this.utils.deg2rad(180);
            cont.addChild(b);
            cont.body = b;
            return cont;
		},
		rotateChain: function () {
			
			if (this.mode === 'fish' || this.mode === 'dragon') {
				if(!this.rotateBoolean)this.radius = this.utils.cosWave(this.storeRadius, 0.15, 0.01);

		        this.pos.push(this.radius);
		        this.increment = 5;
		        let maxLength = this.increment * this.segmentsQ;
		        if (this.pos.length > maxLength) {
		            this.pos = this.pos.slice(-maxLength);
		        }

		        this.segments[0].rotation = this.radius;

		        for (let i = 1; i < this.segmentsQ; i++) {
		            let index = this.pos.length - (i * this.increment);
		            if (this.pos.length >= index) {
		              //console.log(this.pos[index]);
		              this.segments[i].rotation = this.pos[index];
		            }
		        }
			} else {
				//this.vy += this.gravity;
				// this.cont.y += this.vy;
				// this.cont.x += this.vx;

				// this.stage.y -= this.vy;
				// this.stage.x -= this.vx;


				// for(let i = 0; i < this.platforms.length; i++){
				// 	let globalPoint = this.platforms[i].toGlobal(this.stage, undefined, true);
				// 	//console.log(globalPoint)
				// 	let tempRect = new PIXI.Rectangle(globalPoint.x, globalPoint.y, this.platforms[i].width, this.platforms[i].height)

				// 	if(this.utils.circleRectangleCollision(this.cont, tempRect)){
				// 		this.stage.y += 1;
				// 		this.vy *= -1;
				// 	}
				// }
				// // if(this.cont.y > (this.canvasHeight - this.cont.radius)) {
				// // 	this.cont.y -= 1;
				// // 	this.vy *= -1;
				// // }
				// if(this.cont.x <= this.cont.radius){
				// 	this.cont.x +=1;
				// 	this.vx *=-1;
				// }
				// if(this.cont.x >= (this.canvasWidth - this.cont.radius)){
				// 	this.cont.x +=1;
				// 	this.vx *=-1;
				// }

			}
			
        },
		animate: function () {
			this.rotateChain();
		}
	}
}