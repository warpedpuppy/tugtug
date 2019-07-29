import Assets from '../../../../utils/assetCreation';
import Utils from '../../../../utils/utils';
import TreasureAnimation from './treasureAnimation';
import Config from '../../../../animationsConfig';
import TreasureChest from './treasureChest';
export default function () {
	return {
	chests: [],
	utils: Utils,
	hit: false,
	activeChest: undefined,
	line: undefined,
	radialQ: undefined,
	radialCont: Assets.Container(),
	ringCont: Assets.Container(),
	radials: [],
	gravity: 0.3,
	counter: 0,
	bounce: 0.8,
	animationLimit: 200,
	vys: [-10, -1],
	vxs: [-8, 8],
	fallSpeeds: [2, 4],
	edgeBuffer: 200,
	animationHappening: false,
	treasureAnimation: TreasureAnimation(),
	init: function () {
		this.treasureAnimation.init();
	},
	createAndReturnChests: function (q) {
		this.chestQ = q;
		let arr = [];
		for (let i = 0; i < this.chestQ; i ++) {
			// let c = Assets.Sprite('treasureChest.png');
			// c.scale.set(this.utils.randomNumberBetween(0.75, 0.85));
			// c.anchor.set(0.5);
			// c.name = "treasureChest";
			// c.fallSpeed = this.utils.randomNumberBetween(this.fallSpeeds[0], this.fallSpeeds[1]);
		
   //      	c.variance = this.utils.randomNumberBetween(5, 20);
   //      	c.rotateSpeed = this.utils.randomNumberBetween(0.001, 0.0025);

			arr.push(TreasureChest().build());
		}
		//this.treasureAnimation.init();
		return arr;
	},
	playAnimation: function (activeChest) {
		//this.animationHappening = true;
		this.treasureAnimation.playAnimation(activeChest);
	},
	animateSpecial: function () {
		this.treasureAnimation.animateSpecial();
	},
	animate: function () {
		for (let i = 0; i < this.utils.root.grid[`${this.utils.root.activeMode}TreasureChests`]; i ++) {
			let c = this.utils.root.grid[`${this.utils.root.activeMode}TreasureChests`][i];
			c.rotation = this.utils.cosWave(this.utils.deg2rad(0), this.utils.deg2rad(c.variance), c.rotateSpeed);
			
		}
	}
}

}