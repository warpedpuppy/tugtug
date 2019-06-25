import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
export default function () {
	return {
		build: function () {
			let t,
			    tokens = [];
			for (let i = 1; i <= 4; i ++) {
				t =  Assets.Sprite(`token${i}.png`);
				if(i === 1) {
					t.mode = 'fly';
				} else if(i === 2) {
					t.mode = 'swim';
				}
				t.anchor.set(0.5)
				t.name = 'token';
				t.placed = false;
				t.num = i;
				t.id = i;
				tokens.push(t);
			}
			return tokens;
		}
}
}