import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Config from '../../../animationsConfig';
export default  {
		cont: Assets.Container(), 
		items: [],
		itemQ: 100,
		utils: Utils,
		counter: 0,
		totalSeconds: 3, 
		explosionBoolean: false,
		init: function () {
			for(let i = 0; i < this.itemQ; i ++){
				let item = Assets.Sprite("transparentRing.png");
				item.anchor.set(0.5)
				//item.scale.set(this.utils.randomNumberBetween(0.1, 0,5))
				item.q = this.utils.randomNumberBetween(-50, 50);
				this.cont.addChild(item)
				this.items.push(item);
			}
		},
		setMaxScaleHandler: function () {
			
		},
		start: function (expand) {
			this.items.forEach((item, i) => {
				item.x = item.y = 0;
			})
			this.counter = 0;
			this.timeLimit = this.totalSeconds * 60;
			this.cont.x = this.utils.canvasWidth / 2;
			this.cont.y = this.utils.canvasHeight / 2;
			let index = this.utils.app.stage.getChildIndex(this.utils.hero.cont) - 1;
			this.utils.app.stage.addChild(this.cont);
			this.explosionBoolean = true;
		},
		removeFromStage: function () {
			this.utils.app.stage.removeChild(this.cont);
		},
		resize: function () {

		},
		animate: function () {
			
			this.counter ++;
			if (this.counter >= this.timeLimit) {
				this.explosionBoolean = false;
			}
			this.items.forEach((item, i) => {
				item.alpha -= 0.01;
				item.x += item.q * Math.cos( ( 2 * Math.PI) * i / this.itemQ);
            	item.y += item.q * Math.sin( ( 2 * Math.PI) * i / this.itemQ);
			})
				
			
		}
	
}