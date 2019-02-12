import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from './animationsConfig';
export default function () {
	return {
		cont: Assets.Container(),
		utils: Utils,
		init: function (parentCont) {
			this.parentCont = parentCont;
			let s;
			for(let i = 0; i < 4; i ++){
				s = Assets.Sprite('slot.png');
				s.x = 50 * i;
				this.cont.addChild(s);
			}
			return this;
			
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
}