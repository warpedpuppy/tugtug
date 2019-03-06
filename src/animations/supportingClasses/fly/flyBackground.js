import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
import Castles from './castles';
export default function () {
	return {
		cont: Assets.Container(),
		grassTexture: 'grass.png',
		foreground: Assets.Graphics(),
		utils: Utils,
		colors: [0xFF00FF, 0xFF0000, 0xFFFF00, 0xFF9900, 0x33FF00],
		boltQ: 30,
		timer: undefined,
		flashCounter: 0,
		flashLimits: 10,
		gridIndex: 1,
		sizeIncrement: 1,
		soldiers: [],
		init: function (parent) {
			this.parent = parent;
			this.app = this.utils.app;
			this.parentCont = parent.stage;

			this.hero = this.utils.hero;
			let wh = this.wh = this.utils.wh;
			this.spritesheet = this.utils.spritesheet;

			//this.lightningBoltsBuild();
			// this.lightningStorm = this.lightningStorm.bind(this);
			// this.clearLightening = this.clearLightening.bind(this);
			//this.timer = setTimeout(this.lightningStorm, 1500)

			this.placeCastles(parent.grid)
		},
		placeCastles: function (grid) {
			let freeSpaces = grid.freeSpaces;
			//console.log('free space array', freeSpaces, freeSpaces.length);

			for (let i = 0; i < freeSpaces.length; i ++) {

				let block = freeSpaces[i];
				//console.log('block = ', block)
				let c = Assets.Sprite('castle.png');
				c.alpha = 0;
				c.anchor.set(0.5);

				c.x = block[0] + this.parent.grid.blockWidth / 2;
				c.y = block[1] + this.parent.grid.blockHeight / 2;
				grid.cont.addChild(c);

				for(let i = 0; i < 3; i ++){
	
					let s = (i < 2)?Assets.Sprite('soldier.png'):Assets.Sprite('horse.png');
					s.anchor.set(0.5);
					s.speed = this.utils.randomNumberBetween(0.01, 0.05);
					s.x = s.startX = block[0] + this.parent.grid.blockWidth / 2;
					s.y = s.startY = block[1] + this.parent.grid.blockHeight / 2;
					grid.cont.addChild(s);
					this.soldiers.push(s);
				}
			}

		},
		lightningStorm: function () {
			this.foreground.visible = true;
			this.boltCont.visible = true;
			this.timer = setTimeout(this.clearLightening, 40)
		},
		clearLightening: function () {
			this.foreground.visible = false;
			this.boltCont.visible = false;
			this.flashCounter ++;
			if(this.flashCounter < this.flashLimits){
				this.timer = setTimeout(this.lightningStorm, 40)
			} else {
				this.flashCounter = 0;
				this.timer = setTimeout(this.lightningStorm, 1500)
			}

		},
		lightningBoltsBuild: function () {

			let boltCont = Assets.Container();
			for(let i = 0; i < this.boltQ; i ++){
				let widthStore = 0, 
				    startX = this.utils.randomNumberBetween(0, this.wh.canvasWidth),
				    storeRot, 
				    storeHeight, 
				    storeX, 
				    storeY;
				while (widthStore < this.wh.canvasHeight) {
					let bolt = Assets.Sprite(this.spritesheet.textures['line.png']);
					bolt.height = 5;
					bolt.x = storeX = (widthStore === 0)?startX:storeX + (Math.cos(storeRot) * storeHeight);
					bolt.y = storeY = (widthStore === 0)?0:storeY + (Math.sin(storeRot) * storeHeight);
					bolt.width = storeHeight = this.utils.randomNumberBetween(20, 200);
					bolt.rotation = storeRot = this.utils.deg2rad((this.utils.randomNumberBetween(180, 0)));
					boltCont.addChild(bolt);
					widthStore += storeHeight;
				}
			}
			boltCont.visible = false;
			this.cont.addChild(boltCont);
			this.boltCont = boltCont;
		},
		addToStage: function () {
			
			this.parentCont.addChildAt(this.cont, 0);
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont);
			//this.parentCont.removeChild(this.orbsCont);
		},
		resize: function () {
			this.background.clear();
			this.background.beginFill(0xFF00FF).drawRect(0,0,this.utils.canvasWidth, this.utils.canvasHeight).endFill();
		},
		animate: function () {
	
		}
	}
}