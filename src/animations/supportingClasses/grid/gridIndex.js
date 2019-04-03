import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import SpaceShip from '../jump/spaceShip.js';
import Config from '../../animationsConfig';
import TransitionItems from './items/transitionItems';
import Treasure from './items/treasure';
import MagicPills from './items/magicPills';
export default {
		cont: Assets.ParticleContainer(10000),
		blockWidth: 0,
		blockHeight: 0,
		blocks: {},
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
		transitionItems: TransitionItems(),
		magicPills: MagicPills(),
		treasure: Treasure(),
		transitionItemsArray: [],
		treasureChests: [],
		magicPillsArray: [],
		itemLoopingQ: 0,
		init: function (parent) {

			this.blockWidth = Config[`${this.utils.root.activeMode}BlockSize`][0];
			this.blockHeight = Config[`${this.utils.root.activeMode}BlockSize`][1];

			this.spaceShip = SpaceShip().init()

			for (let i = 0; i < 900; i ++) {
				this.blockPool.push(Assets.Sprite())
			}
			this.parent = parent;
			this.flyTexture = this.utils.spritesheet.textures['grassSquareSmall.png'];
			this.whiteSquare = this.utils.spritesheet.textures['whiteTile.png'];

			this.parent = parent;
			this.parentCont = parent.stage;
		

			this.setLimits();

			this.boxCircles = [];
		
		    this.setAction = this.setAction.bind(this);
		    this.nextBoard = this.nextBoard.bind(this);
		    this.boards = parent.dbData.boards;
		    

		   this.magicPillsArray = this.magicPills.init();

            this.treasureChests = this.treasure.init();

            this.transitionItemsArray = this.transitionItems.init(
                this.utils.root.mode, 
                this.utils.root.stage, 
                this.utils.root.switchPlayer.bind(this.utils.root)).build();

		    this.buildGrid(this.boards[this.currentBoard]);

		    this.itemLoopingQ = Math.max(this.magicPillsArray.length, this.transitionItemsArray.length, this.treasureChests.length)
		

		    this.heroCollisionDetector = {
					x: this.utils.canvasWidth / 2,
					y: this.utils.canvasHeight / 2,
					radius: 10
				}
		},
		changeGridSize: function(w, h){
			if(w === this.blockWidth && h === this.blockHeight)return
			this.blockWidth = w;
			this.blockHeight = h;
			this.cont.removeChildren();
			console.log("change grid size")
			this.buildGrid(this.boards[this.currentBoard]);
		},
		createObj: function (board) {
			let obj = {};
			for(let arr of board.grid){
				obj[`${arr[0]}_${arr[1]}`] = 'covered';
			}
		
			// // add hero
			// if (board.hero) {
			// 	obj[`${board.hero.i}_${board.hero.j}`] = 'hero';
			// }
			obj[`${board.token1.i}_${board.token1.j}`] = 'token1';
			obj[`${board.token2.i}_${board.token2.j}`] = 'token2';
			obj[`${board.token3.i}_${board.token3.j}`] = 'token3';
			obj[`${board.token4.i}_${board.token4.j}`] = 'token4';
			return obj
		},
		nextBoard: function () {
			this.pause = true;
			this.currentBoard = this.boards.length - 1;
			this.cont.removeChildren();
			this.blocks = {};
			console.log("next board")
			this.buildGrid(this.boards[this.currentBoard]);
			this.setAction(this.parent.activeAction, this.parent.activeMode);

		},
		addNewBoardData: function (newData) {
			if(newData.boards){
				console.log("new data", newData)
				this.boards.push(newData.boards);
				console.log(this.boards)
			} else {
				console.log("just use old one")
			}
			
		},
		buildGrid: function (data) {
			let obj = this.createObj(data);
			let counter = 0;
			this.rowQ = data.rows;
			this.colQ = data.cols;
			//console.log('start build grid')
			this.freeSpaces = [];
			this.coveredSpaces = [];
			for (let i = 0; i < data.rows; i ++) {
				this.blocks[i] = [];
				for (let j = 0; j < data.cols; j ++) {
					//console.log(i,j,obj[`${i}_${j}`])
					let bool = (obj[`${i}_${j}`] !== 'covered')?false:true;
					//let b = this.block(bool);
					let b = this.blockPool[counter];
					b.width = this.blockWidth;
					b.height = this.blockHeight;
					b.covered = bool;
					//console.log(b.covered)
					b.x = j * this.blockWidth;
					b.y = i * this.blockHeight;
					//console.log(b.x, b.y)
					// let text = Assets.BitmapText(`${i}, ${j}`)
					// text.x = b.x;
					// text.y = b.y;
					this.cont.addChild(b);
					//this.cont.addChild(text);
					let token = false;
					if (obj[`${i}_${j}`] && obj[`${i}_${j}`].includes('token')) {
						let num = obj[`${i}_${j}`].slice(-1);
						//this.placeToken(num, b.x, b.y)
						token = true;
						this.tokenData[num] = {x: b.x, y:b.y};
					}

					//store free ones
					
					if(!bool && !token && (String(i) !== data.hero.i && String(j) !== data.hero.j)){
						//console.log([b.x, b.y, b, i, j])
						this.freeSpaces.push([b.x, b.y, b, i, j]);
					} else if (bool) {
						this.coveredSpaces.push(b)
					}
					
					this.blocks[i][j] = b;
					counter ++;
				}
			}

			this.placeShip();
			this.placeTransitionItems();
			this.placeChests();
			this.placeMagicPills();
			this.assignAboveBelowRightLeftCovered();
			//this.cont.cacheAsBitmap = true;
			this.placeTokens();
			this.placeHero(data.hero.j, data.hero.i);
			this.setLimits();
			this.pause = false;
		},
		placeShip: function () {
			// for now just place space ship here

			let index = Math.floor(Math.random()*this.freeSpaces.length)
			this.spaceShip.x = this.freeSpaces[index][0] + this.blockWidth / 2;
			this.spaceShip.y = this.freeSpaces[index][1] + this.blockHeight / 2;
			this.freeSpaces.splice(index, 1)
			this.cont.addChild(this.spaceShip);
		},
		placeTransitionItems: function () {
			this.transitionItemsArray.forEach((item, index) => {
				if(!this.freeSpaces.length)return;
				let i = Math.floor(Math.random()*this.freeSpaces.length);
				item.x = this.freeSpaces[i][0] + this.blockWidth / 2;
				item.y = this.freeSpaces[i][1] + this.blockHeight / 2;
				this.freeSpaces.splice(i, 1);
				this.cont.addChild(item);
			})
		},
		placeChests: function () {
			this.treasureChests.forEach((item, index) => {
				if(!this.freeSpaces.length)return;
				let i = Math.floor(Math.random()*this.freeSpaces.length);
				item.x = this.freeSpaces[i][0] + this.blockWidth / 2;
				item.y = this.freeSpaces[i][1] + this.blockHeight / 2;
				this.freeSpaces.splice(i, 1);
				this.cont.addChild(item);
			})
		},
		placeMagicPills: function () {
			this.magicPillsArray.forEach((item, index) => {
				if(!this.freeSpaces.length)return;
				let i = Math.floor(Math.random()*this.freeSpaces.length);
				item.x = this.freeSpaces[i][0] + this.blockWidth / 2;
				item.y = this.freeSpaces[i][1] + this.blockHeight / 2;
				this.freeSpaces.splice(i, 1);
				this.cont.addChild(item);
			})
		},
		placeTokens: function () {
			for(let key in this.tokenData){
				let t = Assets.Sprite(`token${key}.png`);
				t.anchor.set(0.5)
				t.num = key;
				t.x = this.tokenData[key].x + this.blockWidth / 2;
				t.y = this.tokenData[key].y + this.blockHeight / 2;
				this.tokens.push(t);
				this.cont.addChild(t);
			}
		},
		setAction: function (action, mode) {
			this.action = action;
			this.changeBackground(mode)
		},
		changeBackground: function (mode) {
		

			this.wallHit = Config[`${mode}WallHit`];
			this.buffer = Config[`${mode}Buffer`];

			let t;
			if (mode === 'fly') {
				t = this.flyTexture;
				
			} 
			for(let j in this.blocks){
					for(let i = 0; i < this.blocks[j].length; i ++){
						let b = this.blocks[j][i];
						if(!b.covered){
							b.texture = t;
						} else {
							b.texture = this.whiteSquare
						}
					}
				}
		},
		placeHero: function (i, j) {
			//we know 1,1 is free, so place that beneath the hero
			i++;
			j++;
			let halfWidth = this.utils.canvasWidth / 2;
			let halfHeight = this.utils.canvasHeight / 2;
			this.cont.x = halfWidth - (i * this.blockWidth) + (this.blockWidth /2);
			this.cont.y = halfHeight - (j * this.blockHeight) + (this.blockHeight /2);
		},
		addToStage: function (index) {
			
			
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
				return  undefined;
			}
		},
		returnLeft: function (i,j) {
			let newi = i;
			let newj = (j - 1 >= 0)?(j - 1):undefined;
			if(newi !== undefined && newj !== undefined){
				return this.blocks[newi][newj];
			} else {
				return  undefined;
			}
		},
		returnRight: function (i,j) {
			let newi = i;
			let newj = (j + 1 < (this.colQ))?(j + 1):undefined;
			
			if(newi !== undefined && newj !== undefined){
				return this.blocks[newi][newj];
			} else {
				return  undefined;
			}
		},
		currentSquare: function () {
			let halfCanvasWidth = (this.utils.canvasWidth / 2),
			    halfCanvasHeight = (this.utils.canvasHeight / 2),
			    iVal = Math.floor((halfCanvasHeight - this.cont.y) / this.blockHeight),
			    jVal = Math.floor((halfCanvasWidth - this.cont.x) / this.blockWidth);
			return { block: this.blocks[iVal][jVal], i: iVal, j: jVal }
		},
		assignAboveBelowRightLeftCovered: function () {
		
	        for (let i = 0; i < this.rowQ; i ++) {
	            for (let j = 0; j < this.colQ; j ++) {
	                
	                let above = this.returnAbove(i, j)
	                if(!above)continue
	                this.blocks[i][j].above = above;
	                this.blocks[i][j].aboveCovered = above.covered;
	               
	                let below = this.returnBelow(i, j)
	                if(!below)continue
	                this.blocks[i][j].below = below;
	                this.blocks[i][j].belowCovered = below.covered;
	                
	                let right = this.returnRight(i, j)
	                if(!right)continue
	                this.blocks[i][j].right = right;
	                this.blocks[i][j].rightCovered = right.covered;
	                
	                let left = this.returnLeft(i, j)
	                if(!left)continue
	                this.blocks[i][j].left = left;
	                this.blocks[i][j].leftCovered = left.covered;

	               // console.log(above, right, left, below)
	            }
	        }
		},
		createBoundaries: function (currentSquare){

			let i = currentSquare.i;
			let j = currentSquare.j;
			
			let above = currentSquare.block.above;//this.returnAbove(i,j);
			let right = currentSquare.block.right;//this.returnRight(i,j);
			let below = currentSquare.block.below;//this.returnBelow(i,j);
			let left = currentSquare.block.left;//this.returnLeft(i,j);

			//console.log(above, right, left, below)

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
			
	
			if(this.pause)return;


			for(let i = 0; i < this.itemLoopingQ; i ++){
				if(this.transitionItemsArray[i]){
				
					if(this.itemHitDetect(this.transitionItemsArray[i])){
						console.log("trans hit");

					}
				}
				if(this.treasureChests[i]){
					if(this.itemHitDetect(this.treasureChests[i]) && !this.treasure.animationHappening){
						console.log("chest hit");
						this.treasure.activeChest = this.treasureChests[i];
						this.utils.root.filterAnimation.shutOff();
						this.treasure.playAnimation();
					}
				}
				if(this.magicPillsArray[i]){
					if(this.itemHitDetect(this.magicPillsArray[i]) && !this.utils.root.filterAnimation.enabled){
						console.log("pills hit")
						this.utils.root.filterTest();
					}
				}
			}

			// if (this.treasure.hit || this.transitionItems.hit) {
   //              if(this.action){
   //                  this.filterAnimation.shutOff();
   //                  this.action = false;
   //              }
   //              if (this.treasure.hit) {
   //                  this.score.increase(100);
   //                  this.treasure.animateSpecial();
   //              } else {
   //                  this.transitionItems.animateSpecial();
   //              }

   //          } else {
   //             // this.action = true;
   //          }

            // this.treasure.animate(this.utils.root.activeAction.vx, this.utils.root.activeAction.vy);
            // this.transitionItems.animate(this.utils.root.activeAction.vx, this.utils.root.activeAction.vy);
            // this.magicPills.animate(this.utils.root.activeAction.vx, this.utils.root.activeAction.vy);


			let currentSquare = this.currentSquare();
			this.createBoundaries(currentSquare);
			
			let ballB;
			for (let i = 0; i < this.tokens.length; i ++) {
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
			
			//boundaries
			//console.log(this.cont.x, -this.rightBorder);
			this.cont.x -= vx;

			if (this.cont.x > this.leftBorder) {
				//console.log('1')
			 	this.cont.x -= this.buffer;

			 	this.action.vx = 5;
			 	//this.action.vx *= this.wallHit;
			} 
			if (this.cont.x < -this.rightBorder) {
				//console.log('2')
				this.cont.x += this.buffer;

				this.action.vx = -5;
			 	//this.action.vx *= this.wallHit;
			}

			this.cont.y -= vy;
			if (this.cont.y > this.topBorder) {
			 	this.cont.y = this.topBorder - this.buffer;
			 	this.action.vy *= this.wallHit;
			} 

			if (this.cont.y < -this.bottomBorder + this.buffer) {

				 this.cont.y = - this.bottomBorder + this.buffer;
			
			 	if(this.utils.root.activeMode === "bounce"){
			 		this.utils.hero.activeHero.bounce(true);
		        	this.action.vy  = 10 * this.wallHit;
			    } else {
			        this.action.vy *= this.wallHit;
			    }
			 	
		        


			}
			


		}
	
}