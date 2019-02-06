import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
import { TweenMax, Elastic } from 'gsap';
export default function () {
	return {
		cont: new PIXI.Container(),
		background: new PIXI.Graphics(),
		level1: new PIXI.Container(),
		level2: new PIXI.Container(),
		level3: new PIXI.Container(),
		level4: new PIXI.Container(),
		ground: new PIXI.Graphics(),
		colors: [0xFF00FF, 0xFF0000, 0xFFFF00, 0xFF9900, 0x33FF00],
		utils: Utils,
		bars: {},
		buffer: 500,
		init: function (app, wh, spritesheet, hero, action) {

			this.hero = hero;
			this.app = app;
			this.parentCont = this.app.stage;
			this.wh = wh;
			this.spritesheet = spritesheet;
			this.action = action;
	

			this.background.beginFill(0x9900FF).drawRect(0,0,wh.canvasWidth, wh.canvasHeight).endFill();

			this.cont.addChild(this.background);


			this.array1 = [];
			this.createBars(3, 50, 0.15, 0xFF0000, this.level1, this.array1);
	
			this.array2 = [];
			this.createBars(6, 25, 0.35, 0xFFFF00, this.level2, this.array2);

			this.array3 = [];
			this.createBars(12, 10, 0.65, 0xFFFF00, this.level3, this.array3);

			this.array4 = [];
			this.createBars(24, 5, 1, 0x33FF00, this.level4, this.array4);

			this.loopingQ = Math.max(this.array1.length, this.array2.length, this.array3.length, this.array4.length)


			
			this.level3.alpha = this.level4.alpha = 0.5;

		},
		createBars: function (w, q, speedAdust, color, cont, array) {
			let spacing = this.wh.canvasWidth / q;
			for (let i = 0; i < q; i ++) {
				let bar = new PIXI.Sprite(this.spritesheet.textures['line.png']);
				bar.speedAdjust = speedAdust;
				bar.width = w;
				bar.height = this.wh.canvasHeight;
				bar.spacing = spacing;
				bar.tint = color;
				bar.x = i * spacing;
				bar.array = array;
				cont.addChild(bar);
				array.push(bar);
			}
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

		},
		move: function (bar) {
			bar.x -= (this.action.vx * bar.speedAdjust);
			if (bar.x < 0 && this.action.vx > 0) {
				let backBarX = bar.array[bar.array.length - 1].x;
				bar.x = backBarX + bar.spacing;
				bar.array.splice(0, 1);
				bar.array.push(bar);
			} else if(bar.x > this.wh.canvasWidth && this.action.vx < 0){
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
			}
		}
	}
}