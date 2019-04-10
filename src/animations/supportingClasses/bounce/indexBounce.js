import BouncePlatform from './bouncePlatform';
import BounceBackground from './bounceBackground';
import BounceAction from './bounceAction';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
export default function () {
	return {
		bouncePlatform: BouncePlatform(),
		bounceAction: BounceAction(),
		bounceBackground: BounceBackground(),
		init: function (cont) {
			this.background = this.bounceBackground;
    		this.bouncePlatform.init(cont);
    		this.bouncePlatform.on(false); 
    		this.bounceAction.init(this.bouncePlatform);
    		this.bounceBackground.init(this.bounceAction);
    		this.maskedItems = [
				this.bounceBackground.cont
			];
    		
		},
		addToStage: function () {
			this.bouncePlatform.start();
			this.bouncePlatform.on(true);
			this.bounceBackground.addToStage();
			return this.bounceAction
		},
		removeFromStage: function () {
			this.bouncePlatform.on(false);
			this.bounceBackground.removeFromStage();
		},
		resize: function () {
			this.bounceBackground.resize();
		},
		animate: function () {
			this.bouncePlatform.animate();
			this.bounceBackground.animate();
		}
	}
}