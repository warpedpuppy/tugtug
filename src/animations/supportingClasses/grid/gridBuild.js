import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import axios from 'axios';
import SpaceShip from './items/spaceShip/spaceShip';
import { API_BASE_URL } from '../../../config';
import Config from '../../animationsConfig';
import Baddies from './baddies/baddies';
import Tokens from '../tokens/levelTokens';
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
		transitionItemsArray: [],
		treasureChests: [],
		magicPillsArray: [],
		itemLoopingQ: 0,
		soldiers: [],
		castles: [],
		spears: [],
		solderPerGridSquareQ: 1,
		baddies: Baddies(),
		init: function () {

			this.parent = this.utils.root;
			this.flyTexture = this.utils.spritesheet.textures['grassSquareSmall.png'];
			this.whiteSquare = this.utils.spritesheet.textures['whiteTile.png'];
			this.parentCont = this.utils.app.stage;
		
		  	//items to be distributed around board
			this.spaceShip = SpaceShip().init()
			this.tokens = Tokens.init();
			this.magicPillsArray = this.utils.root.grid.magicPillsArray;
			this.treasureChests = this.utils.root.grid.treasureChests;
			this.transitionItemsArray = this.utils.root.grid.transitionItemsArray;

			
  			this.boards = this.utils.root.dbData.boards;
			this.buildGrid(this.boards[this.currentBoard]);

			return this;

		},
		createObj: function (board) {
			let obj = {};
			for(let arr of board.grid){
				obj[`${arr[0]}_${arr[1]}`] = 'covered';
			}
			obj[`${board.token1.i}_${board.token1.j}`] = 'token1';
			obj[`${board.token2.i}_${board.token2.j}`] = 'token2';
			obj[`${board.token3.i}_${board.token3.j}`] = 'token3';
			obj[`${board.token4.i}_${board.token4.j}`] = 'token4';
			return obj;
		},
		buildGrid: function (data) {
			
			let mode = this.utils.root.activeMode,
			    obj = this.createObj(data),
			    counter = 0,
			    b;

			this.blockWidth = Config[`${mode}BlockSize`][0];
			this.blockHeight = Config[`${mode}BlockSize`][1];
			this.rowQ = data.rows;
			this.colQ = data.cols;
			this.freeSpaces = [];
			this.coveredSpaces = [];
			
			for (let i = 0; i < data.rows; i ++) {
				this.blocks[i] = [];
				for (let j = 0; j < data.cols; j ++) {

					let bool = (obj[`${i}_${j}`] !== 'covered')?false:true;

					if (!this.blockPool[counter]) {
						b = Assets.Sprite()
						this.blockPool.push(b)	
					} else {
						b = this.blockPool[counter];
					}

					b.width = this.blockWidth;
					b.height = this.blockHeight;
					b.covered = bool;
					b.x = j * this.blockWidth;
					b.y = i * this.blockHeight;
					
					this.cont.addChild(b);

					let token = false;
					if (obj[`${i}_${j}`] && obj[`${i}_${j}`].includes('token')) {
						let num = obj[`${i}_${j}`].slice(-1);
						token = true;
						this.tokenData[num] = {x: b.x, y:b.y};
					}

					//store free ones
					let heroSpace = (String(i) === data.hero.i && String(j) === data.hero.j)?true:false;
					
					if (!bool && !token && !heroSpace) {
						this.freeSpaces.push([b.x, b.y, b, i, j]);
					} else if (bool) {
						this.coveredSpaces.push(b)
					}
					
					this.blocks[i][j] = b;
					counter ++;
				}
			}

			this.placeShip();
			this.placeItems(this.transitionItemsArray);
			this.placeItems(this.treasureChests);
			this.placeItems(this.magicPillsArray);
			this.baddies.placeCastlesAndSoldiers(this);

			this.assignAboveBelowRightLeftCovered();
			
			this.placeTokens();
			this.heroJ = data.hero.j;
			this.heroI = data.hero.i;
			this.placeHero();
			
			this.initialPoint = {x: this.cont.x, y: this.cont.y};
			this.changeBackground(this.utils.root.activeMode)

		},
		placeShip: function () {
			// for now just place space ship here
			let index = (!Config.testing)?Math.floor(Math.random()*this.freeSpaces.length):0;
			this.spaceShip.x = this.spaceShip.storeX = this.freeSpaces[index][0] + this.blockWidth / 2;
			this.spaceShip.y = this.spaceShip.storeY = this.freeSpaces[index][1] + this.blockHeight / 2;
			this.freeSpaces.splice(index, 1)
			this.cont.addChild(this.spaceShip);
		},
		placeItems: function (array) {
			array.forEach((item, index) => {
				if(!this.freeSpaces.length)return;
				let i = Math.floor(Math.random()*this.freeSpaces.length);
				item.x = this.freeSpaces[i][0] + this.blockWidth / 2;
				item.y = this.freeSpaces[i][1] + this.blockHeight / 2;
				this.freeSpaces.splice(i, 1);
				this.cont.addChild(item);
			})
		},
		placeTokens: function () {
			for (let key in this.tokenData) {
				let index = key - 1;
				let t = this.tokens[index];
				t.anchor.set(0.5)
				t.num = key;
				t.x = this.tokenData[key].x + this.blockWidth / 2;
				t.y = this.tokenData[key].y + this.blockHeight / 2;
				this.tokens.push(t);
				this.cont.addChild(t);
			}
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
		placeHero: function () {

			let i = this.heroI;
			let j = this.heroJ;
			//we know 1,1 is free, so place that beneath the hero
			i++;
			j++;
			let halfWidth = this.utils.canvasWidth / 2;
			let halfHeight = this.utils.canvasHeight / 2;
			this.cont.x = halfWidth - (j * this.blockWidth) + (this.blockWidth /2);
			this.cont.y = halfHeight - (i * this.blockHeight) + (this.blockHeight /2);
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