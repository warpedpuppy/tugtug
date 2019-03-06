import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
//import Config from './animationsConfig';
export default function () {
	return {
		utils:Utils,
		vx: 0,
		vy: 0,
		calcDest: true,
		buffer: 3,
		towardsDragon: true,
		alreadyBeenToAWall: false,
		init: function (str, root) {
			this.destPoint = {x: this.utils.canvasWidth / 2, y: this.utils.canvasHeight / 2};
			this.root = root;
			this.grid = root.grid;
			this.body = Assets.Sprite(str);
			this.body.anchor.set(0.5);
			this.speed = this.utils.randomNumberBetween(0.1, 0.5);
			this.body.classRef = this;
			this.startSquare = this.currentSquare();
			return this.body;
		},
		addToStage: function () {

		},
		removeFromStage: function () {

		},
		resize: function () {

		},
		createBoundaries: function (currentSquare){
			this.heroPoint = {x: this.utils.canvasWidth / 2, y: this.utils.canvasHeight / 2};
			this.destPoint = this.grid.cont.toLocal(this.heroPoint, this.utils.stage);
			
			let i = currentSquare.i;
			let j = currentSquare.j;
			let surrounding = {
				above: this.grid.returnAbove(i,j),
				right: this.grid.returnRight(i,j),
				below: this.grid.returnBelow(i,j),
				left: this.grid.returnLeft(i,j)
			};
			let freeBoxesArray = [];
			if(!surrounding.above.covered &&
				!surrounding.right.covered &&
				!surrounding.below.covered &&
				!surrounding.left.covered) {
				//console.log('dragon')
				this.heroPoint = {x: this.utils.canvasWidth / 2, y: this.utils.canvasHeight / 2};
				this.destPoint = this.grid.cont.toLocal(this.heroPoint, this.utils.stage);
				this.calcDest = true;
			} else {
				for(let key in surrounding){
					if(!surrounding[key].covered){
						freeBoxesArray.push(surrounding[key])
					}
				}

				// let destX = block.x + this.grid.blockWidth / 2;
				// this.destPoint = {x: destX, y: this.body.y};
				//if(this.body.y > this.destPoint.y && )
				// let block = this.utils.randomItemFromArray(freeBoxesArray);
				// let destX = block.x + this.grid.blockWidth / 2;
				// let destY = block.y + this.grid.blockHeight / 2;
				// //console.log('clear block')
				// //console.log(block)
				// this.destPoint = {x: destX, y: destY};
				// this.calcDest = false;
			}
			
			//if any square is covered, you go to the open square
			

			//console.log(i,j,below)

			//let destY = below.y + this.grid.blockHeight;
			//this.destPoint = {x: this.body.startX, y: destY};
			// console.log(
			// 	this.grid.returnAbove(i,j).covered,
			// 	this.grid.returnRight(i,j).covered,
			// 	this.grid.returnBelow(i,j).covered,
			// 	this.grid.returnLeft(i,j).covered);

		},
		currentSquare: function () {
			let globalPoint = this.grid.cont.toGlobal(this.body),
			    iVal = Math.floor((globalPoint.y - this.grid.cont.y) / this.grid.blockHeight),
			    jVal = Math.floor((globalPoint.x - this.grid.cont.x) / this.grid.blockWidth);
			//console.log(iVal,jVal);
			//console.log(this.blocks[iVal][jVal].covered)
			//test if square is covered
			return { block: this.grid.blocks[iVal][jVal], i: iVal, j: jVal }
		},
		calculateDestPoint: function () {
			//dest point should be the dragon
			let currentSquare = this.currentSquare();
			let i = currentSquare.i;
			let j = currentSquare.j; 

			//if the soldier hits a wall, reset the dest point to the starting point

			let surrounding = {
				above: this.grid.returnAbove(i,j),
				right: this.grid.returnRight(i,j),
				below: this.grid.returnBelow(i,j),
				left: this.grid.returnLeft(i,j)
			};
			let rightEdge = surrounding.right.x - this.buffer;
			let leftEdge = surrounding.left.x + this.grid.blockWidth + this.buffer;
			let bottomEdge = surrounding.below.y - this.buffer;
			let topEdge = surrounding.above.y + this.grid.blockHeight + this.buffer
			if (
				surrounding.right.covered && this.body.x > rightEdge ||
				surrounding.left.covered && this.body.x < leftEdge ||
				surrounding.above.covered && this.body.y < topEdge ||
				surrounding.below.covered && this.body.y > bottomEdge ) {
				//console.log('RIGHT HIT');
				this.towardsDragon = false;
				this.alreadyBeenToAWall = true;
			}



			

			if (this.towardsDragon) {
				this.heroPoint = {x: this.utils.canvasWidth / 2, y: this.utils.canvasHeight / 2};
				return this.grid.cont.toLocal(this.heroPoint, this.utils.stage);
			} else {
				let xDiff = Math.floor(Math.abs(this.body.x - this.body.startX));
				let yDiff = Math.floor(Math.abs(this.body.y - this.body.startY));
				if(xDiff < this.buffer && yDiff < this.buffer && this.alreadyBeenToAWall){
					this.towardsDragon = true;
				}
				return {x: this.body.startX, y: this.body.startY};
			}
		},
		onScreen: function () {
			let currentSquare = this.currentSquare().block;
			let grid = this.grid.cont;
			
			if(grid.x > -currentSquare.x && 
				grid.x < this.utils.canvasWidth - currentSquare.x &&
				grid.y > -currentSquare.y && 
				 grid.y < this.utils.canvasHeight - currentSquare.y){
				return true;
			}
			return false;

		},
		animate: function (vx, vy) {

			if (this.onScreen()) {
				this.destPoint = this.calculateDestPoint();
			
				let dx = this.destPoint.x - this.body.x;
				let dy = this.destPoint.y - this.body.y;

				let angle = Math.atan2(dy, dx);
				this.vx = Math.cos(angle) * this.speed;
				this.vy = Math.sin(angle) * this.speed;
				//this only happen if it isn't touching a blocked box
				this.body.x += this.vx;
				this.body.y += this.vy;
				this.body.rotation = angle + this.utils.deg2rad(90);
			}
		}
	}
}
