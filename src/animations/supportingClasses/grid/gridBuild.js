import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Tweens from '../../utils/tweens';
import SpaceShip from './items/spaceShip/spaceShip';
import Config from '../../animationsConfig';
import Baddies from './baddies/baddyIndex';
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
			//this.moveItem = this.moveItem.bind(this);

			this.flyTexture = this.utils.spritesheet.textures['grassSquareSmall.png'];
			this.whiteSquare = this.utils.spritesheet.textures['whiteTile.png'];
			
			this.microscope = Assets.Sprite('microscope.png');
			this.microscope.anchor.set(0.5);
			this.microscope.scale.set(0.5);
			this.microscope.name = 'microscope';
		  	//items to be distributed around board
			this.spaceShip = SpaceShip().init()
			this.tokens = Tokens.init();
			this.magicPillsArray = this.utils.root.grid.magicPillsArray;
			this.treasureChests = this.utils.root.grid.treasureChests;
			this.transitionItemsArray = this.utils.root.grid.transitionItemsArray;

			this.omnibusArray = [
			...this.magicPillsArray, 
			...this.treasureChests, 
			...this.transitionItemsArray,
			...this.tokens, 
			this.spaceShip, 
			this.microscope];

  			this.boards = this.utils.root.dbData.boards;
			this.buildGrid(this.boards[this.currentBoard]);

			this.baddies.init();
			
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
			    b,
			    texture;
			this.cont.scale.set(1);
			this.cont.pivot = Assets.Point(0, 0);
			this.baddies.removeCastlesAndSoldiers(); 
			this.wallHit = Config[`${mode}WallHit`];
			this.buffer = Config[`${mode}Buffer`];    
			this.blockWidth = Config[`${mode}BlockSize`][0];
			this.blockHeight = Config[`${mode}BlockSize`][1];
			this.rowQ = data.rows;
			this.colQ = data.cols;
			this.freeSpaces = [];
			this.coveredSpaces = [];


			if (mode === 'fly') {
				texture = this.flyTexture;
			} 
			
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
					}

					if (bool) {
						b.texture = this.whiteSquare;
						this.coveredSpaces.push(b)
					} else {
						b.texture = texture;
					}
					
					this.blocks[i][j] = b;
					counter ++;
				}
			}

			this.placeShip();
			this.placeMircoscope();
			this.placeItems(this.transitionItemsArray, true);
			this.placeItems(this.treasureChests);
			this.placeItems(this.magicPillsArray);

			this.baddies.placeCastlesAndSoldiers(this);

			this.assignAboveBelowRightLeftCovered();
			
			this.placeTokens();
			this.heroJ = data.hero.j;
			this.heroI = data.hero.i;
			this.placeHero();
			
			this.initialPoint = {x: this.cont.x, y: this.cont.y};

			this.cont.calculatedWidth = data.cols * this.blockWidth;
			this.cont.calculatedHeight = data.rows * this.blockHeight;
			//this.changeBackground(this.utils.root.activeMode)

		},
		placeShip: function () {
			// for now just place space ship here
			let index = (!Config.testing)? Math.floor(Math.random()*this.freeSpaces.length) : 0;
			this.spaceShip.x = this.spaceShip.storeX = this.freeSpaces[index][0] + this.blockWidth / 2;
			this.spaceShip.y = this.spaceShip.storeY = this.freeSpaces[index][1] + this.blockHeight / 2;
			this.freeSpaces.splice(index, 1)
			this.cont.addChild(this.spaceShip);
		},
		placeMircoscope: function () {
			// for now just place space ship here
			let index = (!Config.testing)? Math.floor(Math.random()*this.freeSpaces.length) : 1;
			this.microscope.x = this.microscope.storeX = this.freeSpaces[index][0] + this.blockWidth / 2;
			this.microscope.y = this.microscope.storeY = this.freeSpaces[index][1] + this.blockHeight / 2;
			this.freeSpaces.splice(index, 1)
			this.cont.addChild(this.microscope);
		},
		placeItems: function (array, isTransitionItem) {

			array.forEach((item, index) => {
				if (!this.freeSpaces.length) return;

				if (isTransitionItem) {

					if (item.name === this.utils.root.activeMode) {
						if (this.utils.root.activeMode === "fly") {
							item.texture = this.utils.spritesheet.textures["swimTrans.png"];
							item.name = "swim";
						} else if (this.utils.root.activeMode === "swim") {
							item.texture = this.utils.spritesheet.textures["flyTrans.png"];
							item.name = "fly";
						}
					}
				}

				let i = Math.floor(Math.random()*this.freeSpaces.length);
				item.x = this.freeSpaces[i][0] + this.blockWidth / 2;
				item.y = this.freeSpaces[i][1] + this.blockHeight / 2;
				item.storeScaleX = item.scale.x;
				item.storeScaleY = item.scale.y;
				item.counter = 0;
            	item.counterLimit = this.utils.randomIntBetween(1000, 6000);
            	//item.isTweening = false;
				//this.freeSpaces.push([b.x, b.y, b, i, j]);
				item.currentSpace = this.freeSpaces[i];
				this.freeSpaces.splice(i, 1);
				this.cont.addChild(item);
			})
		},
		moveItem1: function (item) {
			//	alert("shrink")
			item.hit = true;

			//this.moveItem2 = this.moveItem2.bind(this);
			//let onCompleteHandler = ;
			Tweens.tween(item.scale, 1, 
				{
					x: [item.scale.x,0], 
					y: [item.scale.y,0]
				}, 
				this.moveItem2.bind(this, item), 
				'easeOutBounce'
				)
			
		},
		moveItem2: function (item) {
			//alert("grow")
			//console.log("two hit")
			//let onCompleteHandler = ;
			Tweens.tween(item.scale, 1, 
				{
					x: [0,item.storeScaleX], 
					y: [0,item.storeScaleY]
				}, 
				this.moveItem3.bind(this, item), 
				'easeOutBounce'
				)


			this.freeSpaces.push(item.currentSpace);


			//get new space for item
			let i = Math.floor(Math.random() * this.freeSpaces.length);
			item.x = this.freeSpaces[i][0] + this.blockWidth / 2;
			item.y = this.freeSpaces[i][1] + this.blockHeight / 2;
			item.currentSpace = this.freeSpaces[i];
			this.freeSpaces.splice(i, 1);
			//this.cont.addChild(item);
			
		},
		moveItem3: function (item) {
			//alert("reset")
			item.counter = 0;
			item.isTweening = false;
			
		},
		placeTokens: function () {
			for (let key in this.tokenData) {
				let index = key - 1;
				let t = this.tokens[index];
				if (t.placed) {
					console.log(index, key)
					continue;
				}
				t.anchor.set(0.5)
				t.num = key;
				t.x = this.tokenData[key].x + this.blockWidth / 2;
				t.y = this.tokenData[key].y + this.blockHeight / 2;
				this.tokens.push(t);
				if(t.num < 4)this.cont.addChild(t);
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
			this.cont.x = halfWidth - (j * this.blockWidth) + (this.blockWidth / 2);
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
		resize: function () {
			
			 this.utils.root.grid.gridAction.pause = true;
			 this.utils.root.action = false;
		
			if (!this.calcResize) {
				this.calcResize = true;
				let block = this.utils.root.grid.gridAction.storeCurrent;
				this.saveI = block.i;
				this.saveJ = block.j;
			}

			this.cont.alpha = 0;
			window.clearTimeout(this.timeOut);
			this.timeOut = setTimeout(this.resized.bind(this), 200)

		},
		resized: function () {
	
			this.calcResize = false;
			this.cont.alpha = 1;
			this.saveI++;
			this.saveJ++;
			let halfWidth = this.utils.canvasWidth / 2;
			let halfHeight = this.utils.canvasHeight / 2;
			this.cont.x = halfWidth - (this.saveJ * this.blockWidth) + (this.blockWidth / 2);
			this.cont.y = halfHeight - (this.saveI * this.blockHeight) + (this.blockHeight /2);

			this.utils.root.grid.gridAction.pause = false;
			this.utils.root.action = true;
			window.clearTimeout(this.timeOut);
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