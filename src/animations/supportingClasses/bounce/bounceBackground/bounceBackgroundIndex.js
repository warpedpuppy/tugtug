import Utils from '../../../utils/utils';
import Assets from '../../../utils/assetCreation';
import Tweens from '../../../utils/tweens';
import BounceExplosion from './bounceMiniExplosion';
import BounceVerticals from './bounceVerticals';
import BounceRings from './bounceRings';
export default function () {
	return {
		cont: Assets.Container(),
		background: Assets.Graphics(),
		level1: Assets.Container(),
		level2: Assets.Container(),
		level3: Assets.Container(),
		level4: Assets.Container(),
		transCont: Assets.Container(),
		utils: Utils,
		array1: [],
		array2: [],
		array3: [],
		array4: [],
		buffer: 500,
		createCounter: 0,
		gridIndex: 5,
		transitionItems: [], 
		transitionItemsQ: 2,
		mines: [], 
		mineQ: 10,
		bounceVerticals: BounceVerticals,
		bounceRings: BounceRings,
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


			this.bounceRings.init(this);
			this.createTransitionItems();

			this.bounceVerticals.init(this);


			this.loopingQ = this.storeLoopingQ = Math.max(
				this.bounceVerticals.spikes.length, 
				this.bounceVerticals.array1.length, 
				this.bounceVerticals.array2.length, 
				this.bounceVerticals.array3.length, 
				this.bounceVerticals.array4.length,
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
				y: (this.utils.canvasHeight / 2) - 20,
				radius: 30
			}

			// this.test = Assets.Graphics();
			// this.test.x = this.utils.canvasWidth / 2
			// this.test.y = (this.utils.canvasHeight / 2) - 20;
			// this.test.beginFill(0x000000).drawCircle(0,0,30).endFill();
			// this.utils.app.stage.addChild(this.test)

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
		addToStage: function () {
			for (let i = 0; i < this.transitionItemsQ; i ++) {
				let item = this.transitionItems[i];
				item.hit = false;
				if(i % 2 === 0) {
					item.x = this.utils.randomNumberBetween(0, this.utils.canvasWidth * 0.25)
				} else {
					item.x = this.utils.randomNumberBetween(this.utils.canvasWidth * 0.75, this.utils.canvasWidth)
				}
			}
			BounceExplosion.addToStage();
			this.parentCont.addChildAt(this.cont, 1);
		},
		removeFromStage: function () {
			BounceExplosion.removeFromStage();
			this.parentCont.removeChild(this.cont);
		},
		resize: function () {
	
			this.bounceVerticals.resize();

			for (let i = 0; i < this.circleQ; i ++) {
				let item = this.circleArray[i];
				item.x = this.utils.randomNumberBetween(0, this.utils.canvasWidth);
				item.y = this.utils.randomNumberBetween(0, this.utils.canvasHeight);	
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
				if(this.bounceVerticals.array1[i]){
					this.bounceVerticals.moveBars(this.bounceVerticals.array1[i]);
				}
				if(this.bounceVerticals.array2[i]){
					this.bounceVerticals.moveBars(this.bounceVerticals.array2[i]);
				}
				if(this.bounceVerticals.array3[i]){
					this.bounceVerticals.moveBars(this.bounceVerticals.array3[i]);
				}
				if(this.bounceVerticals.array4[i]){
					this.bounceVerticals.moveBars(this.bounceVerticals.array4[i]);
				}
				

				if (this.bounceVerticals.spikes[i]) {
					let spike = this.bounceVerticals.spikes[i];
					spike.x = spike.bar.x;
					spike.y -= this.action.vy;
					spike.frontSpike.rotation += 0.05;
					spike.backSpike.rotation -= 0.025;

					if (!spike.hit && this.itemHitDetect(spike) && spike.y < this.utils.canvasHeight / 2) {
						spike.hit = true;
		   				BounceExplosion.startBad();
						this.points.spikeHit();
					}

					if (spike.y < -spike.height - 100) {
						spike.y = this.utils.canvasHeight + spike.height;
					} else if (spike.y > this.utils.canvasHeight + spike.height + 100) {
						spike.y = -spike.height;
					}
				}
			
				if (Assets.rings[i]) {
					let ring = Assets.rings[i];
					this.moveItems(ring);
					if (!ring.hit && this.itemHitDetect(ring)) {
						ring.hit = true;
						BounceExplosion.startGood();
						ring.parent.removeChild(ring);
						this.bounceRings.rings.slice(i, 1);
						this.points.ringHit();
					
					}
				}

				if (this.transitionItems[i]) {
					let item = this.transitionItems[i];
					this.moveItems(item);
					if (!item.hit && this.itemHitDetect(item)) {
						item.hit = true;
						console.log("hit")
						this.utils.root.switchPlayerWithAnimation(item.name);
					
					}
				}
			}
			
		}
	}
}