import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
//import Config from './animationsConfig';
export default {
		goodItems: [],
		badItems: [],
		goodCont: Assets.Container(),
		badCont: Assets.Container(),
		goodCounter: -1,
		badCounter: -1,
		utils: Utils,
		goodGo: false,
		badGo: false,
		init: function (parentCont) {
			for(let i = 0; i < 100; i ++){

				if ( i < 50 ) {
					let item = Assets.Sprite("transparentRing.png");
					//item.tint = null;
					item.anchor.set(0.5)
					item.scale.set(this.utils.randomNumberBetween(0.1, 0,5))
					item.q = this.utils.randomNumberBetween(-10, 10)
					this.goodCont.addChild(item)
					this.goodItems.push(item);
				} else {
					let item = Assets.Sprite("transparentRing.png");
					item.tint = 0xFF0000;
					item.anchor.set(0.5)
					item.scale.set(this.utils.randomNumberBetween(0.1, 0,5))
					item.q = this.utils.randomNumberBetween(-10, 10)
					this.badCont.addChild(item)
					this.badItems.push(item);
				}
			
			}
		},
		addToStage: function () {
			this.goodCont.x = this.utils.canvasWidth / 2;
			this.goodCont.y = this.utils.canvasHeight / 2;
			this.badCont.x = this.utils.canvasWidth / 2;
			this.badCont.y = this.utils.canvasHeight / 2;
			let index = this.utils.app.stage.getChildIndex(this.utils.hero.cont) - 1;
			this.utils.app.stage.addChildAt(this.badCont, index);
			this.utils.app.stage.addChildAt(this.goodCont, index);
		},
		removeFromStage: function () {

			this.utils.app.stage.removeChild(this.badCont);
			this.utils.app.stage.removeChild(this.goodCont);
		},
		startGood: function () {
			this.resetGood();
			this.goodGo = true;
			this.goodCounter = 0;
		},
		startBad: function (item) {
			this.resetBad();
			this.badGo = true;
			this.badCounter = 0;
		},
		resize: function () {
			this.goodCont.x = this.utils.canvasWidth / 2;
			this.goodCont.y = this.utils.canvasHeight / 2;
			this.badCont.x = this.utils.canvasWidth / 2;
			this.badCont.y = this.utils.canvasHeight / 2;
		},
		resetGood: function () {
			for(let i = 0; i < 50; i ++){
				let item = this.goodItems[i];
				item.x = item.y = 0;
			}
			this.goodCounter = -1;
		},
		resetBad: function () {
			for(let i = 0; i < 50; i ++){
				let item = this.badItems[i];

				item.x = item.y = 0;
			}
			this.badCounter = -1;
		},
		animate: function () {

			if (this.goodCounter >= 0) {
				for(let i = 0; i < 50; i ++){
					let item = this.goodItems[i];
					item.x += item.q * Math.cos( ( 2 * Math.PI) * i / 100);
            		item.y += item.q * Math.sin( ( 2 * Math.PI) * i / 100);
				}
				this.goodCounter ++;
				if(this.goodCounter > 100){
					this.goodCounter = 0;
					this.resetGood();
					this.goodGo = false;
				}
			}

			if (this.badCounter >= 0) {
				for(let i = 0; i < 50; i ++){
					let item = this.badItems[i];
					item.x += item.q * Math.cos( ( 2 * Math.PI) * i / 100);
            		item.y += item.q * Math.sin( ( 2 * Math.PI) * i / 100);
				}
				this.badCounter ++;
				if(this.badCounter > 100){
					this.badCounter = 0;
					this.resetBad();
					this.badGo = false;
				}
			}
		}
	}
