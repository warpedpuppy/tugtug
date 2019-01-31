import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
import TileColumn from './tileColumn';
export default function () {
	return {
		cont: new PIXI.Container(),
		background: new PIXI.Graphics(),
		foreground: new PIXI.Graphics(),
		orbsCont: new PIXI.Container(),
		ground: new PIXI.Graphics(),
		colSpacing: 200,
		colQ: undefined,
		cols: {},
		columns: [],
		utils: Utils,
		activeBrick: undefined,
		brickHeight: 50,
		groundHeight: 150,
		centralOrb: undefined,
		centralContainer: new PIXI.Container(),
		transition: false,
		currentOrb: undefined,
		orbs: [],
		init: function (app, parentCont, wh, spritesheet, action, hero) {
			this.hero = hero;
			this.app = app;
			this.parentCont = parentCont;
			this.wh = wh;
			this.spritesheet = spritesheet;
			this.colQ = 4;//this.wh.canvasWidth / this.colSpacing;
			this.action = action;

			this.centralOrb = new PIXI.Sprite(spritesheet.textures['circle.png']);
			this.centralOrb.scale.set(0.5);  
			this.centralOrb.radius = this.centralOrb.width / 2;
			this.centralOrb.tint  = 0xFF00FF;
			this.centralOrb.x = wh.canvasWidth / 2;
			this.centralOrb.y = wh.canvasHeight / 2;
			this.centralOrb.anchor.set(0.5);
			this.currentOrb = this.centralOrb;
			this.orbsCont.addChild(this.centralOrb);
			//this.orbs.push(this.centralOrb)

			this.secondOrb = new PIXI.Sprite(spritesheet.textures['circle.png']);
			this.secondOrb.scale.set(0.75);
			this.secondOrb.tint = 0xFF33FF;
			this.secondOrb.radius = this.secondOrb.width / 2;
			this.secondOrb.x = (wh.canvasWidth / 2) + 300;
			this.secondOrb.y = (wh.canvasHeight / 2);
			this.secondOrb.anchor.set(0.5);
			this.orbsCont.addChild(this.secondOrb);
			this.orbs.push(this.secondOrb);

			this.hero.cont.x = 0;
			this.hero.cont.y = this.hero.floor = -(this.centralOrb.width /2);
			this.centralContainer.addChild(this.hero.cont);
			this.centralContainer.x = wh.canvasWidth / 2;
			this.centralContainer.y = wh.canvasHeight / 2;
			this.parentCont.addChild(this.centralContainer);


			this.background.beginFill(0x00CCFF).drawRect(0,0,wh.canvasWidth, wh.canvasHeight).endFill();

			this.cont.addChild(this.background);
			this.cont.addChild(this.orbsCont    );

			this.startXs = ["TL", "BL", "TR", "BR"];
			for(let i = 0; i < this.colQ; i ++){
				this.tileColumn = TileColumn();
				this.tileColumn.init(app, this.cont, wh, spritesheet, this.startXs[i], action);
				this.tileColumn.addToStage();
				this.columns.push(this.tileColumn);
			}

			this.t = new PIXI.Graphics();
			this.parentCont.addChild(this.  t)
			
		},
		addToStage: function () {
			// this.parentCont.addChild(this.cont);
			this.parentCont.addChildAt(this.cont, 0);
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont);

		},
		resize: function () {

		},
		switchPlanets: function (newPlanet) {
			//move foreground so it has xy of the new planet
			let newX = (this.wh.canvasWidth / 2) - newPlanet.x;
			this.orbsCont.x = newX;
			this.hero.cont.y = this.hero.floor = -newPlanet.radius;
			this.currentOrb = newPlanet;
			this.transition = false;
		},
		animate: function () {
			this.centralContainer.rotation += this.utils.deg2rad(this.action.vx);

			for(let i = 0; i < this.colQ; i ++){
				this.columns[i].animate();
			}


			
			let globalPoint = this.hero.heroJump.body.toGlobal(this.app.stage, undefined, true);

			this.t.clear();

			this.t.beginFill(0x000000).drawCircle(0,0,33).endFill();
			this.t.x = globalPoint.x;
			this.t.y = globalPoint.y;
			let tempCircle = {
				x: globalPoint.x,
				y: globalPoint.y,
				radius: 0
			}


			for (let i = 0; i < this.orbs.length; i ++) {
				if(this.orbs[i] !== this.currentOrb && 
					!this.transition && 
					this.utils.circleToCircleCollisionDetection(this.orbs[i], tempCircle)) {
					console.log('hit');
					//this.transition = true;
					//this.switchPlanets(this.orbs[i]);
				}
			}
		
		
			
		}
	}
}