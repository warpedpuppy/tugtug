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
		curve: 15,
		curveCounter: 0,
		straightQ: 0,
		curveQ: 0,
		testCounter: 0,
		straightQs: [70, 80],
		curvedQs: [40, 160],
		startCurveAngle: 10, 
		spriteCounter: 0,
		nextRed: 0,
		contObject: {},
		objectPool: [],
		objectPoolCounter: 0,
		width: 0,
		height:0,
		interval: 0, 
		init: function (app, parentCont, wh, spritesheet, startX) {
			this.width = this.utils.randomIntBetween(2, 3);
			this.height = this.utils.randomIntBetween(4, 10);
			this.interval = this.utils.randomIntBetween(0, 5);
			this.parentCont = parentCont;
			this.wh = wh;
			this.spritesheet = spritesheet;
			this.startX = startX;
			this.cont = new PIXI.particles.ParticleContainer(10000, {
			    scale: true,
			    position: true,
			    rotation: true,
			    uvs: true,
			    alpha: true
			});
			this.brick = this.brick.bind(this);
			let max = this.utils.randomIntBetween(20, 500);

			this.tileQ = app.renderer instanceof PIXI.WebGLRenderer ? max : 10;
			for(let i = 0; i < this.tileQ; i ++){
				let s = this.brick();
				this.objectPool.push(s);
			}

		

			let s = this.objectPool[this.objectPoolCounter];
			this.objectPoolCounter ++;
			
			this.bricks.push(s);
			this.cont.addChild(s);
			//this.newBrick();
			this.straightQ = this.utils.randomIntBetween(this.straightQs[0], this.straightQs[1]);
			this.curveQ = this.utils.randomIntBetween(this.curvedQs[0], this.curvedQs[1]);

			
			this.nextRed = this.utils.randomIntBetween(0,100);
			this.cont.alpha = 0.25;

		},
		brick: function () {
			//let cont = new PIXI.Container();
			let s = new PIXI.Sprite(this.spritesheet.textures['goldTile.png']);

			if(this.bricks.length === this.nextRed) {
				s = new PIXI.Sprite(this.spritesheet.textures['redTile.png']);
				this.nextRed = this.bricks.length + this.utils.randomIntBetween(0,100);
			}


			s.width = this.width;//5;
			s.counter = 0;
			s.curveCounter = 0;
			s.height = this.height;//10;
			this.brickHeight = s.height;
			s.anchor.x = 0.5;
			s.anchor.y = 1;
			//cont.addChild(s);
			return s;
		},
		newBrick: function () {
			//console.log('new brick')

			let s = this.objectPool[this.objectPoolCounter];
			this.objectPoolCounter ++;
			if(this.objectPoolCounter > this.objectPool.length - 1)this.objectPoolCounter = 0;

			this.counter ++;
			if(this.counter > this.straightQ){
				this.curveCounter ++;
				this.curve *= 1.05;
				let deg = this.utils.deg2rad(this.curve)
				s.rotation = deg;
				if(this.curveCounter > this.curveQ ){
					this.curve = (Math.floor(Math.random()*2))?-this.startCurveAngle:this.startCurveAngle;
					this.counter = 0;
					this.curveCounter = 0;
					this.straightQ = this.utils.randomIntBetween(this.straightQs[0], this.straightQs[1]);
					this.curveQ = this.utils.randomIntBetween(this.curvedQs[0], this.curvedQs[1]);

				}
			}
			
			this.totalHeight += this.brickHeight;
			this.fallSpeed = this.utils.randomNumberBetween(1, 2);
			let previousYVal = this.bricks[this.bricks.length -1].y;
		

			if (!this.activeBrick) {
				let newPos = this.newXY();
				s.y = s.dest = newPos.y;
				s.x = newPos.x;
				this.cont.addChild(s);
			} else {
				s.dest = -this.brickHeight;
				s.y = s.dest;
				//calculate x and y
				let prevX = this.bricks[this.bricks.length - 1].x;
				let prevY = this.bricks[this.bricks.length - 1].y;
				let prevRotation = this.bricks[this.bricks.length - 1].rotation;
				//console.log(prevRotation, s.height)
				let newX = prevX + (s.height * Math.sin(prevRotation));
				let newY = prevY - (s.height * Math.cos(prevRotation));
				s.x = newX;
				s.y = newY;

				if(s.y < 0 || 
					s.x < 0 || 
					s.x > this.wh.canvasWidth || 
					s.y > this.wh.canvasHeight
					){
					let newPos = this.newXY();
					s.y = newPos.x;//this.wh.canvasHeight;
					s.x = newPos.y;//this.startX;//this.utils.randomNumberBetween(0, this.wh.canvasWidth);
				}
				this.cont.addChild(s);
			}
			this.activeBrick = s;
			this.bricks.push(s);
		},
		newXY: function () {
			let buffer = 100;
			return {
				x: this.utils.randomNumberBetween(buffer, this.wh.canvasWidth - buffer),
				y: this.utils.randomNumberBetween(buffer, this.wh.canvasHeight - buffer),
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