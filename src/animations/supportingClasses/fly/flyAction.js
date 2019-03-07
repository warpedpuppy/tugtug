import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
import Rotate from '../action/rotate';
export default function () {
	return {
		radius: 0,
		storeRadius: 0,
		spinning: false,
		vx: 0,
		vy: 0,
		airBubbleCounter: 0,
		airBubbleStart: 0,
		countAllow: true,
		expand: [],
		percApply: true,
		increment: 5,
		colors: [0xFF0000, 0xFFFF00, 0xFF9900],
		colorCounter:0,
		flameArray: [],
		shootingFlames: [],
		flameCounter: 0,
		flameOn:false,
		utils: Utils,
		init: function (parent, background) {
			this.parent = parent;
			this.grid = parent.grid;
			this.background = background;
			this.soldiers = background.soldiers;
			this.spears = background.spears;
			this.soldierQ = background.soldiers.length;
			this.spearQ = background.spears.length;
			this.clouds = background.clouds;
			this.hero = this.utils.hero;
			this.wh = this.utils.wh;
			this.stage = this.utils.app.stage;
			//this.vx = this.utils.randomNumberBetween(1,2); 
           // this.vy = this.utils.randomNumberBetween(1,2);
            //this.flameQ = (Assets.webgl)? 500 : 10;
            this.flames = Assets.ParticleContainer(this.flameQ);

 

		},
		createPool: function () {
			this.flameArray = Assets.returnObjectPool('star.png');
            this.flameQ = this.flameArray.length;
            
			let item;
			for (let i = 0; i < this.flameQ; i ++) {
				item = this.flameArray[i];
				item.scale.set(this.utils.randomNumberBetween(0.01, 0.1));
				item.anchor.set(0.5);
				item.angle = this.utils.deg2rad(this.utils.randomNumberBetween(-110, -70));
				item.fade = this.utils.randomNumberBetween(0.001, 0.01);
				item.maxDistance = this.utils.randomNumberBetween(100, 1000);
				let hypotenuse = this.utils.randomNumberBetween(10, 100);
				item.vx = Math.cos(item.angle) * hypotenuse;
	        	item.vy = Math.sin(item.angle) * hypotenuse;
				
				item.tint = this.colors[this.colorCounter];
				this.colorCounter ++;
				if (this.colorCounter > this.colors.length - 1) {
					this.colorCounter = 0;
				}
				this.flames.addChild(item);
			}
			this.flames.visible = false;
			// this.flames.x = this.utils.canvasWidth / 2;
			 this.flames.y = -50;//this.utils.canvasHeight / 2;
			// let index = this.stage.getChildIndex(this.utils.hero.cont) - 1;
			this.hero.activeHero.headCont.addChildAt(this.flames, 0);
		},
		resize: function () {
			if(this.flames){
				this.flames.x = this.utils.canvasWidth / 2;
			    this.flames.y = this.utils.canvasHeight / 2;
			}
			
		},
		switchMode: function(mode) {
			this.mode = mode;
			this.maxLength = this.increment * this.hero.activeHero.segmentsQ;
		},
		rotate: function (str) {
				let obj = Rotate.rotate(str, this);
				this.vx = -obj.vx;
				this.vy = -obj.vy
		},
		fire: function (boolean) {
			this.flameOn = this.flames.visible = boolean;
		},
		fireHit: function (soldier, flame){
			let globalPoint1 = this.grid.cont.toGlobal(soldier);
			let globalPoint2 = this.flames.toGlobal(flame);
			let c1 = {
				x: globalPoint1.x,
				y: globalPoint1.y,
				radius: 10
			}
			let c2 = {
				x: globalPoint2.x,
				y: globalPoint2.y,
				radius: 10
			}
			let x = this.utils.circleToCircleCollisionDetection(c1, c2);
			return x[0];
		},
		spearHit: function (spear) {
			let globalPoint1 = this.grid.cont.toGlobal(spear);
			let c1 = {
				x: globalPoint1.x,
				y: globalPoint1.y,
				radius: 10
			}
			let c2 = {
				x: this.utils.canvasWidth / 2,
				y: this.utils.canvasHeight / 2,
				radius: 10
			}
			let x = this.utils.circleToCircleCollisionDetection(c1, c2);
			return x[0];
		},
		animate: function () {

			this.clouds.animate();
			
			let onScreenSoldiers = [];
			for (let i = 0; i < this.soldiers.length; i ++) {
				let s = this.soldiers[i];
				let onScreen = s.classRef.animate();
				if(onScreen){

					onScreenSoldiers.push(onScreen);
					let sp = this.spears[i];
					if (this.spearHit(sp)) {
						sp.reset();

						//MAKE SCORE GO DOWN
						this.parent.score.decrease(10);
					};
				}

			}

			// this.background.background.x -= this.vx * 0.1;
			// this.background.background.y -= this.vy * 0.1;
			//console.log(`there are ${onScreenSoldiers.length} soldiers on screen right now`)
			this.hero.activeHero.eyeCont.rotation = this.radius;
			this.hero.activeHero.headCont.rotation = this.radius;
	        this.hero.pos.push(this.radius);

	        if (this.hero.pos.length > this.maxLength) {
	            this.hero.pos = this.hero.pos.slice(-this.maxLength);
	        }

	        for (let i = 1; i <= this.hero.activeHero.segmentsQ; i++) {
	            let index = this.hero.pos.length - (i * this.increment);
	            if (this.hero.pos.length >= index) {
	                this.hero.activeHero.segments[i].rotation = this.hero.pos[index];
	            }
	        }
	        if (this.flameOn) {
	        	for(let i = 0; i < this.flameQ; i ++) {
		        	let item = this.flameArray[i];
		        	item.x += item.vx;
		        	item.y += item.vy;
		        	item.alpha -= item.fade;

		        	for (let soldier of onScreenSoldiers) {
		        		if (this.fireHit(soldier, item)) {

		        			soldier.classRef.hit();
		        			//MAKE SCORE GO UP
		        			this.parent.score.increase(10);
		        		}
		        	}

		        	if (Math.abs(item.y) > item.maxDistance) {
		        		item.x = 0;
		        		item.y = 0;
		        		item.alpha = 1;
		        	}
	            }
	        } else if (!this.spinning) {
	        	this.radius = this.utils.cosWave(this.storeRadius, 0.15, 0.01);
	        }
	       

	        if (!this.flameOn) {
	        	this.hero.activeHero.wingCont.rotation = this.storeRadius;
	        	this.hero.activeHero.leftWing.rotation = this.utils.deg2rad(this.utils.cosWave(0, 20, 0.004));
	        	this.hero.activeHero.leftWing2.rotation = this.utils.deg2rad(this.utils.cosWave(0, 20, 0.004));

	        	this.hero.activeHero.rightWing.rotation = this.utils.deg2rad(this.utils.cosWave(0, -20, 0.004));
	        	this.hero.activeHero.rightWing2.rotation = this.utils.deg2rad(this.utils.cosWave(0, -20, 0.004));
	        } else {
	        	this.hero.activeHero.wingCont.rotation =  this.radius;
	        	this.hero.activeHero.leftWing.rotation =  this.utils.deg2rad(-30);
	        	this.hero.activeHero.leftWing2.rotation =  this.utils.deg2rad(-30);
	        	this.hero.activeHero.rightWing.rotation = this.utils.deg2rad(30);
	        	this.hero.activeHero.rightWing2.rotation = this.utils.deg2rad(30);
	        }
        	
	        

		}
	}
}