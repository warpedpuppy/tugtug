import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
// import Config from '../../animationsConfig';
export default {
		//cont: Assets.Container(),
		utils: Utils,
		tokens: [],
		init: function () {
			// let s;
			// for(let i = 0; i < 4; i ++){
			// 	s = Assets.Sprite('slot.png');
			// 	s.x = 50 * i;
			// 	this.cont.addChild(s);
			// }
			// return this;

			let s;
			for(let i = 1; i <= 4; i ++){
				s =  Assets.Sprite(`token${i}.png`);
				this.tokens.push(s);
			}
			return this.tokens;
			
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