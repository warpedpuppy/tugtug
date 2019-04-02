import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
import Config from '../../animationsConfig';
export default function () {
	return {
		utils:Utils,
		vx: 0,
		vy: 0,
		calcDest: true,
		buffer: 3,
		towardsDragon: true,
		alreadyBeenToAWall: false,
		spearThrowing: false,
		throw: false,
		spearCounter: 0,
		health: 100,
		init: function (str, root) {
			this.destPoint = {x: this.utils.canvasWidth / 2, y: this.utils.canvasHeight / 2};
			this.root = root;
			this.grid = root.grid;
			this.body = Assets.Sprite(str);
			this.body.anchor.set(0.5);
			this.speed = this.utils.randomNumberBetween(0.1, 0.5);
			this.spearSpeed = this.utils.randomNumberBetween(0.6, 0.8);
			this.body.classRef = this;
			this.body.radius = this.body.r = 11;
			this.startSquare = this.currentSquare();

			//spears
			this.spear = Assets.Sprite('bouncePlatformLine.png');
			
			this.spear.anchor.set(0.5);
			this.spear.width = 50;
			this.spear.height = 4;
			this.spear.vx = 0;
			this.spear.vy = 0;
			this.spear.reset = () => {
				this.spearCounter = 0;
				this.throw = false;
				this.spearThrowing = false;
			}
			

			return this.body;
		},
		getModifiedHeroPoint: function () {
			this.heroPoint = {x: this.utils.canvasWidth / 2, y: this.utils.canvasHeight / 2};
			return this.grid.cont.toLocal(this.heroPoint, this.utils.stage);
		},
		addToStage: function () {
			this.grid.cont.addChild(this.body);
			this.grid.cont.addChild(this.spear);
		},
		removeFromStage: function () {
			this.grid.cont.removeChild(this.body);
			this.grid.cont.removeChild(this.spear);
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
			}
		

		},
		hit: function () {
			
			if(this.health < 0){ 
				this.body.alpha = 0;
				this.spear.alpha = 0;
			} else {
			  // this.body.scale.x * 0.99;
			  // this.body.scale.y * 0.99;
			  this.health --;
			 }

		},
		
		currentSquare: function () {
		
			let bw = Config[`${this.utils.root.activeMode}BlockSize`][0];
			let bh = Config[`${this.utils.root.activeMode}BlockSize`][1];

			let globalPoint = this.grid.cont.toGlobal(this.body);
			
			let iVal = Math.floor((globalPoint.y - this.grid.cont.y) / bh);
			let jVal = Math.floor((globalPoint.x - this.grid.cont.x) / bw);
			

			return { block: this.grid.blocks[iVal][jVal], i: iVal, j: jVal }
		},
		calculateDestPoint: function () {
			//dest point should be the dragon
			let currentSquare = this.currentSquare();
			let i = currentSquare.i;
			let j = currentSquare.j; 

			
			let rightEdge = currentSquare.block.x + this.grid.blockWidth - this.buffer; 
			let leftEdge = currentSquare.block.x + this.buffer;
			let bottomEdge = currentSquare.block.y + this.grid.blockHeight - this.buffer;
			let topEdge = currentSquare.block.y + this.buffer;
		
			if (
				(currentSquare.block.right && currentSquare.block.right.covered) && this.body.x > rightEdge ||
				(currentSquare.block.left && currentSquare.block.left.covered) && this.body.x < leftEdge ||
				(currentSquare.block.above && currentSquare.block.above.covered) && this.body.y < topEdge ||
				(currentSquare.block.below && currentSquare.block.below.covered) && this.body.y > bottomEdge ) {
				//console.log(' HIT');
				this.towardsDragon = false;
				this.alreadyBeenToAWall = true;
			}



			

			if (this.towardsDragon) {
				return this.getModifiedHeroPoint();
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
				 grid.y < this.utils.canvasHeight - currentSquare.y &&
				 this.body.alpha){
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



				
				if(this.spearCounter < 10){
					this.spearCounter ++;
				} else {
					this.spearThrowing = true;
					if(!this.throw){
						this.throw = true;
						this.spear.originalTarget = this.getModifiedHeroPoint();
						let dx2 = this.spear.dx2 = this.getModifiedHeroPoint().x - this.spear.x;
						let dy2 = this.spear.dy2 = this.getModifiedHeroPoint().y - this.spear.y;
						let angle2 = Math.atan2(dy2, dx2);
						this.spear.angle = angle2;
					}
				}
				if (!this.spearThrowing) {
					this.spear.x = this.body.x;
					this.spear.y = this.body.y;
				} else {
					this.spear.vx = Math.cos(this.spear.angle) * this.spearSpeed;
					this.spear.vy = Math.sin(this.spear.angle) * this.spearSpeed;
					this.spear.x += this.spear.vx;
					this.spear.y += this.spear.vy;
					this.spear.rotation = this.spear.angle;

					let xDiff = Math.floor(Math.abs(this.spear.originalTarget.x - this.spear.x));
					let yDiff = Math.floor(Math.abs(this.spear.originalTarget.y - this.spear.y));
					if (xDiff < this.buffer && yDiff < this.buffer) {
						this.spear.reset();
						
					}
				}
				
				
				this.body.rotation = angle + this.utils.deg2rad(90);
				return this.body; //this is so we have a count of who is on screen
			}
		}
	}
}
