import Utils from '../../../../utils/utils';
import Assets from '../../../../utils/assetCreation';

export default function Vortexes () {
	return {
		vortexArray: [],
		utils: Utils,
		createVortex: function (rotateQ, item) {
			let mask = Assets.Graphics();
			mask.beginFill(0xFF3300).drawRect(0, 0, 400, 400).endFill();
			let vortex = Assets.Sprite('vortex.png');
			vortex.alpha = 0.5;
			vortex.rotationQ = rotateQ;
			vortex.anchor.set(0.5);
			vortex.mask = mask;
			this.vortexArray.push({vortex, mask, item});
		},
		addRemoveVortexes: function(add) {
			this.vortexArray.forEach(v => {
				if (add) {
					this.utils.app.stage.addChildAt(v.vortex, 0);
				} else {
					this.utils.app.stage.removeChild(v.vortex);
				}
			})
		},
	}
}