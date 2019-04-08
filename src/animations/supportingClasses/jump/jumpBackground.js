import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
import RainbowSwirls from './rainbowSwirls';
import Tweens from '../../utils/tweens';
export default function () {
	return {
		cont: Assets.Container(),
		background: Assets.Graphics(),
		foreground: Assets.Graphics(),
		orbsCont: Assets.Container(),
		ground: Assets.Graphics(),
		colSpacing: 200,
		colQ: 10,
		rowQ: 10,
		tileColQ: 4,
		cols: {},
		columns: [],
		activeBrick: undefined,
		brickHeight: 50,
		groundHeight: 150,
		centralOrb: undefined,
		transition: false,
		currentOrb: undefined,
		orbs: [],
		utils: Utils,
		pauseCounter: 0,
		delay: 10,
		colors: [0xFF00FF, 0xFF0000, 0xFFFF00, 0xFF9900, 0x33FF00],
		gridIndex: 5,
		pause: false,
		init: function (parentCont, action) {

			this.hero = this.utils.hero;
			this.app = this.utils.app;
			this.parentCont = parentCont;
			this.wh = this.utils.wh;
			this.spritesheet = this.utils.spritesheet;
			this.action = action;

			this.makeTransitionComplete = this.makeTransitionComplete.bind(this);


			let centerOrb = this.test = Math.floor((this.rowQ * this.colQ) / 2) + 5;
			let counter = 0;
			this.widths = [];
			for(let i = 0; i < this.rowQ; i ++){

				for(let j = 0; j < this.colQ; j ++){
					let cont = Assets.Container();
					let s = Assets.Sprite('circleAlpha1.png');
					s.anchor.set(0.5);
					let p = Assets.Sprite('pinWheel.png');
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
					cont.rotate = this.utils.randomNumberBetween(-10, 10);
					let scale = this.utils.randomNumberBetween(0.25, 0.8);
					cont.scale.set(scale);

					cont.radius = cont.r = cont.width / 2;
					cont.x = j * 350;//this.utils.randomNumberBetween(300, 400);
					cont.y = i * 350;//this.utils.randomNumberBetween(300, 400);
					cont.index = counter;
					this.orbsCont.addChild(cont);
					this.orbs.push(cont);
					
					if (counter === centerOrb) {
						this.centerOrbIndex = centerOrb;
						this.currentOrb = this.centralOrb = cont;
						//this.currentOrb.alpha = 0.5;
					}

					// if (counter ==== (centerOrb + 1)) {

					// }

					counter ++;
					this.widths.push(cont.width);
				
				}
			}
	
			this.orbsCont.pivot = Assets.Point(this.currentOrb.x, this.currentOrb.y)
			this.orbsCont.x = (this.wh.canvasWidth / 2);
			this.orbsCont.y = (this.wh.canvasHeight / 2);

			// this.orbsCont.x = (this.wh.canvasWidth / 2) - this.currentOrb.x;
			// this.orbsCont.y = (this.wh.canvasHeight / 2) - this.currentOrb.y;


			this.background.beginFill(0x000066).drawRect(0,0,this.wh.canvasWidth, this.wh.canvasHeight).endFill();

			this.cont.addChild(this.background);
			this.cont.addChild(this.orbsCont);


			this.startXs = ["TL", "BL", "TR", "BR"];
			for(let i = 0; i < this.tileColQ; i ++){
				this.tileColumn = RainbowSwirls();
				this.tileColumn.init(this.cont, this.startXs[i], action);
				this.tileColumn.addToStage();
				this.columns.push(this.tileColumn);
			}

			
		},
		addToStage: function () {
			this.hero.cont.y = this.utils.canvasHeight / 2;
			this.hero.activeHero.cont.y = this.hero.activeHero.floor = -(this.widths[this.currentOrb.index] / 2);


			let spaceShipOrbIndex = this.currentOrb.index + 1;
			this.spaceShipOrb = this.orbs[spaceShipOrbIndex];
			
			this.pause = false;
			console.log('set jump hero y')
			this.cont.addChild(this.orbsCont);
			this.parentCont.addChildAt(this.cont, 1);
			//this.parentCont.addChildAt(this.orbsCont, this.parentCont.children.length - 2);
		},
		addSpaceShip: function () {
			let spaceShip = this.utils.root.grid.spaceShip;
			spaceShip.x = spaceShip.y = 0;
			this.spaceShipOrb.addChild(spaceShip)
		},
		removeFromStage: function () {
			Tweens.killAll();
			this.parentCont.removeChild(this.cont);
			//this.parentCont.removeChild(this.orbsCont);
		},
		resize: function () {
			this.background.clear();
			this.background.beginFill(0x000066).drawRect(0,0,this.utils.canvasWidth, this.utils.canvasHeight).endFill();

			this.orbsCont.x = (this.utils.canvasWidth / 2) - this.currentOrb.x;
			this.orbsCont.y = (this.utils.canvasHeight / 2) - this.currentOrb.y;
		},
		switchPlanets: function (newPlanet) {
			//this.orbsCont.pivot = Assets.Point(newPlanet.x, newPlanet.y)
			let newX = (this.utils.canvasWidth / 2);
			let newY = (this.utils.canvasHeight / 2);
			this.hero.activeHero.floor = -newPlanet.radius;
			this.currentOrb = newPlanet;
			Tweens.planetJump(this.orbsCont, this.hero.activeHero.cont, newPlanet, this.makeTransitionComplete);
			// TweenMax.to(this.orbsCont.pivot, 1.5, {x: newPlanet.x, y: newPlanet.y, ease: Elastic.easeOut})
			// TweenMax.to(this.orbsCont, 1.5, {x: newX, y: newY, ease: Elastic.easeOut, onComplete: this.makeTransitionComplete})
			// TweenMax.to(this.hero.activeHero.cont, 1.5, {y:  -newPlanet.radius, ease: Elastic.easeOut})

			if (newPlanet === this.spaceShipOrb) {
				this.pause = true;
				this.utils.root.grid.spaceShip.classRef.returnHome();
			}
		},
		makeTransitionComplete: function () {

			this.transition = false;
		},
		animate: function () {
			// this.centralContainer.rotation += this.utils.deg2rad(this.action.vx);
			if(this.pause)return

			for (let i = 0; i < this.tileColQ; i ++) {
				this.columns[i].animate();
			}


			
			let globalPoint = this.hero.activeHero.body.toGlobal(this.app.stage, undefined, true);
			let tempCircle = {
				x: globalPoint.x,
				y: globalPoint.y,
				radius: 33
			}

			if (this.pauseCounter < this.delay){
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