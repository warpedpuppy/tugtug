import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
import { TweenMax } from 'gsap';
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
		buffer: 500,
		createCounter: 0,
		init: function (action) {

			this.hero = this.utils.hero;
			this.app = this.utils.app;
			this.parentCont = this.app.stage;
			this.wh = this.utils.wh;
			this.spritesheet = this.utils.spritesheet;
			this.action = action;

			this.background.beginFill(0x9900FF).drawRect(0,0,this.wh.canvasWidth, this.wh.canvasHeight).endFill();

			this.cont.addChild(this.background);

			this.dots = [];
			this.array1 = [];
			this.array2 = [];
			this.array3 = [];
			this.array4 = [];

			this.level1Object = {
				w: 3,
				q: 10,
				speedAdjust: 0.15,
				color: 0xFF0000,
				cont: this.level1, 
				array: this.array1
			}
			this.level2Object = {
				w: 8,
				q: 5,
				speedAdjust: 0.35,
				color: 0x33FF00,
				cont: this.level2, 
				array: this.array2
			}
			this.level3Object = {
				w: 20,
				q: 2,
				speedAdjust: 0.65,
				color: 0xFFFF00,
				cont: this.level3, 
				array: this.array3
			}
			this.level4Object = {
				w: 30,
				q: 1,
				speedAdjust: 0.15,
				color: 0xFF00FF,
				cont: this.level4, 
				array: this.array4
			}


			let opQ = this.level1Object.q + this.level2Object.q + this.level3Object.q + this.level4Object.q;

			for (let i = 0; i < opQ; i ++) {
				this.barsOP.push(Assets.Sprite('line.png'));
				this.dotsOP.push(Assets.Sprite('pellet.png'));
			}


			
			this.createBars(this.level1Object);
			this.createBars(this.level2Object);
			this.createBars(this.level3Object);
			this.createBars(this.level4Object);

			this.loopingQ = Math.max(this.dots.length, this.array1.length, this.array2.length, this.array3.length, this.array4.length)


			
			//this.level3.alpha = this.level4.alpha = 0.75;

		},
		createBars: function (obj) {

			obj.cont.removeChildren();
			let spacing = this.utils.canvasWidth / obj.q;
			for (let i = 0; i < obj.q; i ++) {

				let bar = this.barsOP[this.createCounter];

				bar.anchor.x = 0.5;
				bar.speedAdjust = obj.speedAdjust;
				bar.width = obj.w;
				bar.height = this.utils.canvasHeight;
				bar.spacing = spacing;
				bar.tint = obj.color;
				bar.x = i * spacing;
				bar.array = obj.array;
				obj.cont.addChild(bar);
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
		resizeBars: function (array) {

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
		},
		addToStage: function () {
			this.cont.addChild(this.level1);
			this.cont.addChild(this.level2);
			this.parentCont.addChild(this.level3);
			this.parentCont.addChild(this.level4);
			this.parentCont.addChildAt(this.cont, 0);
		},
		removeFromStage: function () {
			TweenMax.killAll();
			this.cont.removeChild(this.level1);
			this.cont.removeChild(this.level2);
			this.parentCont.removeChild(this.level3);
			this.parentCont.removeChild(this.level4);
			this.parentCont.removeChild(this.cont);
		},
		resize: function () {
			this.background.clear();
			this.background.beginFill(0x9900FF).drawRect(0,0,this.utils.canvasWidth, this.utils.canvasHeight).endFill();

			this.resizeBars();

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
			}
		}
	}
}