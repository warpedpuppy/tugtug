import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
export default function () {
	return {
		cont: Assets.Container(),
		utils: Utils,
		init: function (parentCont) {
			this.parentCont = parentCont;
			let s;
			for(let i = 0; i < 4; i ++){
				s = Assets.Sprite('slot.png');
				s.alpha = 0.25;
				s.x = 50 * i;
				this.cont.addChild(s);
			}
			return this;
			
		},
		addToStage: function () {
			this.cont.x = (this.utils.canvasWidth - this.cont.width) /2;
			this.cont.y = this.utils.canvasHeight - this.cont.height - 100;
			this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
			
		},
		resize: function () {
			this.cont.x = (this.utils.canvasWidth - this.cont.width) /2;
			this.cont.y = this.utils.canvasHeight - this.cont.height - 100;
		},
		animate: function () {

		}
	}
}