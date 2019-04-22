import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
// import Config from '../../animationsConfig';
export default {
		//cont: Assets.Container(),
		utils: Utils,
		tokens: [],
		init: function () {
		
			let s;
			for(let i = 1; i <= 4; i ++){
				s =  Assets.Sprite(`token${i}.png`);
				s.name = 'token';
				s.placed = false;
				s.id = i;
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