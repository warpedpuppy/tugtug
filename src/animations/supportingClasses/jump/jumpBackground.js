import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
import Config from '../../animationsConfig';
import RainbowSwirls from './rainbowSwirls';
import Tweens from '../../utils/tweens';
import Planets from './planet';
//import JumpPoints from './jumpPoints';
import JumpTokenUnlockedGraphic from './jumpTokenUnlocked';
import SpaceGremlin from './spaceGremlin';
import ThreeInARow from './threeInARow';
export default function () {
	return {
		cont: Assets.Container(),
		background: Assets.Graphics(),
		foreground: Assets.Graphics(),
		orbsCont: Assets.Container(),
		ground: Assets.Graphics(),
		colSpacing: 200,
		colQ: Config.spaceColQ,
		rowQ: Config.spaceRowQ,
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
		dotOP: [],
		eatenDots: [],
		dotsContArray: [],
		gremlinContsArray: [],
		//jumpPoints: JumpPoints,
		jumpTokenUnlocked: false,
		jumpTokenUnlockedGraphic: JumpTokenUnlockedGraphic,
		jumpTokenTaken: false,
		dotEatBoolean: true,
		spacer: 250,
		startScale: 0.25,
		spaceGremlin: SpaceGremlin,
		orbListen: true,
		worldScale: 0.5,
		//writeItOut: true,
		init: function (parentCont, action) {
			this.hero = this.utils.hero;
			this.app = this.utils.app;
			this.parentCont = parentCont;
			this.wh = this.utils.wh;
			this.spritesheet = this.utils.spritesheet;
			this.action = action;

			this.jumpTokenUnlockedGraphic.init();
			
			this.makeTransitionComplete = this.makeTransitionComplete.bind(this);


			let centerOrb = this.test = Math.floor((this.rowQ * this.colQ) / 2) + 5;
			let counter = 0;
			this.widths = [];

			// //build planet object pool
			 let totalPlanets = this.rowQ * this.colQ;

			// //dotsCont object pool
			 let totalDotsCont = this.rowQ * this.colQ;

			// //dot object pool

			// //gremlinCont object pool
			 let totalGremlinCont = this.rowQ * this.colQ;

			// //gremlin object pool


			for (let i = 0; i < this.rowQ; i ++) {

				for (let j = 0; j < this.colQ; j ++) {

					let cont = Planets().init(i, j, counter, this.spacer, this.colors, this.startScale);
					
					this.orbsCont.addChild(cont);
					this.orbs.push(cont);
					
					if (counter === centerOrb) {
						this.centerOrbIndex = centerOrb;
						this.currentOrb = this.landingOrb = this.centralOrb = cont;
						//this.currentOrb.alpha = 0.5;
					}

					let dotQ = this.dotQ = Config.spaceDotsPerPlanet;
					let dist =  this.dist = cont.radius + 20;
					let dotsCont = Assets.Container();
					dotsCont.dist = dist;
					let gremlinCont = Assets.Container();
					for (let k = 0; k < dotQ; k++) {
						let dot = this.dot();
			            dot.x = dot.startX =  this.dist * Math.cos( ( 2 * Math.PI) * k /  this.dotQ);
			            dot.y =  dot.startY =  this.dist * Math.sin( ( 2 * Math.PI) * k /  this.dotQ);
			            dotsCont.addChild(dot);
			            this.dotOP.push(dot);
			            this.dotsArray.push(dot);
			        }
			        dotsCont.rotate = -cont.rotate;
			        dotsCont.x = cont.x;
			        dotsCont.y = cont.y;
			        this.orbsCont.addChild(dotsCont);

			        gremlinCont.y = cont.y;
					gremlinCont.x = cont.x;
					gremlinCont.rotation = this.utils.deg2rad(-90);
			        this.orbsCont.addChild(gremlinCont);

			        gremlinCont.center = (counter === centerOrb)?true:false;

			        this.dotsContArray.push(dotsCont);

					counter ++;
					this.widths.push(cont.width);

					// let test = Assets.Graphics();
					// test.beginFill(0xFFFF00).drawCircle(0,0,50).endFill();
					// //test.y = 200;
					// gremlinCont.addChild(test)

					let gremlin = this.spaceGremlin.buildGremlin();
					gremlinCont.speed = this.utils.deg2rad(this.utils.randomNumberBetween(-2, 2));
					gremlin.y = -cont.width / 2;
					gremlinCont.gremlin = gremlin;
					gremlin.hit = false;
					gremlinCont.addChild(gremlin);
					this.gremlinContsArray.push(gremlinCont)
				
				}
			}

			//move hero to orbsCont
			this.utils.hero.cont.scale.set(this.worldScale)
			this.orbsCont.scale.set(this.worldScale)

			// TESTING
            this.threeInARow = ThreeInARow.init(this.orbs, this.spacer, this.colors, this.startScale, this.orbsCont, this.listeners);
            this.threeInARow.completeHandler1();
            

	

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

			this.loopingQ = Math.max(this.orbs.length, this.dotsArray.length);

			// this.testGraphics = Assets.Graphics();
			// this.utils.root.stage.addChild(this.testGraphics)
		},
		buildBoard: function () {

		},
		listeners: function (boolean) {
			this.orbListen = boolean;
			this.utils.root.keyHandler.onOff(boolean);
		},
		reset: function () {
			this.jumpTokenUnlocked = false;
			this.jumpTokenTaken = false;

			this.dotsContArray.forEach(cont => {
				for (let i = 0; i < Config.spaceDotsPerPlanet; i ++) {
					let dot;
					if (i < cont.children.length) {
						dot = cont.getChildAt(i);
					} else {
						dot = this.eatenDots[0];
						this.eatenDots.splice(0,1);
						this.dotsArray.push(dot);
						cont.addChild(dot);
					}
					let xDest = cont.dist * Math.cos( ( 2 * Math.PI) * i /  this.dotQ);
					let yDest = cont.dist * Math.sin( ( 2 * Math.PI) * i /  this.dotQ);
					dot.x = xDest;
					dot.y = yDest;
				}
			})

			//replace token lock
			//this.setUp();
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
			//this.jumpPoints.addToStage();
		},
		setUp: function () {
			this.hero.activeHero.cont.y = this.hero.activeHero.floor = -(this.widths[this.currentOrb.index] / 2);
			// this.addSpaceShip();
			// this.addToken();
		},
		// addSpaceShip: function () {
		// 	let spaceShipOrbIndex = this.currentOrb.index + 1;
		// 	this.spaceShipOrb = this.orbs[spaceShipOrbIndex];
		// 	let spaceShip = this.utils.root.grid.gridBuild.spaceShip;
		// 	spaceShip.x = spaceShip.y = 0;
		// 	//this.spaceShipOrb.addChild(spaceShip)
		// 	this.dotsContArray[spaceShipOrbIndex].addChild(spaceShip)
		// },
		// addToken: function () {
		// 	if (!this.tokenTaken) {
		// 		let tokenOrbIndex = this.currentOrb.index - 1;
		// 		this.tokenOrb = this.orbs[tokenOrbIndex];
		// 		this.token = this.utils.root.grid.gridBuild.tokens[3];
		// 		this.token.x = this.token.y = 0;
		// 		this.dotsContArray[tokenOrbIndex].addChild(this.token)
		// 		this.tokenLock = Assets.Sprite("tokenLock.png");
		// 		this.tokenLock.anchor.set(0.5);
		// 		this.dotsContArray[tokenOrbIndex].addChild(this.tokenLock)
		// 	}
		// },
		removeFromStage: function () {
			Tweens.killAll();

			this.parentCont.removeChild(this.cont);
			//this.jumpPoints.removeFromStage();
			//this.parentCont.removeChild(this.orbsCont);
		},
		resize: function () {

			//this.jumpPoints.resize();
			this.background.clear();
			this.background.beginFill(0x000066).drawRect(0,0,this.utils.canvasWidth, this.utils.canvasHeight).endFill();

			this.orbsCont.x = (this.utils.canvasWidth / 2);
			this.orbsCont.y = (this.utils.canvasHeight / 2);
		},
		switchPlanets: function (newPlanet, i) {
				//this.orbsCont.pivot = Assets.Point(newPlanet.x, newPlanet.y)

				

				let oldPlanet = this.currentOrb;

				this.pause = true;
				let newX = (this.utils.canvasWidth / 2);
				let newY = (this.utils.canvasHeight / 2);
				this.hero.activeHero.floor = -newPlanet.radius;
				this.currentOrb = newPlanet;

				

				let color1 = oldPlanet.color;
                let tint1 = oldPlanet.s.tint;

                let color2 = this.currentOrb.color;
                let tint2 = this.currentOrb.s.tint;

               
                oldPlanet.color = color2;
                oldPlanet.s.tint = tint2;

                this.currentOrb.color = color1;
                this.currentOrb.s.tint = tint1;

                 Tweens.tween(oldPlanet, 1.5, {
                    x: [this.currentOrb.x, oldPlanet.x], 
                    y: [this.currentOrb.y, oldPlanet.y]
                }, undefined, 'easeOutBounce')

            
                 Tweens.tween(this.currentOrb, 1.5, {
                    x: [oldPlanet.x, this.currentOrb.x],
                    y: [oldPlanet.y, this.currentOrb.y]
                }, undefined, 'easeOutBounce')



				Tweens.planetJump(this.orbsCont, this.hero.activeHero.cont, newPlanet, this.makeTransitionComplete.bind(this, i));

				if (newPlanet === this.spaceShipOrb) {
					this.hero.activeHero.cont.y = 0;
					this.pause = true;
					this.utils.root.jump.jumpAction.pause = true;
					this.utils.root.grid.gridBuild.spaceShip.classRef.returnHome();
				} else if (newPlanet === this.tokenOrb && this.jumpTokenUnlocked && !this.jumpTokenTaken) {

					this.jumpTokenTaken = true;
					this.utils.root.tokens.fillSlot(this.token);
				}
		},
		makeTransitionComplete: function (i) {
			this.threeInARow.completeHandler1();
			this.centerOrbIndex = i;
			this.pause = false;
			this.transition = false;
		},
		gremlinHit: function (index, gremlin) {
			//distribute dots to where they should be via tweens
			let cont = this.dotsContArray[index];
			//figure out how many dots to add back

			let dotQToAddBack = Config.spaceDotsPerPlanet - cont.children.length;
			
			for (let i = 0; i < Config.spaceDotsPerPlanet; i ++) {
				let dot;
				if (i < cont.children.length) {
					dot = cont.getChildAt(i);
				} else {
					dot = this.eatenDots[0];
					this.eatenDots.splice(0,1);
					this.dotsArray.push(dot);
					cont.addChild(dot);
				}
				let xDest = cont.dist * Math.cos( ( 2 * Math.PI) * i /  this.dotQ);
				let yDest = cont.dist * Math.sin( ( 2 * Math.PI) * i /  this.dotQ);
				Tweens.tween(dot, 1, 
				{
					x: [dot.x, xDest],
					y: [dot.y, yDest]
				}, 
				this.completeGremlinHit.bind(this, [gremlin, i]),
				'easeOutBounce');
			}
			//this.utils.root.score.jumpScore.jumpDotHit();
			
		},
		completeGremlinHit: function (arr) {
			
			if (arr[1] === Config.spaceDotsPerPlanet - 1) {
				arr[0].hit = false;
				this.dotEatBoolean = true;
			}
		},
		animate: function () {

		

			if(this.pause)return;

			for (let i = 0; i < this.tileColQ; i ++) {
				this.columns[i].animate();
			}
			

			
			let globalPoint = this.hero.activeHero.body.toGlobal(this.app.stage);
 			


 			let radius = (this.hero.activeHero.body.width / 2) * this.utils.root.hero.cont.scale.x;


			this.tempCircle = {
				x: globalPoint.x,
				y: globalPoint.y,
				radius
			}

			// this.test.clear();
			// this.test.beginFill(0xFF0000).drawCircle(0,0,50).endFill();
			// this.test.x = globalPoint.x;
			// this.test.y = globalPoint.y;

			

			if (this.pauseCounter < this.delay) {
				this.pauseCounter ++;
				return;
			}

			for (let i = 0; i < this.loopingQ; i ++) {

				if (this.dotsArray[i]) {
					let dot = this.dotsArray[i]
					let globalPoint2 = dot.toGlobal(this.app.stage, undefined, true);
					let tempCircle2 = {
						x: globalPoint2.x,
						y: globalPoint2.y,
						radius: 5
					}
					if(this.gremlinContsArray[i]){
						let gremlinCont = this.gremlinContsArray[i];

						gremlinCont.rotation += gremlinCont.speed;

						//test if gremlin is on the currentPlanet
						if(i === this.centerOrbIndex) {
							//gremlinCont.gremlin.alpha = 0.2;

							let gremlinPoint = gremlinCont.gremlin.body.toGlobal(this.app.stage);
 
							let tempGremlin = {
								x: gremlinPoint.x,
								y: gremlinPoint.y,
								radius: 33
							}


							if(!gremlinCont.gremlin.hit && this.utils.circleToCircleCollisionDetection(this.tempCircle, tempGremlin)[0]) {
								this.gremlinHit(i, gremlinCont.gremlin);
								gremlinCont.gremlin.hit = true;
								this.dotEatBoolean = false;
							}

						} else {
							//gremlinCont.gremlin.alpha = 1;
						}

					}
					

					if(this.dotEatBoolean && this.utils.circleToCircleCollisionDetection(this.tempCircle, tempCircle2)[0]) {
						dot.parent.removeChild(dot);
						this.eatenDots.push(dot);
						this.dotsArray.splice(i, 1);
						//this.utils.root.score.jumpScore.jumpDotHit();
					}
				}
				


			
				if (this.orbListen && this.orbs[i]) {
					let orb = this.orbs[i];
					
					let globalPoint2 = orb.toGlobal(this.app.stage, undefined, true);
					let orbCircle = {
						x: globalPoint2.x,
						y: globalPoint2.y,
						radius: (orb.radius * this.orbsCont.scale.x)
					}

					// this.testGraphics.clear();
					// this.testGraphics.beginFill(0x333333).drawCircle(0,0,this.tempCircle.radius).endFill();
					// this.testGraphics.x = this.tempCircle.x;
					// this.testGraphics.y = this.tempCircle.y;

					let dotsCont = this.dotsContArray[i];
					dotsCont.rotation += this.utils.deg2rad(dotsCont.rotate);

					if(orb !== this.currentOrb && 
						!this.transition && 
						this.utils.circleToCircleCollisionDetection(this.tempCircle, orbCircle)[0]) {

						this.transition = true;
						this.switchPlanets(orb, i);
					}
				}
			}
		}
	}
}