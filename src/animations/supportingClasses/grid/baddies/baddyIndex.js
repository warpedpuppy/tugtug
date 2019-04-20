import Utils from '../../../utils/utils';
import Assets from '../../../utils/assetCreation';
import Config from '../../../animationsConfig';
import Baddy from './baddy';
import BaddyAction from './baddyAction';
import BaddyHouse from './baddyHouse';
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
			this.animate = this.animate.bind(this);
		},
		placeCastlesAndSoldiers: function (gridBuild) {
			
			let freeSpaces = gridBuild.freeSpaces,
			    soldierCounter = 0,
			    loopingQ = freeSpaces.length;
			 
			//for (let i = 0; i < loopingQ; i ++) {
			for (let i = 0; i < 1; i ++) {
			
				// let determineContinue = Math.floor(Math.random()*10);
				// if(determineContinue < 9) continue;

				let freeSpacesIndex = Math.floor(Math.random() * freeSpaces.length);

				let block = freeSpaces[freeSpacesIndex],
				    c;

				if (!this.castles[i]) {
					c = BaddyHouse(gridBuild).init();
					// c = Assets.Sprite('castle.png');
					// c.anchor.set(0.5);
					// c.scale.set(0.25);
					this.castles.push(c);
				} else {
					c = this.castles[i];

				}

				let bw = Config[`${this.utils.root.activeMode}BlockSize`][0];
				let bh = Config[`${this.utils.root.activeMode}BlockSize`][1];

				c.x = block[0] + bw / 2;
				c.y = block[1] + bh / 2;

				c.classRef.addToStage();
				
				for (let j = 0; j < this.solderPerGridSquareQ; j ++) {
					
					let s;
					if (!this.soldiers[soldierCounter]) {
						s = Baddy(gridBuild).init('soldier.png');
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
				this.utils.root.grid.gridBuild.freeSpaces.splice(freeSpacesIndex, 1);
			}

			this.baddyAction = BaddyAction(this.soldiers, this.spears, gridBuild);
		},
		removeCastlesAndSoldiers: function () {
			
			this.soldiers.forEach((s, i) => {
				s.classRef.removeFromStage();
				if (this.castles[i]) {
					this.castles[i].classRef.removeFromStage();
				}
			})
			this.castles.length = 0;
			this.soldiers.length = 0;
		},
		animate: function () {
			if(this.pause)return;
			this.baddyAction.animate();
		}
		
		
	}
}
