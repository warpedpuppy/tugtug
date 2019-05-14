import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import ConcentricCircles from './concentricCircles';
import Explosion from './explosion';
// import Config from './animationsConfig';
export default  {
		circlesBoolean: false,
		explosionBoolean: false,
		explosion: Explosion,
		init: function () {
			this.explosion.init();
			this.animateFunction = function () {};
			ConcentricCircles.init();
		},
		circles: function (obj) {
			
			if (obj.start) {
				this.circlesBoolean = true;
				ConcentricCircles.addToStage(obj.expand);
			} else {
				this.circlesBoolean = false;
				ConcentricCircles.removeFromStage();
			}
			
		},
		explosionStart: function () {
			this.explosion.start();
			this.explosionBoolean = true;
		},
		addToStage: function () {

		},
		removeFromStage: function () {

		},
		resize: function () {

		},
		animate: function () {
			if (this.circlesBoolean) {
				ConcentricCircles.animate();
			}
			if(this.explosionBoolean){
				if(!this.explosion.explosionBoolean){
					this.explosionBoolean = false;
					this.explosion.removeFromStage();
				}
				Explosion.animate();
			}
		}
	
}