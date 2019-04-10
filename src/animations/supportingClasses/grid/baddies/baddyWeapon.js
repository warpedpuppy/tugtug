import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Config from '../../../animationsConfig';
export default function (gridBuild) {
	return {
		spearThrowing: false,
		throw: false,
		spearCounter: 0,
		init: function () {
			this.spear = Assets.Sprite('bouncePlatformLine.png');
			this.spear.anchor.set(0.5);
			this.spear.width = 50;
			this.spear.height = 4;
			this.spear.vx = 0;
			this.spear.vy = 0;
			this.spear.classRef = this;
			return this.spear;
		},
		reset: function () {
			this.spearCounter = 0;
			this.throw = false;
			this.spearThrowing = false;
		},
		addToStage: function () {
			gridBuild.cont.addChild(this.spear);
		},
		removeFromStage: function () {
			gridBuild.cont.removeChild(this.spear);
		},
		resize: function () {

		},
		animate: function () {

		}
	}
}