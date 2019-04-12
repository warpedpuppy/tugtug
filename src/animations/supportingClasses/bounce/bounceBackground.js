import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
import Tweens from '../../utils/tweens';
export default function () {
	return {
		cont: Assets.Container(),
		background: Assets.Graphics(),
		level1: Assets.Container(),
		level2: Assets.Container(),
		level3: Assets.Container(),
		level4: Assets.Container(),
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
		init: function (action) {

			this.hero = this.utils.hero;
			this.app = this.utils.app;
			this.parentCont = this.app.stage;
			this.wh = this.utils.wh;
			this.spritesheet = this.utils.spritesheet;
			this.action = action;

			this.background.beginFill(0x00CCFF).drawRect(0,0,this.wh.canvasWidth, this.wh.canvasHeight).endFill();

			this.cont.addChild(this.background);

			this.createCircles();

			this.createResources();

			
			this.createBars(this.level1Object);
			this.createBars(this.level2Object);
			this.createBars(this.level3Object);
			this.createBars(this.level4Object);

			this.loopingQ = this.storeLoopingQ = Math.max(this.dots.length, this.array1.length, this.array2.length, this.array3.length, this.array4.length)


			
			//this.level3.alpha = this.level4.alpha = 0.75;

		},
		createCircles: function () {
			this.circleArray = Assets.returnObjectPool('transparentRing.png');
			this.circleQ = this.circleArray.length * 0.1;
            this.circles = Assets.ParticleContainer(this.circleQ);
			for (let i = 0; i < this.circleQ; i ++) {
				let item = this.circleArray[i];
				item.anchor.set(0.5);
				item.x = this.utils.randomNumberBetween(0, this.utils.canvasWidth);
				item.y = this.utils.randomNumberBetween(0, this.utils.canvasHeight);
				item.speedAdjust = this.utils.randomNumberBetween(0.0001, 0.0065);
				item.scale.set(this.utils.randomNumberBetween(0.05, 0.35));
				item.alpha = this.utils.randomNumberBetween(0.5, 0.8);
				item.tint = this.colors[this.colorCounter];
				this.colorCounter ++;
				if (this.colorCounter > this.colors.length - 1) {
					this.colorCounter = 0;
				}
				this.circles.addChild(item);
			}
			this.cont.addChild(this.circles);

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

				let dot = this.dotsOP[this.createCounter];
				dot.bar = bar;
				dot.scale.set(obj.speedAdjust);
				dot.x = bar.x;
				dot.tint = this.colors[this.colorCounter]; 

				this.colorCounter ++; 

				if (this.colorCounter > this.colors.length - 1) {
					this.colorCounter = 0;
				}

				bar.dot = dot;
				dot.anchor.set(0.5);
				dot.y = this.utils.randomNumberBetween(0, this.utils.canvasHeight)
				obj.cont.addChild(dot);
				this.dots.push(dot);

				this.createCounter ++;
			}

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

			this.loopingQ = Math.max(this.dots.length, this.array1.length, this.array2.length, this.array3.length, this.array4.length)
		},
		addToStage: function () {
			this.createCircles();
			this.cont.addChild(this.level1);
			this.cont.addChild(this.level2);
			this.cont.addChild(this.level3);
			this.cont.addChild(this.level4)
			// this.parentCont.addChildAt(this.level3, this.parentCont.children.length - 3);
			// this.parentCont.addChildAt(this.level4, this.parentCont.children.length - 3);
			this.parentCont.addChildAt(this.cont, 1);
		},
		removeFromStage: function () {
			Tweens.killAll();
			this.cont.removeChild(this.level1);
			this.cont.removeChild(this.level2);
			this.cont.removeChild(this.level3);
			this.cont.removeChild(this.level4);
			// this.parentCont.removeChild(this.level3);
			// this.parentCont.removeChild(this.level4);
			this.parentCont.removeChild(this.cont);
		},
		startSpaceShipJourney: function () {
			this.loopingQ = 0;
			Tweens.fadeTo(this.level1, 1, 0);
			Tweens.fadeTo(this.level2, 1, 0);
			Tweens.fadeTo(this.level3, 1, 0);
			Tweens.fadeTo(this.level4, 1, 0);
			Tweens.fadeTo(this.circles, 1, 0);
			Tweens.fadeTo(this.background, 1, 0);
        },
        endSpaceShipJourney: function () {
        	this.loopingQ = this.storeLoopingQ;
        	Tweens.fadeTo(this.level1, 1, 1);
			Tweens.fadeTo(this.level2, 1, 1);
			Tweens.fadeTo(this.level3, 1, 1);
			Tweens.fadeTo(this.level4, 1, 1);
			Tweens.fadeTo(this.circles, 1, 1);
			Tweens.fadeTo(this.background, 1, 1);
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
		move: function (bar) {
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
		animate: function () {
			for(let i = 0; i < this.loopingQ; i ++){
				if(this.array1[i]){
					this.move(this.array1[i]);
				}
				if(this.array2[i]){
					this.move(this.array2[i]);
				}
				if(this.array3[i]){
					this.move(this.array3[i]);
				}
				if(this.array4[i]){
					this.move(this.array4[i]);
				}
				if(this.dots[i]){
					let dot = this.dots[i];
					dot.x = dot.bar.x;
					dot.y -= this.action.vy;
					if(dot.y < -100){
						dot.y = this.utils.canvasHeight + dot.height;
					} else if(dot.y > this.utils.canvasHeight +100){
						dot.y = -dot.height;
					}
				}

				for (let i = 0; i < this.circleQ; i ++) {
					let item = this.circleArray[i];
					item.x -= this.action.vx * item.speedAdjust;
					item.y -= this.action.vy * item.speedAdjust;	

					if(item.x < -item.width){
						item.x = this.utils.canvasWidth + item.width
					} else if (item.x > this.utils.canvasWidth + item.width){
						item.x = -item.width
					}

					if(item.y < -item.width){
						item.y = this.utils.canvasHeight + item.width
					} else if (item.y > this.utils.canvasHeight + item.width){
						item.y = -item.width
					}
				}
			}
		}
	}
}