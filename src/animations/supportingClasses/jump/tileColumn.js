import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		cont: undefined,
		colSpacing: 200,
		cols: {},
		bricks: [],
		utils: Utils,
		activeBrick: undefined,
		brickHeight: 50,
		fallSpeed: undefined,
		totalHeight: 0,
		brickHeight: 0,
		counter: 0,
		curve: undefined,
		curveCounter: 0,
		straightQ: 0,
		curveQ: 0,
		testCounter: 0,
		straightQs: [4, 5],
		curvedQs: [40, 80],
		startCurveAngle: 10, 
		curves: [45, -45, 135, -135],
		spriteCounter: 0,
		nextRed: 0,
		contObject: {},
		objectPool: [],
		objectPoolCounter: 0,
		width: 0,
		height:0,
		interval: 0, 
		colWidth: 5,
		colors: [0xFF00FF, 0xFF0000, 0xFFFF00, 0xFF9900, 0x33FF00],
		colorCounter: 0,
		init: function (app, parentCont, wh, spritesheet, quadrant, action) {
			this.quadrant = quadrant;
			this.curve = this.curves[Math.floor(Math.random()*4)];
			this.app = app;
			
			this.goldTile = spritesheet.textures['tile.png'];
			this.interval = this.utils.randomIntBetween(0, 2);
			this.parentCont = parentCont;
			this.wh = wh;
			this.spritesheet = spritesheet;
			

			this.tileQ = app.renderer instanceof PIXI.WebGLRenderer ? 150 : 10;
			this.cont = new PIXI.particles.ParticleContainer(this.tileQ, {
			    scale: true,
			    position: true,
			    rotation: true,
			    uvs: true,
			    alpha: true
			});


			for(let i = 0; i < this.tileQ; i ++){
				let s = this.brick();
				s.alpha = 0.5;
				s.tint = this.colors[this.colorCounter];
				this.colorCounter ++;
				if (this.colorCounter > this.colors.length - 1)this.colorCounter = 0;
				this.objectPool.push(s);
			}

		

			let s = this.objectPool[this.objectPoolCounter];
			this.objectPoolCounter ++;
			let newPos = this.newXY();
			s.y = newPos.x;
			s.x = newPos.y;
			this.cont.addChild(s);

			this.curveQ = this.utils.randomIntBetween(this.curvedQs[0], this.curvedQs[1]);


		},
		brick: function () {
			let s = new PIXI.Sprite(this.goldTile);
			s.counter = 0;
			s.curveCounter = 0;
			this.brickHeight = s.height;
			s.anchor.x = 0.5;
			s.anchor.y = 1;
			return s;
		},
		newBrick: function () {

			let s = this.objectPool[this.objectPoolCounter];
			this.objectPoolCounter ++;
			if(this.objectPoolCounter > this.objectPool.length - 1){
				this.objectPoolCounter = 0;
			}

			this.curveCounter ++;
			this.curve *= 1.05;
			let deg = this.utils.deg2rad(this.curve)
			s.rotation = deg;
			if (this.curveCounter > this.curveQ ) {
				this.curve = this.curves[Math.floor(Math.random()*4)];
				this.curveCounter = 0;
				this.curveQ = this.utils.randomIntBetween(this.curvedQs[0], this.curvedQs[1]);
				let newPos = this.newXY();
				s.y = newPos.y;
				s.x = newPos.x;
			}

		
			let previousYVal = this.objectPool[this.objectPool.length -1].y;
		
			let prevIndex = (this.objectPoolCounter > 1)?this.objectPoolCounter - 2: this.objectPool.length - 1;
			let prevX = this.objectPool[prevIndex].x;
			let prevY = this.objectPool[prevIndex].y;
			let prevRotation = this.objectPool[prevIndex].rotation;
			let newX = prevX + (s.height * Math.sin(prevRotation));
			let newY = prevY - (s.height * Math.cos(prevRotation));
			s.x = newX;
			s.y = newY;

			let buffer = 1;
			if(this.objectPoolCounter === 0 ||
				s.y < -buffer || 
				s.x < -buffer || 
				s.x > this.wh.canvasWidth + buffer || 
				s.y > this.wh.canvasHeight + buffer
				){
				let newPos = this.newXY();
				s.x = newPos.x;
				s.y = newPos.y;
			}
			this.cont.addChild(s);

			
		},
		newXY: function () {
			let buffer = 0;
			let perc = 0.5;
			if(this.quadrant === "TL"){
				return {
					x: this.utils.randomNumberBetween(buffer, this.wh.canvasWidth * perc),
					y: this.utils.randomNumberBetween(buffer, this.wh.canvasHeight * perc),
				}
			} else if (this.quadrant == "TR") {
				return {
					x: this.utils.randomNumberBetween(this.wh.canvasWidth * perc, this.wh.canvasWidth),
					y: this.utils.randomNumberBetween(buffer, this.wh.canvasHeight * perc),
				}
			} else if (this.quadrant == "BL") {
				return {
					x: this.utils.randomNumberBetween(buffer, this.wh.canvasWidth * perc),
					y: this.utils.randomNumberBetween(this.wh.canvasHeight * perc, this.wh.canvasHeight),
				}
			} else if (this.quadrant == "BR") {
			
				return {
					x: this.utils.randomNumberBetween(this.wh.canvasWidth * perc, this.wh.canvasWidth),
					y: this.utils.randomNumberBetween(this.wh.canvasHeight * perc, this.wh.canvasHeight),
				}
			}
			
		},
		addToStage: function () {
			this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont);

		},
		resize: function () {

		},
		animate: function () {
			this.testCounter ++;
			if(this.testCounter % this.interval === 0)
			this.newBrick();
		
		}
	}
}