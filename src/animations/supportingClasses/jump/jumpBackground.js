import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
import TileColumn from './tileColumn';
import { TweenMax, Elastic } from 'gsap';
export default function () {
	return {
		cont: new PIXI.Container(),
		background: new PIXI.Graphics(),
		foreground: new PIXI.Graphics(),
		orbsCont: new PIXI.Container(),
		ground: new PIXI.Graphics(),
		colSpacing: 200,
		colQ: 10,
		rowQ: 10,
		tileColQ: 4,
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
		utils: Utils,
		pauseCounter: 0,
		delay: 10,
		colors: [0xFF00FF, 0xFF0000, 0xFFFF00, 0xFF9900, 0x33FF00],
		init: function (app, parentCont, wh, spritesheet, action, hero) {

			this.hero = hero;
			this.app = app;
			this.parentCont = parentCont;
			this.wh = wh;
			this.spritesheet = spritesheet;
			this.action = action;

			this.makeTransitionComplete = this.makeTransitionComplete.bind(this);


			let centerOrb = Math.floor((this.rowQ * this.colQ) / 2) + 5;
			let counter = 0;

			for(let i = 0; i < this.rowQ; i ++){

				for(let j = 0; j < this.colQ; j ++){
					let cont = new PIXI.Container();
					let s = new PIXI.Sprite(spritesheet.textures['circleAlpha1.png']);
					s.anchor.set(0.5);
					let p = new PIXI.Sprite(spritesheet.textures['pinWheel.png']);
					p.anchor.set(0.5);
					cont.addChild(s);
					cont.addChild(p);
					cont.p = p;
					let color1, color2;
					color1 = this.colors[Math.floor(Math.random()*this.colors.length)];
					color2 = this.colors[Math.floor(Math.random()*this.colors.length)];
					while(color2 === color1){
						color2 = this.colors[Math.floor(Math.random()*this.colors.length)];
					}
					s.tint = color1;
					p.tint = color2;
					cont.rotate = this.utils.randomNumberBetween(-10, 10)
					cont.scale.set(this.utils.randomNumberBetween(0.25, 0.8));

					cont.radius = cont.r = cont.width / 2;
					cont.x = j * 350;//this.utils.randomNumberBetween(300, 400);
					cont.y = i * 350;//this.utils.randomNumberBetween(300, 400);
	
					this.orbsCont.addChild(cont);
					this.orbs.push(cont);
					
					if(counter === centerOrb){
						this.currentOrb = this.centralOrb = cont;
					}
					counter ++;
				
				}
			}
	
			
			this.orbsCont.x = (this.wh.canvasWidth / 2) - this.currentOrb.x;
			this.orbsCont.y = (this.wh.canvasHeight / 2) - this.currentOrb.y;



			this.hero.cont.x = 0;
			this.hero.cont.y = this.hero.floor = -(this.centralOrb.width /2);
			this.centralContainer.addChild(this.hero.cont);
			this.centralContainer.x = wh.canvasWidth / 2;
			this.centralContainer.y = wh.canvasHeight / 2;
			this.parentCont.addChild(this.centralContainer);


			this.background.beginFill(0x000066).drawRect(0,0,wh.canvasWidth, wh.canvasHeight).endFill();

			this.cont.addChild(this.background);
			this.parentCont.addChild(this.orbsCont);

			this.startXs = ["TL", "BL", "TR", "BR"];
			for(let i = 0; i < this.tileColQ; i ++){
				this.tileColumn = TileColumn();
				this.tileColumn.init(app, this.cont, wh, spritesheet, this.startXs[i], action);
				this.tileColumn.addToStage();
				this.columns.push(this.tileColumn);
			}

			
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
			let newX = (this.wh.canvasWidth / 2) - newPlanet.x;
			let newY = (this.wh.canvasHeight / 2) - newPlanet.y;
			this.hero.floor = -newPlanet.radius;
			this.currentOrb = newPlanet;
			TweenMax.to(this.orbsCont, 1.5, {x: newX, y: newY, ease: Elastic.easeOut, onComplete: this.makeTransitionComplete})
			TweenMax.to(this.hero.cont, 1.5, {y:  -newPlanet.radius, ease: Elastic.easeOut})
		},
		makeTransitionComplete: function () {

			this.transition = false;
		},
		animate: function () {
			this.centralContainer.rotation += this.utils.deg2rad(this.action.vx);

			for(let i = 0; i < this.tileColQ; i ++){
				this.columns[i].animate();
			}


			
			let globalPoint = this.hero.heroJump.body.toGlobal(this.app.stage, undefined, true);
			let tempCircle = {
				x: globalPoint.x,
				y: globalPoint.y,
				radius: 33
			}

			if(this.pauseCounter < this.delay){
				this.pauseCounter ++;
				return;
			}

			for (let i = 0; i < this.orbs.length; i ++) {
				let orb = this.orbs[i];
				orb.p.rotation += this.utils.deg2rad(orb.rotate);
				let globalPoint2 = orb.toGlobal(this.app.stage, undefined, true);
				let tempCircle2 = {
					x: globalPoint2.x,
					y: globalPoint2.y,
					radius: orb.radius
				}

				if(orb !== this.currentOrb && 
					!this.transition && 
					this.utils.circleToCircleCollisionDetection(tempCircle, tempCircle2)[0]) {
					this.transition = true;
					this.switchPlanets(orb);
				}
			}

		
		
		
			
		}
	}
}