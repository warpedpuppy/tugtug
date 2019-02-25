import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
//import Config from './animationsConfig';
export default {
		cont: Assets.Container(),
		blockWidth: 500,
		blockHeight: 500,
		blocks: {},
		utils: Utils,
		colQ: 4,
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
			for (let i = 0; i < this.rowQ; i ++) {
				this.blocks[i] = [];
				for (let j = 0; j < this.colQ; j ++) {
					let bool = (counter % 6)?false:true;
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
		placeOnStage: function (i, j) {
			//we know 1,1 is free, so place that beneath the hero
			i++;
			j++;
			let halfWidth = this.utils.canvasWidth / 2;
			let halfHeight = this.utils.canvasHeight / 2;
			this.cont.x = halfWidth - (i * this.blockWidth) + (this.blockWidth /2);
			this.cont.y = halfHeight - (j * this.blockHeight) + (this.blockHeight /2);
		},
		addToStage: function (index) {
			
			this.placeOnStage(1,1);
			this.parentCont.addChildAt(this.cont, index)
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont)
		},
		setLimits: function () {
			this.boardWidth = this.colQ * this.blockWidth;
			this.boardHeight = this.rowQ * this.blockHeight;
			this.leftBorder = this.leftEdge = (this.utils.canvasWidth / 2);
			this.topBorder = this.topEdge = (this.utils.canvasHeight / 2);
this.rightBorder = this.rightEdge = this.boardWidth - this.leftEdge;
			this.bottomBorder = this.bottomEdge = this.boardHeight - this.topBorder;
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
			return { block: this.blocks[iVal][jVal], i: iVal, j: jVal }
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
	       		let obj = this.utils.resolveCollision(heroCircle, boxCircle);
	       		if(obj){
	       			this.action.vx = obj.bX;
	       			this.action.vy = obj.bY;
	       		}
	       		
		
		},
		returnAbove: function (i,j) {
			let newi = (i - 1 >= 0)?(i - 1):undefined;
			let newj = j;
			
			if(newi !== undefined && newj !== undefined){
				return this.blocks[newi][newj];
			} else {
				return undefined;
			}
			
		},
		returnBelow: function (i,j) {
			let newi = (i + 1 < (this.rowQ))?(i + 1):undefined;
			let newj = j;

			if(newi !== undefined && newj !== undefined){
				return this.blocks[newi][newj];
			} else {
				return undefined;
			}
		},
		returnLeft: function (i,j) {
			let newi = i;
			let newj = (j - 1 >= 0)?(j - 1):undefined;
			if(newi !== undefined && newj !== undefined){
				return this.blocks[newi][newj];
			} else {
				return undefined;
			}
		},
		returnRight: function (i,j) {
			let newi = i;
			let newj = (j + 1 < (this.colQ))?(j + 1):undefined;
			
			if(newi !== undefined && newj !== undefined){
				return this.blocks[newi][newj];
			} else {
				return undefined;
			}
		},
		createBoundaries: function (currentSquare){
			let i = currentSquare.i;
			let j = currentSquare.j;
			
			let above = this.returnAbove(i,j);
			let right = this.returnRight(i,j);
			let below =this.returnBelow(i,j);
			let left = this.returnLeft(i,j);

			

if(!above || above.covered){
	this.topBorder = this.topEdge - (this.blockHeight * i);
} else {
	this.topBorder = this.topEdge;

}

if(!below || below.covered){
	this.bottomBorder = ((i+1) * this.blockHeight) - this.topEdge;	
} else {
	this.bottomBorder = this.bottomEdge;
}


if (!right || right.covered) {
	this.rightBorder = ((j+1) * this.blockWidth) - this.leftEdge;	
} else {
	this.rightBorder = this.rightEdge;
}

if (!left || left.covered) {
	this.leftBorder = this.leftEdge - (j * this.blockWidth);
} else {
	this.leftBorder = this.leftEdge;
}




			// console.log(
			// 	this.returnAbove(i,j).covered,
			// 	this.returnRight(i,j).covered,
			// 	this.returnBelow(i,j).covered,
			// 	this.returnLeft(i,j).covered);

		},
		animate: function (vx, vy) {
			
			//this.action.vx = this.action.vy = 0;
			let currentSquare = this.currentSquare();
			this.createBoundaries(currentSquare);
			
			
			
			
			//boundaries
			//console.log(this.cont.x, -this.rightBorder);
			this.cont.x -= vx;

			if (this.cont.x > this.leftBorder) {
				console.log('1')
			 	this.cont.x -= this.buffer;
			 	this.action.vx *= -1;
			} 
			if (this.cont.x < -this.rightBorder) {
				//console.log('2')
				this.cont.x += this.buffer;
			 	this.action.vx *= -1;
			}

			this.cont.y -= vy;
			if (this.cont.y > this.topBorder) {
			 	this.cont.y = this.topBorder - this.buffer;
			 	this.action.vy *= -1;
			} 

			if (this.cont.y < -this.bottomBorder) {
				this.cont.y = -this.bottomBorder + this.buffer;
			 	this.action.vy *= -1;
			}
			


		}
	
}