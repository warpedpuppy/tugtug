import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Config from '../../../animationsConfig';
import Weapon from './baddyWeapon';
export default function (gridBuild) {
	return {
		utils:Utils,
		vx: 0,
		vy: 0,
		calcDest: true,
		buffer: 10,
		towardsDragon: true,
		alreadyBeenToAWall: false,
		spearThrowing: false,
		throw: false,
		spearCounter: 0,
		health: 100,
		init: function (str) {
			this.cont = gridBuild.cont;
			this.destPoint = {x: this.utils.canvasWidth / 2, y: this.utils.canvasHeight / 2};
			this.root = this.utils.root;
			this.body = Assets.Sprite(str);
			this.body.anchor.set(0.5);
			this.speed = this.utils.randomNumberBetween(0.1, 0.5);
			this.spearSpeed = this.utils.randomNumberBetween(0.6, 0.8);
			this.body.classRef = this;
			this.body.radius = this.body.r = 11;
			this.startSquare = this.currentSquare();

			//spears
			this.spear = Weapon(gridBuild).init();
			// this.spear = Assets.Sprite('bouncePlatformLine.png');
			// this.spear.anchor.set(0.5);
			// this.spear.width = 50;
			// this.spear.height = 4;
			// this.spear.vx = 0;
			// this.spear.vy = 0;
			// this.spear.reset = () => {
			// 	this.spearCounter = 0;
			// 	this.throw = false;
			// 	this.spearThrowing = false;
			// }
			
			return this.body;
		},
		onScreen: function () {
				
			let currentSquare = this.currentSquare().block;

			let grid = gridBuild.cont;

			if (
				grid.x > -currentSquare.x && 
				grid.x < this.utils.canvasWidth - currentSquare.x &&
				grid.y > -currentSquare.y && 
				grid.y < this.utils.canvasHeight - currentSquare.y &&
				 this.body.alpha
				 ) {
				return true;
			}
			return false;

		},
		currentSquare: function () {
		
			this.blockWidth = Config[`${this.utils.root.activeMode}BlockSize`][0];
			this.blockHeight = Config[`${this.utils.root.activeMode}BlockSize`][1];

			let globalPoint = this.cont.toGlobal(this.body);

			let iVal = Math.floor((globalPoint.y - gridBuild.cont.y) / this.blockHeight);
			let jVal = Math.floor((globalPoint.x - gridBuild.cont.x) / this.blockWidth);
			
			return { block: gridBuild.blocks[iVal][jVal], i: iVal, j: jVal }
		},
		getModifiedHeroPoint: function () {
			this.heroPoint = {x: this.utils.canvasWidth / 2, y: this.utils.canvasHeight / 2};
			return gridBuild.cont.toLocal(this.heroPoint, this.utils.stage);
		},
		calculateDestPoint: function () {
			//dest point should be the dragon]
			let currentSquare = this.currentSquare();
			// let i = currentSquare.i;
			// let j = currentSquare.j; 

			let rightEdge = currentSquare.block.x + this.blockWidth - this.buffer; 
			let leftEdge = currentSquare.block.x + this.buffer;
			let bottomEdge = currentSquare.block.y + this.blockHeight - this.buffer;
			let topEdge = currentSquare.block.y + this.buffer;
		
			if (
				(currentSquare.block.right && currentSquare.block.right.covered && this.body.x > rightEdge) ||
				(currentSquare.block.left && currentSquare.block.left.covered && this.body.x < leftEdge) ||
				(currentSquare.block.above && currentSquare.block.above.covered && this.body.y < topEdge) ||
				(currentSquare.block.below && currentSquare.block.below.covered && this.body.y > bottomEdge )) {
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
		addToStage: function () {
			this.cont.addChild(this.body);
			this.cont.addChild(this.spear);
		},
		removeFromStage: function () {
			this.cont.removeChild(this.body);
			this.cont.removeChild(this.spear);
		},
		resize: function () {

		},
		resetSpear: function () {
			this.spearCounter = 0;
			this.throw = false;
			this.spearThrowing = false;
		},
		animate: function () {

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

				if (this.spearCounter < 10) {
					this.spearCounter ++;
				} else {
					this.spearThrowing = true;
					if (!this.throw) {
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
						this.resetSpear();
					}
				}
				
				this.body.rotation = angle + this.utils.deg2rad(90);
				return this.body; //this is so we have a count of who is on screen
			}
		}
	}
}