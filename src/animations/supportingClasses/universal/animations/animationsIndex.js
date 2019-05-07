import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import ConcentricCircles from './concentricCircles';

// import Config from './animationsConfig';
export default  {
		circles: false,
		init: function () {
			this.animateFunction = function () {};
			ConcentricCircles.init();
		},
		circles: function () {
			this.circles = true;
			ConcentricCircles.addToStage(true);
		},
		addToStage: function () {

		},
		removeFromStage: function () {

		},
		resize: function () {

		},
		animate: function () {
			if(this.circles)ConcentricCircles.animate();
		}
	
}