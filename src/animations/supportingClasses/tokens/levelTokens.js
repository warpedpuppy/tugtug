import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
// import Config from '../../animationsConfig';
export default {
		//cont: Assets.Container(),
		utils: Utils,
		tokens: [],
		init: function () {
		
			let t;
			for(let i = 1; i <= 4; i ++){
				t =  Assets.Sprite(`token${i}.png`);
				t.anchor.set(0.5)
				t.name = 'token';
				t.placed = false;
				t.num = i;
				t.id = i;
				this.tokens.push(t);
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