import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
import HeroSwim from './swim/heroSwim';
import HeroJump from './jump/heroJump';
export default function () {
	return {
		segmentsQ: 5,
		cont: new PIXI.Container(),
		pos: [],
		radius: 2,
		storeRadius: 0,
		body: undefined,
		mode: undefined,
		vy: 0,
		vx: 0,
		bounce: 0,
		platforms: [],
		yOffset: 0,
		parentCont: undefined,
		utils: Utils,
		heroSwim: HeroSwim(),
		heroJump: HeroJump(),
		activeHero: undefined,
		init: function (wh, items, parentCont, spritesheet) {


			this.parentCont = parentCont;
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
            this.cont.x = this.canvasWidth / 2;
            this.cont.y = (this.canvasHeight / 2) - this.yOffset;
            this.segments = [];
            this.dragon = [];
            this.fish = [];
            this.spritesheet = spritesheet;

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

            parentCont.addChild(this.cont);
            this.heroSwim.init(this.cont, wh, spritesheet);
            this.heroJump.init(this.cont, wh, spritesheet);

            return this;
		},
		personMode: function () {
			this.cont.removeChildren();
			this.heroJump.addToStage();
			if(!this.body){
				this.body = new PIXI.Graphics();
				this.body.beginFill(0xFF0000).drawCircle(0,0,this.radius).endFill();
				this.body.pivot.set(0.5);
			}
			this.cont.radius = this.radius;
			this.cont.addChild(this.body);
			this.cont.y = (this.canvasHeight / 2) - this.yOffset;
			this.cont.x = this.canvasWidth / 2;
		},
		dragonMode: function () {
			
			this.segmentsQ = 10;
			if(!this.dragon.length){
				 for (let i = 0; i < this.segmentsQ; i++) {
	                let segment = this.bodySegment(25, 0xFFFF00, i * 25);
	                this.dragon.push(segment);
	                this.cont.addChild(segment);
	            }
			} else {
				 for (let i = 0; i < this.segmentsQ; i++) {
	                this.cont.addChild(this.dragon[i]);
	            }
			}

			if(!this.leftWing){
				 this.leftWing = new PIXI.Sprite(this.spritesheet.textures['leftWing.png']);
				 this.rightWing = new PIXI.Sprite(this.spritesheet.textures['rightWing.png']);
				 this.leftWing.pivot.x = 206;
				 this.leftWing.pivot.y = 54;
				 this.rightWing.pivot.y = 70;
				 this.wingCont = new PIXI.Container();
				 this.wingCont.y = 20;
				 this.wingCont.addChild(this.leftWing);
				 this.wingCont.addChild(this.rightWing);
			}
			this.cont.radius = 0;
			this.cont.addChildAt(this.wingCont, 0);
			this.segments = this.dragon;
		},
		resize: function (wh){
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
			this.cont.x = this.canvasWidth / 2;
            this.cont.y = this.canvasHeight / 2;
		},
		switchPlayer: function (string) {
			this.cont.removeChildren();
			this.mode = string;
			this.vx = 0;
			if(string === 'jump' || string === 'bounce') {
				this.personMode();
			} else if (string === 'swim') {
				this.cont.x = this.canvasWidth / 2;
                this.cont.y = this.canvasHeight / 2;
				//this.fishMode();
				this.activeHero = this.heroSwim;
				this.cont.addChild(this.heroSwim.cont);
			} else {
                this.cont.y = this.canvasHeight / 2;
                this.cont.x = this.canvasWidth / 2;
				this.dragonMode();
			}
			
		},
		bodySegment: function (radius, color, yVal, str) {
			let cont = new PIXI.Container();
            cont.radius = radius;
            cont.height = cont.radius * 4;
            cont.vx = 0;
            cont.vy = 0;
            cont.xpos = 0;
            cont.ypos = 0;
            //let b = new PIXI.Sprite.fromImage(str);
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
		}
	}
}