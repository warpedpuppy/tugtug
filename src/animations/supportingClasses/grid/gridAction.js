import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import SpaceShip from '../jump/spaceShip.js';
import Config from '../../animationsConfig';
import TransitionItems from './items/transitionItems';
import Treasure from './items/treasure';
import MagicPills from './items/magicPills';
import Baddies from './baddies/baddies';
export default {
		// cont: Assets.ParticleContainer(10000),
		// blockWidth: 0,
		// blockHeight: 0,
		// blocks: {},
		utils: Utils,
		colQ: 4,
		rowQ: 10,
		buffer: 10,
		pause: true,
		tokens: [],
		tokenData: {},
		freeSpaces: [],
		coveredSpaces: [],
		boards: [],
		currentBoard: 0,
		blockPool: [],
		spaceShip: {},
		wallHit: 0,
		// transitionItems: TransitionItems(),
		// magicPills: MagicPills(),
		// treasure: Treasure(),
		// transitionItemsArray: [],
		// treasureChests: [],
		// magicPillsArray: [],
		itemLoopingQ: 0,
		soldiers: [],
		castles: [],
		spears: [],
		solderPerGridSquareQ: 1,
		baddies: Baddies(),
		init: function (magicPillsArray, transitionItemsArray, treasureChests) {



			this.blockWidth = Config[`${this.utils.root.activeMode}BlockSize`][0];
			this.blockHeight = Config[`${this.utils.root.activeMode}BlockSize`][1];

			// this.spaceShip = SpaceShip().init()

			// for (let i = 0; i < 900; i ++) {
			// 	this.blockPool.push(Assets.Sprite())
			// }
			// this.parent = parent;
			// this.flyTexture = this.utils.spritesheet.textures['grassSquareSmall.png'];
			// this.whiteSquare = this.utils.spritesheet.textures['whiteTile.png'];

			// this.parent = parent;
			// this.parentCont = parent.stage;
		

			// this.setLimits();

			// this.boxCircles = [];
		
		 //    this.setAction = this.setAction.bind(this);
		 //    this.nextBoard = this.nextBoard.bind(this);
		 //    this.boards = parent.dbData.boards;
		    

		 //   this.magicPillsArray = this.magicPills.init();

   //          this.treasureChests = this.treasure.init();

   //          this.transitionItemsArray = this.transitionItems.init(
   //              this.utils.root.mode, 
   //              this.utils.root.stage, 
   //              this.utils.root.switchPlayer.bind(this.utils.root)).build();

		 //    this.buildGrid(this.boards[this.currentBoard]);
		 	this.setLimits();
		 	this.magicPillsArray = magicPillsArray;
		 	this.transitionItemsArray = transitionItemsArray;
		 	this.treasureChests = treasureChests;
		 	this.treasure = this.utils.root.grid.treasure;
		 	this.baddies = this.utils.root.grid.gridBuild.baddies;
		 	this.cont = this.utils.root.grid.gridBuild.cont;
		 	this.blocks = this.utils.root.grid.gridBuild.blocks;
		 	//this.baddyAction = this.utils.root.grid.baddyAction;
		    this.itemLoopingQ = Math.max(this.magicPillsArray.length, this.transitionItemsArray.length, this.treasureChests.length)
		

		    this.heroCollisionDetector = {
					x: this.utils.canvasWidth / 2,
					y: this.utils.canvasHeight / 2,
					radius: 10
				}

		},
	
		setAction: function (action, mode) {
			this.action = action;
			this.changeBackground(mode)
		},
		
		addToStage: function (index) {
			
			
			this.parentCont.addChildAt(this.cont, index)
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont)
		},
		
		currentSquare: function () {
			let halfCanvasWidth = (this.utils.canvasWidth / 2),
			    halfCanvasHeight = (this.utils.canvasHeight / 2),
			    iVal = Math.floor((halfCanvasHeight - this.cont.y) / this.blockHeight),
			    jVal = Math.floor((halfCanvasWidth - this.cont.x) / this.blockWidth);
			return { block: this.blocks[iVal][jVal], i: iVal, j: jVal }
		},
		createBoundaries: function (currentSquare){

			let i = currentSquare.i;
			let j = currentSquare.j;
			
			let above = currentSquare.block.above;//this.returnAbove(i,j);
			let right = currentSquare.block.right;//this.returnRight(i,j);
			let below = currentSquare.block.below;//this.returnBelow(i,j);
			let left = currentSquare.block.left;//this.returnLeft(i,j);

			console.log(above.covered, right.covered, left.covered, below.covered)

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
			// 	this.returnAbove(i,j),
			// 	this.returnRight(i,j),
			// 	this.returnBelow(i,j),
			// 	this.returnLeft(i,j));

		},
		setLimits: function () {
			this.boardWidth = this.colQ * this.blockWidth;
			this.boardHeight = this.rowQ * this.blockHeight;
			this.leftBorder = this.leftEdge = (this.utils.canvasWidth / 2);
			this.topBorder = this.topEdge = (this.utils.canvasHeight / 2);
			this.rightBorder = this.rightEdge = this.boardWidth - this.leftEdge;
			this.bottomBorder = this.bottomEdge = this.boardHeight - this.topBorder;
		},
		itemHitDetect: function (item) {
			let globalPoint = this.cont.toGlobal(item);
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
			}

			if(this.pause)return;

			let ballB;
			this.baddies.animate();

			for(let i = 0; i < this.itemLoopingQ; i ++){
				if(this.transitionItemsArray[i]){
				
					if(!this.transitionItemsArray[i].hit && this.itemHitDetect(this.transitionItemsArray[i])){
						this.transitionItemsArray[i].hit = true;
						this.utils.root.filterAnimation.shutOff();
						this.utils.root.switchPlayerMaskedAction();
					}
				}
				if(this.treasureChests[i]){
					if(this.itemHitDetect(this.treasureChests[i]) && !this.treasure.animationHappening){
						//console.log("chest hit");
						this.treasure.activeChest = this.treasureChests[i];
						this.utils.root.filterAnimation.shutOff();
						this.treasure.playAnimation();
						this.treasureChests.splice(i, 1)
					}  
				}
				if(this.magicPillsArray[i]){
					if(this.itemHitDetect(this.magicPillsArray[i]) && !this.utils.root.filterAnimation.enabled){
						//console.log("pills hit")
						this.utils.root.filterTest();
					}
				}
				if(this.tokens[i]){
					let t = this.tokens[i];
				
					let globalPoint = this.cont.toGlobal(t);
					ballB = {
						x: globalPoint.x,
						y: globalPoint.y,
						radius: 30
					}
					let x = this.utils.circleToCircleCollisionDetection(this.heroCollisionDetector, ballB);

					if (x[0] && t.parent === this.cont){
						this.cont.removeChild(t)
						this.parent.levelSlots.fillSlot(t);
					}
				}
			}

	
			let spaceShipGlobalPoint = this.cont.toGlobal(this.spaceShip);
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


			this.cont.x -= vx;

			if (this.cont.x > this.leftBorder) {
				//console.log('1')
			 	this.cont.x -= this.buffer;

			 	this.utils.root.activeAction.vx = 5;
			 	//this.action.vx *= this.wallHit;
			} 
			if (this.cont.x < -this.rightBorder) {
				//console.log('2')
				this.cont.x += this.buffer;

				this.utils.root.activeAction.vx = -5;
			 	//this.action.vx *= this.wallHit;
			}

			this.cont.y -= vy;
			if (this.cont.y > this.topBorder) {
			 	this.cont.y = this.topBorder - this.buffer;
			 	this.utils.root.activeAction.y *= this.wallHit;
			} 

			if (this.cont.y < -this.bottomBorder + this.buffer) {

				 this.cont.y = - this.bottomBorder + this.buffer;
			
			 	if(this.utils.root.activeMode === "bounce"){
			 		this.utils.hero.activeHero.bounce(true);
		        	this.utils.root.activeAction.vy  = 10 * this.wallHit;
			    } else {
			        this.utils.root.activeAction.vy *= this.wallHit;
			    }
			 	
		        


			}
			


		}
	
}