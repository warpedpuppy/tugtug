import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
// import Config from './animationsConfig';
export default  {
		utils: Utils,
		init: function (parent) {
			this.parent = parent;
			this.createRings();
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
				this.parent.ringsPC.addChild(r);
				
			}
		},
		addToStage: function () {

		},
		removeFromStage: function () {

		},
		resize: function () {

		},
		animate: function () {

		}
	
}