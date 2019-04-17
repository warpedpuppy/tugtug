import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
import RainbowSwirls from './rainbowSwirls';
import Tweens from '../../utils/tweens';
import Planets from './planet';
import JumpPoints from './jumpPoints';
import JumpTokenUnlocked from './jumpTokenUnlocked';
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
		landingOrb: undefined,
		orbs: [],
		utils: Utils,
		pauseCounter: 0,
		delay: 10,
		colors: [0xFF00FF, 0xFF0000, 0xFFFF00, 0xFF9900, 0x33FF00],
		gridIndex: 5,
		pause: false,
		tokenTaken: false,
		testCircle: {},
		dotsArray: [],
		dotsContArray: [],
		jumpPoints: JumpPoints,
		jumpTokenUnlocked: JumpTokenUnlocked,
		//writeItOut: true,
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

				for (let j = 0; j < this.colQ; j ++) {

					let cont = Planets().init(i, j, counter);
					
					this.orbsCont.addChild(cont);
					this.orbs.push(cont);
					
					if (counter === centerOrb) {
						this.centerOrbIndex = centerOrb;
						this.currentOrb = this.landingOrb = this.centralOrb = cont;
						//this.currentOrb.alpha = 0.5;
					}

					let dotQ = 10;
					let dist =  cont.radius + 20;
					let dotsCont = Assets.Container();
					for (let k = 0; k < dotQ; k++) {
						let dot = this.dot();
			            dot.x = dist * Math.cos( ( 2 * Math.PI) * k / dotQ);
			            dot.y =  dist * Math.sin( ( 2 * Math.PI) * k / dotQ);
			            dotsCont.addChild(dot);
			            this.dotsArray.push(dot);
			        }
			        dotsCont.rotate = -cont.rotate;
			        dotsCont.x = cont.x;
			        dotsCont.y = cont.y;
			        this.orbsCont.addChild(dotsCont);
			        this.dotsContArray.push(dotsCont);

					counter ++;
					this.widths.push(cont.width);
				
				}
			}
	

			this.background.beginFill(0x000066).drawRect(0,0,this.wh.canvasWidth, this.wh.canvasHeight).endFill();

			this.cont.addChild(this.background);
			this.cont.addChild(this.orbsCont);


			this.startXs = ["TL", "BL", "TR", "BR"];
			for (let i = 0; i < this.tileColQ; i ++) {
				this.tileColumn = RainbowSwirls();
				this.tileColumn.init(this.cont, this.startXs[i], action);
				this.tileColumn.addToStage();
				this.columns.push(this.tileColumn);
			}

			// this.test = Assets.Graphics();
			// this.cont.addChild(this.test);
			this.jumpPoints.init(this);

		},
		dot: function () {
			let dot = Assets.Graphics();
			dot.beginFill(0xFFFF00).drawCircle(0,0,5).endFill();
			return dot;
		},
		addToStage: function () {

			this.currentOrb = this.landingOrb;
			this.orbsCont.pivot = Assets.Point(this.landingOrb.x, this.landingOrb.y)
			this.orbsCont.x = (this.wh.canvasWidth / 2);
			this.orbsCont.y = (this.wh.canvasHeight / 2);
			this.hero.cont.y = this.utils.canvasHeight / 2;
			this.pause = false;
			this.parentCont.addChildAt(this.cont, 1);
			this.jumpPoints.addToStage();
		},
		setUp: function () {
			this.hero.activeHero.cont.y = this.hero.activeHero.floor = -(this.widths[this.currentOrb.index] / 2);
			this.addSpaceShip();
			this.addToken();
		},
		addSpaceShip: function () {
			let spaceShipOrbIndex = this.currentOrb.index + 1;
			this.spaceShipOrb = this.orbs[spaceShipOrbIndex];
			let spaceShip = this.utils.root.grid.gridBuild.spaceShip;
			spaceShip.x = spaceShip.y = 0;
			this.spaceShipOrb.addChild(spaceShip)
		},
		addToken: function () {
			if (!this.tokenTaken) {
				let tokenOrbIndex = this.currentOrb.index - 1;
				this.tokenOrb = this.orbs[tokenOrbIndex];
				this.token = this.utils.root.grid.gridBuild.tokens[3];
				this.token.x = this.token.y = 0;
				this.dotsContArray[tokenOrbIndex].addChild(this.token)
				this.tokenLock = Assets.Sprite("tokenLock.png");
				this.tokenLock.anchor.set(0.5);
				this.dotsContArray[tokenOrbIndex].addChild(this.tokenLock)
			}
		},
		removeFromStage: function () {
			Tweens.killAll();

			this.parentCont.removeChild(this.cont);
			this.jumpPoints.removeFromStage();
			//this.parentCont.removeChild(this.orbsCont);
		},
		resize: function () {
			// this.background.clear();
			// this.background.beginFill(0x000066).drawRect(0,0,this.utils.canvasWidth, this.utils.canvasHeight).endFill();

			// this.orbsCont.x = (this.utils.canvasWidth / 2) - this.currentOrb.x;
			// this.orbsCont.y = (this.utils.canvasHeight / 2) - this.currentOrb.y;
		},
		switchPlanets: function (newPlanet) {
				//this.orbsCont.pivot = Assets.Point(newPlanet.x, newPlanet.y)
				this.pause = true;
				let newX = (this.utils.canvasWidth / 2);
				let newY = (this.utils.canvasHeight / 2);
				this.hero.activeHero.floor = -newPlanet.radius;
				this.currentOrb = newPlanet;
				Tweens.planetJump(this.orbsCont, this.hero.activeHero.cont, newPlanet, this.makeTransitionComplete);
			
				if (newPlanet === this.spaceShipOrb) {
					this.hero.activeHero.cont.y = 0;
					//this.animate();
					this.pause = true;
					this.utils.root.jump.jumpAction.pause = true;
					
					this.utils.root.grid.gridBuild.spaceShip.classRef.returnHome();
				} else if (newPlanet === this.tokenOrb && this.jumpPoints.tokenEarned) {
					//ADD LOCK CODE HERE
					this.tokenTaken = true;
					this.utils.root.levelSlots.fillSlot(this.token);
				}
		},
		makeTransitionComplete: function () {
			
			this.pause = false;
			this.transition = false;
		},
		animate: function () {

		

			if(this.pause)return;

			for (let i = 0; i < this.tileColQ; i ++) {
				this.columns[i].animate();
			}
			

			
			let globalPoint = this.hero.activeHero.body.toGlobal(this.app.stage);
 
			this.tempCircle = {
				x: globalPoint.x,
				y: globalPoint.y,
				radius: 33
			}

			// this.test.clear();
			// this.test.beginFill(0xFF0000).drawCircle(0,0,50).endFill();
			// this.test.x = globalPoint.x;
			// this.test.y = globalPoint.y;

			

			if (this.pauseCounter < this.delay) {
				this.pauseCounter ++;
				return;
			}

			for (let i = 0; i < this.dotsArray.length; i ++) {
				let dot = this.dotsArray[i]
				let globalPoint2 = dot.toGlobal(this.app.stage, undefined, true);
				let tempCircle2 = {
					x: globalPoint2.x,
					y: globalPoint2.y,
					radius: 5
				}

				if(this.utils.circleToCircleCollisionDetection(this.tempCircle, tempCircle2)[0]) {
					dot.parent.removeChild(dot);
					this.dotsArray.splice(i, 1);
					this.jumpPoints.dotHit();
				}


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

				let dotsCont = this.dotsContArray[i];
				dotsCont.rotation += this.utils.deg2rad(dotsCont.rotate);

				if(orb !== this.currentOrb && 
					!this.transition && 
					this.utils.circleToCircleCollisionDetection(this.tempCircle, tempCircle2)[0]) {
					this.transition = true;
					this.switchPlanets(orb);
				}
			}
		}
	}
}