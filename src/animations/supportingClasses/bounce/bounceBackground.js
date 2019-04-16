import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
import Tweens from '../../utils/tweens';
import BounceExplosion from './bounceMiniExplosion';
export default function () {
	return {
		cont: Assets.Container(),
		background: Assets.Graphics(),
		level1: Assets.Container(),
		level2: Assets.Container(),
		level3: Assets.Container(),
		level4: Assets.Container(),
		transCont: Assets.Container(),
		colors: [0xFF00FF, 0xFF0000, 0xFFFF00, 0xFF9900, 0x33FF00],
		colorCounter: 0,
		utils: Utils,
		barsOP: [],
		dotsOP: [],
		dots: [],
		array1: [],
		array2: [],
		array3: [],
		array4: [],
		buffer: 500,
		createCounter: 0,
		gridIndex: 5,
		transitionItems: [], 
		transitionItemsQ: 10,
		mines: [], 
		mineQ: 10,
		init: function (action, points) {

			BounceExplosion.init();

			this.points = points;
			this.hero = this.utils.hero;
			this.app = this.utils.app;
			this.parentCont = this.app.stage;
			this.wh = this.utils.wh;
			this.spritesheet = this.utils.spritesheet;
			this.action = action;

			this.background.beginFill(0x00CCFF).drawRect(0,0,this.wh.canvasWidth, this.wh.canvasHeight).endFill();

			this.cont.addChild(this.background);

			this.ringsPC = Assets.ParticleContainer(Assets.ringQ);

			
		
			this.createResources();

			this.createRings();
			this.createTransitionItems();
			this.createBars(this.level1Object);
			this.createBars(this.level2Object);
			this.createBars(this.level3Object);
			this.createBars(this.level4Object);

			this.loopingQ = this.storeLoopingQ = Math.max(
				this.dots.length, 
				this.array1.length, 
				this.array2.length, 
				this.array3.length, 
				this.array4.length,
				Assets.ringQ)


			
			

		
			this.cont.addChild(this.level1);
			this.cont.addChild(this.level2);
			this.cont.addChild(this.level3);
			this.cont.addChild(this.level4)
			this.cont.addChild(this.ringsPC);
			this.cont.addChild(this.transCont);
			//this.level3.alpha = this.level4.alpha = 0.75;

			 this.heroCollisionDetector = {
				x: this.utils.canvasWidth / 2,
				y: this.utils.canvasHeight / 2,
				radius: 10
			}

		},
		createRings: function () {

			this.rings = Assets.rings.slice();

			for (let i = 0; i < Assets.ringQ; i ++) {

				let r = this.rings[i];//Assets.Sprite('treasureRing.png');
				r.scale.set(this.utils.randomNumberBetween(0.1, 0.5));
				r.name = 'ring';
				r.hit = false;
				r.speedAdjust = this.utils.randomNumberBetween(0.1, 0.65);
				r.y = this.utils.randomNumberBetween(0, this.utils.canvasHeight);
				r.x = this.utils.randomNumberBetween(0, this.utils.canvasWidth);
				r.rotate = this.utils.randomNumberBetween(-4, 4);
				this.ringsPC.addChild(r);
				
			}
		},
	
		createTransitionItems: function() {

			for (let i = 0; i < this.transitionItemsQ; i ++) {
				let r;
				if (i < this.transitionItemsQ / 2) {
					r = Assets.Sprite('swimTrans.png');
					r.name = 'swim';
				} else {
					r = Assets.Sprite('flyTrans.png');
					r.name = 'fly';
				}
				r.hit = false;
				r.speedAdjust = this.utils.randomNumberBetween(0.1, 0.65);
				r.y = this.utils.randomNumberBetween(0, this.utils.canvasHeight);
				r.x = this.utils.randomNumberBetween(0, this.utils.canvasWidth);
				this.transitionItems.push(r);
				this.transCont.addChild(r);
			}
		},
		createResources: function () {
			this.array1 = [];
			this.array2 = [];
			this.array3 = [];
			this.array4 = [];

			this.level1Object = {
				w: 100,
				q: 3,
				speedAdjust: 0.15,
				color: 0xFF0000,
				cont: this.level1, 
				array: this.array1
			}
			this.level2Object = {
				w: 50,
				q: 5,
				speedAdjust: 0.35,
				color: 0x33FF00,
				cont: this.level2, 
				array: this.array2
			}
			this.level3Object = {
				w: 20,
				q: 10,
				speedAdjust: 0.65,
				color: 0xFFFF00,
				cont: this.level3, 
				array: this.array3
			}
			this.level4Object = {
				w: 10,
				q: 20,
				speedAdjust: 0.15,
				color: 0xFF00FF,
				cont: this.level4, 
				array: this.array4
			}


			let opQ = this.level1Object.q + this.level2Object.q + this.level3Object.q + this.level4Object.q;
			let arr = [
				'pinkGradient.png',
				'orangeGradient.png',
				'blueGradient.png',
				'redGradient.png'
			],
			arrCounter = 0;
			for (let i = 0; i < opQ; i ++) {
				this.barsOP.push(Assets.Sprite(arr[arrCounter]));
				arrCounter ++;
				if(arrCounter >= arr.length)arrCounter = 0;
				this.dotsOP.push(Assets.Sprite('pellet.png'));
			}
		},
		createBars: function (obj) {

			obj.cont.removeChildren();
			let w = this.utils.canvasWidth;
			let spacing = w / obj.q;

			for (let i = 0; i < obj.q; i ++) {

				let bar = this.barsOP[this.createCounter];
				if(!bar){
					this.createCounter = 0;
					bar = this.barsOP[this.createCounter];
				}
				bar.anchor.x = 0.5;
				bar.speedAdjust = obj.speedAdjust;
				bar.width = obj.w;
				bar.height = this.utils.canvasHeight;
				bar.spacing = spacing;
				//bar.tint = obj.color;
				bar.x = i * spacing;
				//console.log(i, spacing)
				bar.array = obj.array;
				obj.cont.addChild(bar);
				//console.log(bar.x, bar.y)
				obj.array.push(bar);

				let dot = this.createSpikes(obj.speedAdjust);//this.dotsOP[this.createCounter];
				dot.bar = bar;
				//dot.scale.set(obj.speedAdjust);
				dot.x = bar.x;
				//dot.tint = this.colors[this.colorCounter]; 

				this.colorCounter ++; 

				if (this.colorCounter > this.colors.length - 1) {
					this.colorCounter = 0;
				}

				bar.dot = dot;
				//dot.anchor.set(0.5);
				dot.y = this.utils.randomNumberBetween(0, this.utils.canvasHeight)
				obj.cont.addChild(dot);
				this.dots.push(dot);

				this.createCounter ++;
			}

		},
		createSpikes: function (scale) {
			let cont = Assets.Container();
			let backSpike = Assets.Sprite("spike.png");
			backSpike.anchor.set(0.5);
			backSpike.scale.set(scale)
			let frontSpike = Assets.Sprite("spike.png");
			frontSpike.anchor.set(0.5);
			frontSpike.scale.set(scale * 0.5);
			cont.addChild(backSpike);
			cont.addChild(frontSpike);
			cont.frontSpike = frontSpike;
			cont.backSpike = backSpike;
			return cont;
		},
		resizeBars: function () {
			this.createCounter = 0;

			this.dots.length = 0;
			this.array1.length = 0;
			this.array2.length = 0;
			this.array3.length = 0;
			this.array4.length = 0;

			this.createBars(this.level1Object);
			this.createBars(this.level2Object);
			this.createBars(this.level3Object);
			this.createBars(this.level4Object);

			this.loopingQ = Math.max(
				this.dots.length, 
				this.array1.length, 
				this.array2.length, 
				this.array3.length, 
				this.array4.length)
		},
		addToStage: function () {
			BounceExplosion.addToStage();
			this.parentCont.addChildAt(this.cont, 1);
		},
		removeFromStage: function () {
			BounceExplosion.removeFromStage();
			this.parentCont.removeChild(this.cont);
		},
		resize: function () {
			// this.background.clear();
			// this.background.beginFill(0x9900FF).drawRect(0,0,this.utils.canvasWidth, this.utils.canvasHeight).endFill();

			this.resizeBars();

			for (let i = 0; i < this.circleQ; i ++) {
				let item = this.circleArray[i];
				item.x = this.utils.randomNumberBetween(0, this.utils.canvasWidth);
				item.y = this.utils.randomNumberBetween(0, this.utils.canvasHeight);	
			}

		},
		moveBars: function (bar) {
			bar.x -= (this.action.vx * bar.speedAdjust);
			if (bar.x < 0 && this.action.vx > 0) {
				let backBarX = bar.array[bar.array.length - 1].x;
				bar.x = backBarX + bar.spacing;
				bar.array.splice(0, 1);
				bar.array.push(bar);
			} else if(bar.x > this.utils.canvasWidth && this.action.vx < 0){
				let firstBarX = bar.array[0].x;
				bar.x = firstBarX - bar.spacing;
				bar.array.splice(bar.array.length - 1, 1);
				bar.array.unshift(bar);
			}
		},
		moveItems: function (item) {
			item.x -= this.action.vx * item.speedAdjust;
			item.y -= this.action.vy * item.speedAdjust;	

			if (item.x < -item.width) {
				item.x = this.utils.canvasWidth + item.width
			} else if (item.x > this.utils.canvasWidth + item.width) {
				item.x = -item.width
			}

			if (item.y < -item.width) {
				item.y = this.utils.canvasHeight + item.width
			} else if (item.y > this.utils.canvasHeight + item.width) {
				item.y = -item.width
			}
		},
		itemHitDetect: function (item) {
			let globalPoint = this.transCont.toGlobal(item);
			let ballB = {
				x: globalPoint.x,
				y: globalPoint.y,
				radius: 30
			}
			let x = this.utils.circleToCircleCollisionDetection(this.heroCollisionDetector, ballB);
			return x[0];
		},
		animate: function () {

			BounceExplosion.animate();

			for (let i = 0; i < this.loopingQ; i ++) {
				if(this.array1[i]){
					this.moveBars(this.array1[i]);
				}
				if(this.array2[i]){
					this.moveBars(this.array2[i]);
				}
				if(this.array3[i]){
					this.moveBars(this.array3[i]);
				}
				if(this.array4[i]){
					this.moveBars(this.array4[i]);
				}
				

				if (this.dots[i]) {
					let dot = this.dots[i];
					dot.x = dot.bar.x;
					dot.y -= this.action.vy;
					dot.frontSpike.rotation += 0.05;
					dot.backSpike.rotation -= 0.025;

					if (!dot.hit && this.itemHitDetect(dot) && dot.y < this.utils.canvasHeight / 2) {
						dot.hit = true;
						 this.utils.hero.activeHero.bounce(true);
		   				 this.utils.root.activeAction.vy  = 10 * -1.75;
		   				 BounceExplosion.startBad();
						this.points.spikeHit();
					}



					

					if(dot.y < -100){
						dot.y = this.utils.canvasHeight + dot.height;
					} else if(dot.y > this.utils.canvasHeight +100){
						dot.y = -dot.height;
					}
				}
			
				if (Assets.rings[i]) {
					let ring = Assets.rings[i];
					this.moveItems(ring);
					if(!ring.hit && this.itemHitDetect(ring)){
						ring.hit = true;
						console.log("ring hit")
						BounceExplosion.startGood();
						ring.parent.removeChild(ring);
						this.rings.slice(i, 1);
						this.points.ringHit();
						//this.utils.root.switchPlayerWithAnimation(item.name);
					
					}
				}

				if (this.transitionItems[i]) {
					let item = this.transitionItems[i];
					this.moveItems(item);
					if(!item.hit && this.itemHitDetect(item)){
						item.hit = true;
						console.log("hit")
						//this.utils.root.switchPlayerWithAnimation(item.name);
					
					}
				}
			}
			
		}
	}
}