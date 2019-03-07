import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
//import Config from './animationsConfig';
export default function () {
	return {
		cloudQ: 10,
		clouds: [],
		utils: Utils,
		init: function (parentCont) {

			for(let i = 0; i < this.cloudQ; i ++){
				let c = Assets.Sprite('cloud.png');
				c.anchor.set(0.5);
				

				c.rotate = 0;
				c.vx = this.utils.randomNumberBetween(-0.1, 0.1);
				c.vy = this.utils.randomNumberBetween(-0.1, 0.1);
				c.scale.set(this.utils.randomNumberBetween(0.1, 0.8));
				c.radius = c.r = c.width / 2;
				c.x = this.utils.randomNumberBetween(0, this.utils.canvasWidth);
				c.y = this.utils.randomNumberBetween(0, this.utils.canvasHeight)
				parentCont.addChild(c);
				this.clouds.push(c);
			}
			

		},
		addToStage: function () {

		},
		removeFromStage: function () {

		},
		resize: function () {

		},
		animate: function () {
			for (var cloud of this.clouds) {
				this.utils.update(cloud);
			}
		}
}
}