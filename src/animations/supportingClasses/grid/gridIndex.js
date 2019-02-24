import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
//import Config from './animationsConfig';
export default {
		cont: Assets.Container(),
		blockWidth: 500,
		blockHeight: 500,
		blocks: {},
		utils: Utils,
		colQ: 10,
		rowQ: 10,
		buffer: 10,
		init: function (parentCont) {
			let hero = this.utils.hero;
			//console.log(hero.cont.x, hero.cont.y)

			//so the goal is the get from the x and y value the i and j value
			let iStart = Math.ceil(hero.cont.x / this.blockHeight);
			let jStart = Math.ceil(hero.cont.y / this.blockWidth);

			//console.log(iStart, jStart);

			this.parentCont = parentCont;
			let counter = 0;
			for (let i = 0; i < this.colQ; i ++) {
				this.blocks[i] = [];
				for (let j = 0; j < this.rowQ; j ++) {
					let bool = (counter % 3)?false:true;
					let b = this.block(bool);
					b.covered = bool;
					b.x = j * this.blockWidth;
					b.y = i * this.blockHeight;
					let text = Assets.BitmapText(`${i}, ${j}`)
					text.x = b.x;
					text.y = b.y;
					this.cont.addChild(text);
					this.cont.addChild(b);
					this.blocks[i][j] = b;
					counter ++;
				}
			}
			//console.log(this.blocks)
			this.setLimits();
			this.c = Assets.Graphics();
			this.c.extant= false;
			this.utils.app.stage.addChild(this.c)
			this.d = Assets.Graphics();
			this.utils.app.stage.addChild(this.d)
			this.e = Assets.Graphics();
			this.utils.app.stage.addChild(this.e)
			this.boxCircles = [];
		},
		setAction: function (action) {
			this.action = action;
		},
		block: function (bool) {
			let b = Assets.Graphics();
			b.lineStyle(3, 0x000000, 1).moveTo(0,0).lineTo(this.blockWidth, 0).lineTo(this.blockWidth, this.blockHeight).lineTo(0,this.blockHeight).lineTo(0,0);
			if (bool) {
				b.beginFill(0xFFFFFF).drawRect(0,0,this.blockWidth,this.blockHeight).endFill();
			}
			return b;
		},
		addToStage: function (index) {
			this.parentCont.addChildAt(this.cont, index)
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont)
		},
		setLimits: function () {
			this.hw = (this.utils.canvasWidth / 2);
			this.hh = (this.utils.canvasHeight / 2);
			this.rightBorder = (this.colQ * this.blockWidth) - this.hw;
			this.bottomBorder = (this.rowQ * this.blockHeight) - this.hh;
		},
		resize: function () {
			this.setLimits();
		},
		currentSquare: function () {
			let halfCanvasWidth = (this.utils.canvasWidth / 2),
			    halfCanvasHeight = (this.utils.canvasHeight / 2),
			    iVal = Math.floor((halfCanvasHeight - this.cont.y) / this.blockHeight),
			    jVal = Math.floor((halfCanvasWidth - this.cont.x) / this.blockWidth);
			//console.log(iVal,jVal);
			//console.log(this.blocks[iVal][jVal].covered)
			//test if square is covered
			return this.blocks[iVal][jVal]
		},
		test1: function () {
//console.log('hit!');
				let globalPoint = this.currentSquare().toGlobal(this.utils.app.stage, undefined, true);

				// create a circle at hit point
				let heroPoint = { 
					x: this.utils.canvasWidth / 2, 
					y: this.utils.canvasHeight / 2
				}

			
				this.c.x = globalPoint.x + (this.blockWidth / 2);
				this.c.y = globalPoint.y + (this.blockWidth / 2);
				let cPoint = {x: this.c.x, y: this.c.y };

				let radius = this.utils.distanceAndAngle(heroPoint, cPoint)[0] - 50;
				let halfDist = radius / 4 ;
			
				this.c.clear();
				this.c.alpha = 0.5;
				this.c.beginFill(0x000000).drawCircle(0,0,radius).endFill();

				this.e.clear();
				this.e.alpha = 0.5;
				this.e.beginFill(0xFF0000).drawCircle(0,0,50).endFill();
				this.e.x = heroPoint.x;
				this.e.y = heroPoint.y;
				
				//console.log(radius)
				 this.d.clear();
				 this.d.lineStyle(3, 0x000000, 1).moveTo(this.c.x, this.c.y).lineTo(heroPoint.x, heroPoint.y);


				let heroCircle = {
							x: heroPoint.x,
							y: heroPoint.y,
							radius: 50,
							r: 50,
							vx: 0,
							vy: 0
						}

				let boxCircle = {
								x: this.c.x,
								y: this.c.y,
								radius: radius,
								r: radius,
								vx: this.action.vx,
								vy: this.action.vy
							}
				
	
				this.utils.adjustPositions(heroCircle, boxCircle, 10);
	       		this.utils.resolveCollision(heroCircle, boxCircle);
		
		},
		test2: function (){
			let globalPoint = this.currentSquare().toGlobal(this.utils.app.stage, undefined, true);
			this.c.x = globalPoint.x + (this.blockWidth / 2);
			this.c.y = globalPoint.y + (this.blockWidth / 2);
			let cPoint = {x: this.c.x, y: this.c.y };
			let heroPoint = { 
					x: this.utils.canvasWidth / 2, 
					y: this.utils.canvasHeight / 2
				}
			let radius = this.utils.distanceAndAngle(heroPoint, cPoint)[0] - 50;
			let circle = Assets.Graphics();
			circle.beginFill(0x000000).drawCircle(0,0,radius).endFill();
			circle.x = this.c.x;
			circle.y = this.c.y;
			this.cont.addChild(circle)
		},
		animate: function (vx, vy) {
			

			if (this.currentSquare().covered) {
				this.test1();
			} else {
				this.boxCircle = undefined;
				this.c.clear();
				this.d.clear();
			}

			
			
			
			//boundaries
			//console.log(this.cont.x, hw);
			this.cont.x -= vx;
			if (this.cont.x > this.hw) {
			 	this.cont.x = this.hw - this.buffer;
			 	this.action.vx *= -1;
			} else if (this.cont.x < -this.rightBorder) {
				this.cont.x = -this.rightBorder + this.buffer;
			 	this.action.vx *= -1;
			}

			this.cont.y -= vy;
			if (this.cont.y > this.hh) {
			 	this.cont.y = this.hh - this.buffer;
			 	this.action.vy *= -1;
			} else if (this.cont.y < -this.bottomBorder) {
				this.cont.y = -this.bottomBorder + this.buffer;
			 	this.action.vy *= -1;
			}
			


		}
	
}