import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import SpaceShip from '../jump/spaceShip.js';
//import Config from './animationsConfig';
export default {
		cont: Assets.ParticleContainer(10000),
		blockWidth: 100,
		blockHeight: 100,
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
		init: function (parent) {

			this.spaceShip = SpaceShip().init()

			for (let i = 0; i < 2500; i ++) {
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
		    console.log(this.boards)
		    this.buildGrid(this.boards[this.currentBoard]);

		},
		changeGridSize: function(w, h){
			this.blockWidth = w;
			this.blockHeight = h;
			this.cont.removeChildren();
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
					let text = Assets.BitmapText(`${i}, ${j}`)
					text.x = b.x;
					text.y = b.y;
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
					if(!bool && !token){
						this.freeSpaces.push([b.x, b.y, b, i, j]);
					} else if (bool) {
						this.coveredSpaces.push(b)
					}
					
					this.blocks[i][j] = b;
					counter ++;
				}
			}

			this.placeShip();


			this.assignAboveBelowRightLeftCovered();
			//this.cont.cacheAsBitmap = true;
			this.placeTokens();
			this.placeHero(data.hero.j, data.hero.i);
			this.setLimits();
			this.pause = false;
		},
		placeShip: function () {
			// for now just place space ship here
			this.spaceShip.x = this.freeSpaces[0][0] + this.blockWidth / 2;
			this.spaceShip.y = this.freeSpaces[0][1] + this.blockHeight / 2;
			this.cont.addChild(this.spaceShip);
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
		changeBackground: function (mode) {
			let t;
			if (mode === 'fly') {
				t = this.flyTexture;
			} else {
				//t = this.whiteSquare;
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
		setLimits: function () {
			this.boardWidth = this.colQ * this.blockWidth;
			this.boardHeight = this.rowQ * this.blockHeight;
			this.leftBorder = this.leftEdge = (this.utils.canvasWidth / 2);
			this.topBorder = this.topEdge = (this.utils.canvasHeight / 2);
			this.rightBorder = this.rightEdge = this.boardWidth - this.leftEdge;
			this.bottomBorder = this.bottomEdge = this.boardHeight - this.topBorder;
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
		}
}