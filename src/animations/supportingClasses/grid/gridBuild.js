import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import SpaceShip from './items/spaceShip/spaceShip';
import Microscope from './items/spaceShip/microscope';
import Config from '../../animationsConfig';
import Baddies from './baddies/baddyIndex';
import Coins from './items/flyAndSwimCoins/Coins';
import Vortexes from './items/vortexes/vortexes';
import GridResizeHandler from './gridResizeHandler';
import GridItems from './items/gridItems';
import SetTileLimits from './tiles/setTileLimits';

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
		currentBoard: 0,
		blockPool: [],
		gridCirclePool: [],
		spaceShip: {},
		wallHit: 0,
		transitionItemsArray: [],
		treasureChests: [],
		magicPillsArray: [],
		itemLoopingQ: 0,
		flyBaddies: Baddies(),
		swimBaddies: Baddies(),
		omnibusArray: [],
		flyColors: [0x5713B8, 0xFF0F59, 0x4A34FF, 0x60B800, 0x0122FA],
		shipSpace: [],
		coins: Coins(),
		vortexes: Vortexes(),
		gridResizeHandler: GridResizeHandler(),
		gridItems: GridItems(),
		microscopeClass: Microscope(),
		init: function () {
			
			
			this.flyTexture = this.utils.spritesheet.textures['grassSquareSmall.png'];
			this.whiteSquare = this.utils.spritesheet.textures['whiteTile.png'];
			
			if (this.utils.root.all) {
				this.microscope = this.microscopeClass.build();
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
			
			this.cont.removeChildren();
			let mode = this.utils.root.activeMode,
			    obj = this.createObj(data),
			    counter = 0,
			    b,
			    gridCircle;
			this.cont.scale.set(1);
			this.cont.pivot = Assets.Point(0, 0);
			//this[`${mode}Baddies`].removeCastlesAndSoldiers(); 
			this.wallHit = Config[`${mode}WallHit`];
			this.buffer = Config[`${mode}Buffer`];    
			this.blockWidth = Config[`${mode}BlockSize`][0];
			this.blockHeight = Config[`${mode}BlockSize`][1];
			this.rowQ = data.rows;
			this.colQ = data.cols;
			this.freeSpaces = [];
			this.coveredSpaces = [];
			this.coinSpaces = [];
			this.blocks = {};
			
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
					...this.transitionItemsArray
				]
			}
			//console.log(this.blocks)
			
			for (let i = 0; i < data.rows; i ++) {
				this.blocks[i] = [];
				for (let j = 0; j < data.cols; j ++) {

					let bool = (obj[`${i}_${j}`] !== 'covered')?false:true;

					if (!this.blockPool[counter]) {
						//console.log("create new")
						b = Assets.Sprite();
						gridCircle = Assets.Sprite('gridCircle600.png');
						gridCircle.anchor.set(0.5);

						this.blockPool.push(b);
						this.gridCirclePool.push(gridCircle);	
					} else {
						//console.log("use old")
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
						b.alpha = 1;
						this.coveredSpaces.push(b)
					} else {
						b.texture = this.whiteSquare;
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
				this.spaceShip.classRef.placeShip();
				this.microscopeClass.place();
			}
			

			if (this.utils.root.all) {
				this.gridItems.placeItems(this.transitionItemsArray, true);
			}
			
			this.gridItems.placeItems(this[`${mode}TreasureChests`]);
			this.gridItems.placeItems(this.magicPillsArray);
			this.coins.placeCoins(this.coins.onGridCoins[mode])
			this.utils.root.tokens.tokensClass.placeTokens();
			this[`${mode}Baddies`].placeCastlesAndSoldiers(this);

			SetTileLimits.assignAboveBelowRightLeftCovered();
			
			this.heroJ = data.hero.j;
			this.heroI = data.hero.i;
			this.placeHero();
			
			this.initialPoint = {x: this.cont.x, y: this.cont.y};

			this.cont.calculatedWidth = data.cols * this.blockWidth;
			this.cont.calculatedHeight = data.rows * this.blockHeight;
			//this.changeBackground(this.utils.root.activeMode)

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
		}
	}
}