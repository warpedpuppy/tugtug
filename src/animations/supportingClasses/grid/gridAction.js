import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
export default {
		utils: Utils,
		colQ: 4,
		rowQ: 10,
		buffer: 10,
		pause: false,
		wallHit: 0,
		itemLoopingQ: 0,
		init: function () {

			this.blockWidth = Config[`${this.utils.root.activeMode}BlockSize`][0];
			this.blockHeight = Config[`${this.utils.root.activeMode}BlockSize`][1];
		 	
		 	this.magicPillsArray = this.utils.root.grid.magicPillsArray;
		 	this.transitionItemsArray = this.utils.root.grid.transitionItemsArray;
		 	this.treasureChests = this.utils.root.grid.treasureChests;
		 	this.treasure = this.utils.root.grid.treasure;
		 	this.baddies = this.utils.root.grid.gridBuild.baddies;
		 	this.blocks = this.utils.root.grid.gridBuild.blocks;
		 	this.gridBuild = this.utils.root.grid.gridBuild;
			this.spaceShip = this.gridBuild.spaceShip;
			this.microscope = this.gridBuild.microscope;

			this.omnibusArray = this.gridBuild.omnibusArray;

		    this.itemLoopingQ = Math.max(
		    	this.magicPillsArray.length, 
		    	this.transitionItemsArray.length, 
		    	this.treasureChests.length)
		
		    this.heroCollisionDetector = {
				x: this.utils.canvasWidth / 2,
				y: this.utils.canvasHeight / 2,
				radius: 10
			}

			this.setLimits();
		},
		currentSquare: function () {
			let halfCanvasWidth = (this.utils.canvasWidth / 2),
			    halfCanvasHeight = (this.utils.canvasHeight / 2),
			    iVal = Math.floor((halfCanvasHeight - this.gridBuild.cont.y) / this.blockHeight),
			    jVal = Math.floor((halfCanvasWidth - this.gridBuild.cont.x) / this.blockWidth);
			return { block: this.blocks[iVal][jVal], i: iVal, j: jVal }
		},
		createBoundaries: function (currentSquare) {

			let i = currentSquare.i;
			let j = currentSquare.j;
			
			let above = currentSquare.block.above;
			let right = currentSquare.block.right;
			let below = currentSquare.block.below;
			let left = currentSquare.block.left;

			//console.log(above.covered, right.covered, left.covered, below.covered)

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

		},
		setLimits: function () {

			this.blockWidth = Config[`${this.utils.root.activeMode}BlockSize`][0];
			this.blockHeight = Config[`${this.utils.root.activeMode}BlockSize`][1];

			this.colQ = this.utils.root.grid.gridBuild.boards[this.utils.root.grid.gridBuild.currentBoard].cols;
			this.rowQ = this.utils.root.grid.gridBuild.boards[this.utils.root.grid.gridBuild.currentBoard].rows;

			this.boardWidth = this.colQ * this.blockWidth;
			this.boardHeight = this.rowQ * this.blockHeight;
			this.leftBorder = this.leftEdge = (this.utils.canvasWidth / 2);
			this.topBorder = this.topEdge = (this.utils.canvasHeight / 2);
		
			this.rightBorder = this.rightEdge = this.boardWidth - this.leftEdge;
			this.bottomBorder = this.bottomEdge = this.boardHeight - this.topBorder;
		},
		itemHitDetect: function (item) {
			let globalPoint = this.gridBuild.cont.toGlobal(item);
			let ballB = {
				x: globalPoint.x,
				y: globalPoint.y,
				radius: 30
			}
			let x = this.utils.circleToCircleCollisionDetection(this.heroCollisionDetector, ballB);
			return x[0];
		},
		animate: function (vx, vy) {
			if (this.treasure.animationHappening) {
				this.treasure.animateSpecial();			
			} else {
				this.treasure.animate();
			}

			if(this.pause)return;

			let ballB;
			this.baddies.animate();

			this.omnibusArray.forEach((item, i) => {
				
				if (this.itemHitDetect(item)) {
					this.utils.root.filterAnimation.shutOff();
					if(item.name === 'swim' || item.name === 'fly' && !item.hit) {
						item.hit = true;
			 			this.utils.root.switchPlayerWithAnimation(item.name);
					} else if (item.name === 'magicPill' && !this.utils.root.filterAnimation.enabled) {
						this.utils.root.filterTest();
					} else if (item.name === 'treasureChest' && !this.treasure.animationHappening) {
						this.treasure.activeChest = item;
						this.treasure.playAnimation(this.treasure.activeChest);
						this.treasure.removeChest(i);
						this.omnibusArray.splice(i, 1);
						this.utils.root.score.increase(Config.treasureChestScoreIncrease);
					} else if (item.name === 'token') {
						this.gridBuild.cont.removeChild(item)
			 			this.utils.root.earnToken(item);
					} else if (item.name === 'spaceship') {
						this.pause = true;
						this.spaceShip.classRef.blastOff();
					} else if (item.name === 'microscope') {
						item.hit = true;
			 			this.utils.root.switchPlayerWithAnimation('bounce');
					}
				}

				if (item.name === 'magicPill' || 
					item.name === 'swim' || 
					item.name === 'fly' || 
					item.name === 'treasureChest' 
					) {
					//console.log(item.counter, item.counterLimit, item.isTweening)
					if (item.counter >= item.counterLimit && !item.isTweening) {
						item.isTweening = true;
						this.gridBuild.moveItem1(item);
					} else {
						item.counter ++;
					}
				
				}
			})


			this.storeCurrent = this.currentSquare();
			this.createBoundaries(this.storeCurrent);

			this.gridBuild.cont.x -= vx;
			if (this.gridBuild.cont.x > this.leftBorder) {
			 	this.gridBuild.cont.x -= this.buffer;
			 	this.utils.root.activeAction.vx *= this.gridBuild.wallHit;
			} 
			if (this.gridBuild.cont.x < -this.rightBorder) {
				this.gridBuild.cont.x += this.buffer;
				this.utils.root.activeAction.vx *= this.gridBuild.wallHit;
			}

			this.gridBuild.cont.y -= vy;
			if (this.gridBuild.cont.y > this.topBorder) {
			 	this.gridBuild.cont.y = this.topBorder - this.buffer;
			 	this.utils.root.activeAction.vy *= this.gridBuild.wallHit;
			} 

			if (this.gridBuild.cont.y < -this.bottomBorder + this.buffer) {
				this.gridBuild.cont.y = -this.bottomBorder + this.buffer;
				this.utils.root.activeAction.vy *= this.gridBuild.wallHit;
			}
		}
}