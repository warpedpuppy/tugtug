import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
import HeroSwim from './swim/heroSwim';
import HeroJump from './jump/heroJump';
import HeroFly from './fly/heroFly';
import HeroBounce from './bounce/heroBounce';
export default function () {
	return {
		cont: new PIXI.Container(),
		pos: [],
		radius: 2,
		storeRadius: 0,
		body: undefined,
		mode: undefined,
		vy: 0,
		vx: 0,
		bounce: 0,
		platforms: [],
		yOffset: 0,
		parentCont: undefined,
		utils: Utils,
		heroSwim: HeroSwim(),
		heroJump: HeroJump(),
		heroFly: HeroFly(),
		heroBounce: HeroBounce(),
		activeHero: undefined,
		init: function (wh, items, parentCont, spritesheet) {

			this.wh = wh;
			this.parentCont = parentCont;
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
            this.cont.x = this.canvasWidth / 2;
            this.cont.y = (this.canvasHeight / 2) - this.yOffset;
            this.segments = [];
            this.fish = [];
            this.spritesheet = spritesheet;

            this.bounce = this.utils.randomNumberBetween(-0.6, -0.9);
            this.vy = this.utils.randomNumberBetween(3,5);

            if(items){
            	  for(let i = 0; i < items.length; i ++){
	            	var item = PIXI.Sprite.fromImage(items[i].url);
	            	if (items[i].active) {
		            	this.cont.addChild(item);
		            }
	            }
            }

            parentCont.addChild(this.cont);
            this.heroSwim.init(this.cont, wh, spritesheet);
            this.heroJump.init(this.cont, wh, spritesheet);
            this.heroFly.init(this.cont, wh, spritesheet);
            this.heroBounce.init(this.cont, wh, spritesheet);

            return this;
		},
		resize: function (wh){
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
			this.cont.x = this.canvasWidth / 2;
            this.cont.y = this.canvasHeight / 2;
		},
		switchPlayer: function (string) {
			//this.cont.removeChildren();
			if(this.activeHero)this.activeHero.removeFromStage();
			this.cont.x = this.cont.y = 0;
			this.mode = string;

			if (string === 'jump') {
				this.activeHero = this.heroJump;
			} else if (string === 'bounce') {
				this.activeHero = this.heroBounce;
			} else if (string === 'swim') {
				this.activeHero = this.heroSwim;
			} else {
				this.activeHero = this.heroFly;
			}
			this.cont.rotation = 0;
			this.cont.y = this.canvasHeight / 2;
			this.cont.x = this.canvasWidth / 2;
			this.activeHero.addToStage();
		}
	}
}