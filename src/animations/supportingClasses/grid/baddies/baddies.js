import Utils from '../../../utils/utils';
import Assets from '../../../utils/assetCreation';
import Config from '../../../animationsConfig';
import Baddy from './baddy';
import BaddyAction from './baddyAction';
export default function () {
	return {
		utils:Utils,
		spears: [],
		castles: [],
		soldiers: [],
		solderPerGridSquareQ: 1,
		baddiesPool: [],
		baddy: Baddy(),
		init: function () {
		
		},
		placeCastlesAndSoldiers: function (gridBuild) {
			this.animate = this.animate.bind(this)

			let grid = this.utils.root.grid;
			let freeSpaces = gridBuild.freeSpaces;

			let soldierCounter = 0;
			for (let i = 0; i < freeSpaces.length; i ++) {
			
			//for (let i = 0; i < 1; i ++) {

				let determineContinue = Math.floor(Math.random()*10);
				if(determineContinue < 9) continue;

				let block = freeSpaces[i];
	
				
				let c;

				if (!this.castles[i]) {
					c = Assets.Sprite('castle.png');
					c.anchor.set(0.5);
					c.scale.set(0.25);
					this.castles.push(c);
				} else {
					c = this.castles[i];

				}

				let bw = Config[`${this.utils.root.activeMode}BlockSize`][0];
				let bh = Config[`${this.utils.root.activeMode}BlockSize`][1];

				// this.utils.root.grid.blockWidth = bw;
				// this.utils.root.grid.blockHeight = bh;
				c.x = block[0] + bw / 2;
				c.y = block[1] + bh / 2;

				gridBuild.cont.addChild(c);
				
				for (let j = 0; j < this.solderPerGridSquareQ; j ++) {
					
					let s;
					if (!this.soldiers[soldierCounter]) {
						s = Baddy().init('soldier.png');
						this.spears.push(s.classRef.spear)
						this.soldiers.push(s);
					} else {
						s = this.soldiers[soldierCounter];
					}
					s.block = block;
					s.x = s.startX = s.classRef.spear.x = block[0] + bw / 2;
					s.y = s.startY = s.classRef.spear.y = block[1] + bh / 2;
					s.classRef.addToStage();
					
					soldierCounter ++;
				}
			}
			this.baddyAction = BaddyAction(this.soldiers, this.spears);
		},
		returnBaddiesToZero: function () {
			for (let j = 0; j < this.solderPerGridSquareQ; j ++) {
				this.soldiers[j].x = this.soldiers[j].startX;
			}
		},
		removeCastlesAndSoldiers: function () {
			let fQ = this.parent.grid.freeSpaces.length;
			let counter = 0;
			for (let i = 0; i < this.castles.length; i ++) {
				let c = this.castles[i];
				this.parent.grid.cont.removeChild(c);
				
				for (let j = 0; j < this.solderPerGridSquareQ; j ++) {
					let soldier = this.soldiers[counter];
					soldier.classRef.removeFromStage();
					//this.parent.grid.cont.removeChild(soldier);
					counter ++;
				}
			}
		},
		addToStage: function () {
			this.grid.cont.addChild(this.body);
			this.grid.cont.addChild(this.spear);
		},
		removeFromStage: function () {
			this.grid.cont.removeChild(this.body);
			this.grid.cont.removeChild(this.spear);
		},
		resize: function () {

		},
		animate: function () {
			if(this.pause)return;
			this.baddyAction.animate();
		}
		
		
	}
}
