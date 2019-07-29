import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Tweens from '../../utils/Tweens';
import SpaceShip from './items/spaceShip/spaceShip';
import Config from '../../animationsConfig';
import Baddies from './baddies/baddyIndex';
import Coins from './items/flyAndSwimCoins/Coins';
import Vortexes from './items/vortexes/vortexes';
import GridResizeHandler from './gridResizeHandler';
import GridItems from './items/gridItems';

export default function () {
	return {
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
		//boards: [],
		currentBoard: 0,
		blockPool: [],
		gridCirclePool: [],
		spaceShip: {},
		wallHit: 0,
		transitionItemsArray: [],
		treasureChests: [],
		magicPillsArray: [],
		itemLoopingQ: 0,
		// soldiers: [],
		// castles: [],
		// spears: [],
		// solderPerGridSquareQ: 1,
		flyBaddies: Baddies(),
		swimBaddies: Baddies(),
		//onGridCoins: {},
		omnibusArray: [],
		flyColors: [0x5713B8, 0xFF0F59, 0x4A34FF, 0x60B800, 0x0122FA],
		shipSpace: [],
		//vortexesArray: [],
		coins: Coins(),
		vortexes: Vortexes(),
		gridResizeHandler: GridResizeHandler(),
		gridItems: GridItems(),
		init: function () {
			//this.moveItem = this.moveItem.bind(this);

			this.flyTexture = this.utils.spritesheet.textures['grassSquareSmall.png'];
			this.whiteSquare = this.utils.spritesheet.textures['whiteTile.png'];
			
			if (this.utils.root.all) {
				this.microscope = Assets.Sprite('microscope.png');
				this.microscope.anchor.set(0.5);
				this.microscope.scale.set(0.5);
				this.microscope.name = 'bounce';
				this.spaceShip = SpaceShip().init()
			}
		
			this.tokens = this.utils.root.tokens.tokens;
			this.magicPillsArray = this.utils.root.grid.magicPillsArray;
			this.flyTreasureChests = this.utils.root.grid.flyTreasureChests;
			this.swimTreasureChests = this.utils.root.grid.swimTreasureChests;
			this.transitionItemsArray = this.utils.root.grid.transitionItemsArray;

			
			this.flyBaddies.init('fly');
			this.swimBaddies.init('swim');

			this.coins.onGridCoins = {
				fly: [],
				swim: []
			}
			
			return this;
		},
		resetBaddies: function () {
			this.flyBaddies.setArrays();
			this.swimBaddies.setArrays();
		},
		createObj: function (board) {
			let obj = {};
			for(let arr of board.grid){
				obj[`${arr[0]}_${arr[1]}`] = 'covered';
			}
			obj[`${board.token1.i}_${board.token1.j}`] = 'token1';
			obj[`${board.token2.i}_${board.token2.j}`] = 'token2';

			if (!this.utils.root.all) {
				obj[`${board.token3.i}_${board.token3.j}`] = 'token3';
				obj[`${board.token4.i}_${board.token4.j}`] = 'token4';
			}
			
			return obj;
		},
		buildGrid: function (data) {

			let mode = this.utils.root.activeMode,
			    obj = this.createObj(data),
			    counter = 0,
			    b,
			    texture,
			    gridCircle;
			this.cont.scale.set(1);
			this.cont.pivot = Assets.Point(0, 0);
			this[`${mode}Baddies`].removeCastlesAndSoldiers(); 
			this.wallHit = Config[`${mode}WallHit`];
			this.buffer = Config[`${mode}Buffer`];    
			this.blockWidth = Config[`${mode}BlockSize`][0];
			this.blockHeight = Config[`${mode}BlockSize`][1];
			this.rowQ = data.rows;
			this.colQ = data.cols;
			this.freeSpaces = [];
			this.coveredSpaces = [];
			this.coinSpaces = [];

			
			this.omnibusArray = [
				...this.magicPillsArray, 
				...this[`${mode}TreasureChests`], 
				...this.tokens
			];

			if (this.utils.root.all) {
				this.omnibusArray = [
				...this.omnibusArray, 
				this.spaceShip, 
				this.microscope, 
				...this.transitionItemsArray]
			}
			


			if (mode === 'fly') {
				texture = this.flyTexture;
			} 
			
			for (let i = 0; i < data.rows; i ++) {
				this.blocks[i] = [];
				for (let j = 0; j < data.cols; j ++) {

					let bool = (obj[`${i}_${j}`] !== 'covered')?false:true;

					if (!this.blockPool[counter]) {
						b = Assets.Sprite()
						gridCircle = Assets.Sprite('gridCircle600.png');
						gridCircle.anchor.set(0.5);

						this.blockPool.push(b);
						this.gridCirclePool.push(gridCircle);	
					} else {
						b = this.blockPool[counter];
						gridCircle = this.gridCirclePool[counter];
					}

				

					b.width = this.blockWidth;
					b.height = this.blockHeight;
					b.covered = bool;
					b.x = j * this.blockWidth;
					b.y = i * this.blockHeight;
					
					this.cont.addChild(b);


					gridCircle.width = this.blockWidth;
					gridCircle.height = this.blockHeight;
					gridCircle.x = j * this.blockWidth + (this.blockWidth / 2);
					gridCircle.y = i * this.blockHeight + (this.blockHeight / 2);
					
					

					let token = false;
					if (obj[`${i}_${j}`] && obj[`${i}_${j}`].includes('token')) {
						let num = obj[`${i}_${j}`].slice(-1);
						token = true;
						this.tokenData[num] = {x: b.x, y:b.y};
					}

					//store free ones
					let heroSpace = (String(i) === data.hero.i && String(j) === data.hero.j)?true:false;
					
					if (!bool && !token && !heroSpace) {
						this.freeSpaces.push([b.x, b.y, b, i, j, gridCircle]);
					}

					if (bool) {
						b.texture = this.whiteSquare;
						//b.tint = 0x003300;
						this.coveredSpaces.push(b)
					} else {
						b.texture = this.whiteSquare;
						//b.tint = this.utils.randomItemFromArray(this.flyColors);
						b.alpha = 0.25;
						b.gridCircle = gridCircle;
						gridCircle.alpha = 0.25;
						this.cont.addChild(gridCircle);
					}
					
					this.blocks[i][j] = b;
					counter ++;
				}
			}


			if (this.utils.root.all) {
				this.placeShip();
				this.placeMircoscope();
			}
			

			if (this.utils.root.all) {
				this.gridItems.placeItems(this.transitionItemsArray, true);
			}
			
			this.gridItems.placeItems(this[`${mode}TreasureChests`]);
			this.gridItems.placeItems(this.magicPillsArray);

			this.coins.placeCoins(this.coins.onGridCoins[mode])

			this[`${mode}Baddies`].placeCastlesAndSoldiers(this);

			this.assignAboveBelowRightLeftCovered();
			
			this.utils.root.tokens.tokensClass.placeTokens();
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
			//console.log('ship space = ', this.freeSpaces[index])
			this.shipSpace = this.freeSpaces[index];
			this.spaceShip.x = this.spaceShip.storeX = this.freeSpaces[index][0] + this.blockWidth / 2;
			this.spaceShip.y = this.spaceShip.storeY = this.freeSpaces[index][1] + this.blockHeight / 2;
			this.freeSpaces.splice(index, 1)
			this.cont.addChild(this.spaceShip);
			this.shipSpace[2].alpha = 0;
			this.shipSpace[5].alpha = 0;

			if(this.vortexes.vortexArray.length < 2)this.vortexes.createVortex(0.15, this.spaceShip)
			
			this.spaceShipPoint = {x: this.spaceShip.x, y: this.spaceShip.y, item: this.spaceShip}
		},
		placeMircoscope: function () {
			// for now just place space ship here
			let index = (!Config.testing)? Math.floor(Math.random()*this.freeSpaces.length) : 1;
			this.microscope.x = this.microscope.storeX = this.freeSpaces[index][0] + this.blockWidth / 2;
			this.microscope.y = this.microscope.storeY = this.freeSpaces[index][1] + this.blockHeight / 2;
			this.freeSpaces.splice(index, 1);
			this.microscope.hit = false;
			this.cont.addChild(this.microscope);

			if(this.vortexes.vortexArray.length < 2)this.vortexes.createVortex(-0.15, this.microscope)
		
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
}