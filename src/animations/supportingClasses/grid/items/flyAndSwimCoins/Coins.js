import Utils from '../../../../utils/utils';
import Assets from '../../../../utils/assetCreation';

export default function Coins() {
	return {
		utils: Utils,
		onGridCoins: {},
		addCoinToGrid: function () {

			let coinsInArray = this.onGridCoins[this.utils.root.activeMode].length;
			let totalCoins = this.utils.root.score[`${this.utils.root.activeMode}Total`];

			if (coinsInArray < totalCoins) {
				let num = Math.ceil(Math.random() * 11);
				let coin = Assets.Sprite(`jewel${num}.png`);
				coin.hit = false;

				
				coin.anchor.set(0.5);
				coin.tint = 0xB29700;
				this.onGridCoins[this.utils.root.activeMode].push(coin);

				//add to stage
				this.placeCoin(coin);
			}

			
		},
		placeCoin: function (coin) {
			//this needs its own function
			let coinSpaces = this.utils.root.grid.gridBuild.coinSpaces;
			let freeSpaces = this.utils.root.grid.gridBuild.freeSpaces;
			let blockWidth = this.utils.root.grid.gridBuild.blockWidth;
			let blockHeight = this.utils.root.grid.gridBuild.blockHeight;
			let coinSpacePossible = false;
			if (coinSpaces.length) {
				coinSpacePossible = true;
			}
			//if there are coinSpaces and random 10 < 5, use one of those spaces
			let coinSpaceUse = Math.floor(Math.random()* 10) < 5;
			if (freeSpaces.length === 0 || (coinSpacePossible && coinSpaceUse)) {

				let i = Math.floor(Math.random() * coinSpaces.length);
				coin.x = coinSpaces[i][0] + blockWidth / 2;
				coin.y = coinSpaces[i][1] + blockHeight / 2;
				coin.currentSpace = freeSpaces[i];
				this.utils.root.grid.gridBuild.cont.addChild(coin); 

			} else {
				
				let i = Math.floor(Math.random() * freeSpaces.length);

				coin.x = freeSpaces[i][0] + blockWidth / 2;
				coin.y = freeSpaces[i][1] + blockHeight / 2;
				
				coin.currentSpace = freeSpaces[i];
				coinSpaces.push(freeSpaces[i])
				freeSpaces.splice(i, 1);
				this.utils.root.grid.gridBuild.cont.addChild(coin);

			}

			coin.startPointX = coin.x; 
			coin.differential = this.utils.randomNumberBetween(10, 30);
			coin.speed = this.utils.randomNumberBetween(0.001, 0.005);

			coin.startPointY = coin.y; 
			coin.differential = this.utils.randomNumberBetween(10, 30);
			coin.speed = this.utils.randomNumberBetween(0.001, 0.005);

		},
		placeCoins: function (array) {
			//this needs its own function because coins can share spaces
			array.forEach((coin, index) => {
				this.placeCoin(coin);
			})
		},
	}
}