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


			for (let i = 0; i < this.itemLoopingQ; i ++) {

				if (this.transitionItemsArray[i]) {
					if(!this.transitionItemsArray[i].hit && this.itemHitDetect(this.transitionItemsArray[i])){
						this.transitionItemsArray[i].hit = true;
						this.utils.root.filterAnimation.shutOff();
						this.utils.root.switchPlayerWithAnimation();
					}
				}
				if(this.treasure.chests[i]){
					if(this.itemHitDetect(this.treasure.chests[i]) && !this.treasure.animationHappening){
						this.treasure.activeChest = this.treasure.chests[i];
						this.utils.root.filterAnimation.shutOff();
						this.treasure.playAnimation(this.treasure.activeChest);
						this.treasure.removeChest(i);
					}  
				}
				if(this.magicPillsArray[i]){
					if(this.itemHitDetect(this.magicPillsArray[i]) && !this.utils.root.filterAnimation.enabled){
						this.utils.root.filterTest();
					}
				}
				if(this.utils.root.grid.gridBuild.tokens[i]){
					let t = this.gridBuild.tokens[i];
				
					let globalPoint = this.gridBuild.cont.toGlobal(t);
					ballB = {
						x: globalPoint.x,
						y: globalPoint.y,
						radius: 30
					}

					let x = this.utils.circleToCircleCollisionDetection(this.heroCollisionDetector, ballB);

					if (x[0] && t.parent === this.gridBuild.cont) {
						this.gridBuild.cont.removeChild(t)
						this.utils.root.levelSlots.fillSlot(t);
					}
				}
			}


			let spaceShipGlobalPoint = this.gridBuild.cont.toGlobal(this.spaceShip);
			ballB = {
					x: spaceShipGlobalPoint.x,
					y: spaceShipGlobalPoint.y,
					radius: 30
				}
			
			let rocketShipHit = this.utils.circleToCircleCollisionDetection(this.heroCollisionDetector, ballB);
			 if (rocketShipHit[0]) {
			 	this.pause = true;
			 	this.spaceShip.classRef.blastOff();
			 }

			let currentSquare = this.currentSquare();
			this.createBoundaries(currentSquare);

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
			 	this.utils.root.activeAction.y *= this.gridBuild.wallHit;
			} 

			if (this.gridBuild.cont.y < -this.bottomBorder + this.buffer) {

				 this.gridBuild.cont.y = -this.bottomBorder + this.buffer;
			
			 	if (this.utils.root.activeMode === "bounce") {
			 		this.utils.hero.activeHero.bounce(true);
		        	this.utils.root.activeAction.vy  = 10 * this.gridBuild.wallHit;
			    } else {
			        this.utils.root.activeAction.vy *= this.gridBuild.wallHit;
			    }
			}
		}
}