import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
import { TweenMax, Elastic } from 'gsap';
export default function () {
	return {
		cont: new PIXI.Container(),
		background: new PIXI.Graphics(),
		foreground: new PIXI.Graphics(),
		orbsCont: new PIXI.Container(),
		ground: new PIXI.Graphics(),
		colors: [0xFF00FF, 0xFF0000, 0xFFFF00, 0xFF9900, 0x33FF00],
		init: function (app, parentCont, wh, spritesheet, action, hero) {

			this.hero = hero;
			this.app = app;
			this.parentCont = parentCont;
			this.wh = wh;
			this.spritesheet = spritesheet;
			this.action = action;

	

			this.background.beginFill(0x000000).drawRect(0,0,wh.canvasWidth, wh.canvasHeight).endFill();

			this.cont.addChild(this.background);
			//this.parentCont.addChild(this.orbsCont)
			
		},
		addToStage: function () {
			
			this.parentCont.addChildAt(this.cont, 0);
		},
		removeFromStage: function () {
			TweenMax.killAll();
			this.parentCont.removeChild(this.cont);
			this.parentCont.removeChild(this.orbsCont);
		},
		resize: function () {

		},
		animate: function () {
	
		}
	}
}