import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import HeroSwim from '../swim/heroSwim';
import HeroJump from '../jump/heroJump';
import HeroFly from '../fly/heroFly';
import HeroBounce from '../bounce/heroBounce';
export default function () {
	return {
		cont: Assets.Container(),
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
		init: function (items, parentCont) {

			this.wh = this.utils.wh;
			this.parentCont = parentCont;
			this.canvasWidth = this.utils.wh.canvasWidth;
			this.canvasHeight = this.utils.wh.canvasHeight;
            this.cont.x = this.canvasWidth / 2;
            this.cont.y = (this.canvasHeight / 2) - this.yOffset;
            this.segments = [];
            this.fish = [];
            this.spritesheet = this.utils.spritesheet;

            this.bounce = this.utils.randomNumberBetween(-0.6, -0.9);
            this.vy = this.utils.randomNumberBetween(3,5);

            if(items){
            	  for(let i = 0; i < items.length; i ++){
	            	var item = Assets.Sprite(items[i].url);
	            	if (items[i].active) {
		            	this.cont.addChild(item);
		            }
	            }
            }

            parentCont.addChild(this.cont);
            this.heroSwim.init(this.cont);
            this.heroJump.init(this.cont);
            this.heroFly.init(this.cont);
            this.heroBounce.init(this.cont);

            return this;
		},
		resize: function (){
			this.canvasWidth = this.utils.canvasWidth;
			this.canvasHeight = this.utils.canvasHeight;
			this.cont.x = this.utils.canvasWidth / 2;
            this.cont.y = this.utils.canvasHeight / 2;
		},
		switchPlayer: function (string) {
			//this.cont.removeChildren();
			if(this.activeHero)this.activeHero.removeFromStage();
			this.cont.x = this.cont.y = 0;
			if(this.activeHero)this.activeHero.cont.x = this.activeHero.cont.y = 0;
			this.mode = string;
			this.cont.rotation = 0;
			this.cont.y = this.canvasHeight / 2;
			this.cont.x = this.canvasWidth / 2;
			if (string === 'jump') {
				this.activeHero = this.heroJump;

			} else if (string === 'bounce') {
				this.activeHero = this.heroBounce;
			} else if (string === 'swim') {
				this.activeHero = this.heroSwim;
			} else {
				this.activeHero = this.heroFly;
			}
			this.activeHero.name = string;
			this.activeHero.addToStage();
		}
	}
}