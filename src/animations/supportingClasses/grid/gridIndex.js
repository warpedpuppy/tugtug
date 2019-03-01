import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
//import Config from './animationsConfig';
export default {
		cont: Assets.ParticleContainer(10000),
		blockWidth: 500,
		blockHeight: 500,
		blocks: {},
		utils: Utils,
		colQ: 4,
		rowQ: 10,
		buffer: 10,
		pause: true,
		init: function (parentCont) {
			let hero = this.utils.hero;
			//console.log(hero.cont.x, hero.cont.y)

			//so the goal is the get from the x and y value the i and j value
			let iStart = Math.ceil(hero.cont.x / this.blockHeight);
			let jStart = Math.ceil(hero.cont.y / this.blockWidth);

			//console.log(iStart, jStart);

			this.parentCont = parentCont;
		
			//console.log(this.blocks)
			this.setLimits();
			// this.c = Assets.Graphics();
			// this.c.extant= false;
			// this.utils.app.stage.addChild(this.c)
			// this.d = Assets.Graphics();
			// this.utils.app.stage.addChild(this.d)
			// this.e = Assets.Graphics();
			// this.utils.app.stage.addChild(this.e)
			this.boxCircles = [];
			//, { headers: {"Authorization" : `Bearer ${lsToken}`} }
			let that = this;
			axios
		      .get(`${API_BASE_URL}/admin/gameLoadGrids`)
		      .then(function(response){
		       	that.buildGrid(response.data.board)
		      })
		      .catch((err) => {
		        console.error(err)
		      });  


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
			
			return obj
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
					let b = this.block(bool);
					b.covered = bool;
					//console.log(b.covered)
					b.x = j * this.blockWidth;
					b.y = i * this.blockHeight;
					let text = Assets.BitmapText(`${i}, ${j}`)
					text.x = b.x;
					text.y = b.y;
					//this.cont.addChild(text);
					this.cont.addChild(b);
					this.blocks[i][j] = b;
					counter ++;
				}
			}
			this.placeOnStage(data.hero.j, data.hero.i);
			this.setLimits();
			this.pause = false;
		},
		setAction: function (action) {
			this.action = action;
		},
		block: function (bool) {
			let b = Assets.Sprite('redTile.png');
			b.width = this.blockWidth;
			b.height = this.blockHeight;
			b.alpha = 0;
			if (bool) {
				b.alpha = 1;
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
		createBoundaries: function (currentSquare){
			let i = currentSquare.i;
			let j = currentSquare.j;
			
			let above = this.returnAbove(i,j);
			let right = this.returnRight(i,j);
			let below =this.returnBelow(i,j);
			let left = this.returnLeft(i,j);

			

			if(!above|| above.covered){
				this.topBorder = this.topEdge - (this.blockHeight * i);
			} else {
				this.topBorder = this.topEdge;

			}

			if(!below|| below.covered){
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
		animate: function (vx, vy) {
			
			// this.action.vx = this.action.vy = 0;
			// return;
			if(this.pause)return;
			let currentSquare = this.currentSquare();
			this.createBoundaries(currentSquare);
			
			
			
			
			//boundaries
			//console.log(this.cont.x, -this.rightBorder);
			this.cont.x -= vx;

			if (this.cont.x > this.leftBorder) {
				//console.log('1')
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