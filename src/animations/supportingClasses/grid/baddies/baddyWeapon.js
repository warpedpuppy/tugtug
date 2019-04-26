import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Config from '../../../animationsConfig';
export default function (gridBuild) {
	return {
		counter: 0,
		counterLimit: 200,
		init: function (baddy) {
			this.baddy = baddy;
			this.spear = Assets.Sprite('bouncePlatformLine.png');
			this.spear.anchor.set(0.5);
			this.spear.width = 50;
			this.spear.height = 4;
			this.spear.vx = 0;
			this.spear.vy = 0;
			this.spear.classRef = this;
			return this.spear;
		},
		disable: function () {
			this.spear.visible = false;

		},
		reenable: function () {
			this.spear.visible = true;
			this.spear.x = this.baddy.x;
			this.spear.y = this.baddy.y;
			this.counter = 0;
		},
		addToStage: function () {
			gridBuild.cont.addChild(this.spear);
		},
		removeFromStage: function () {
			gridBuild.cont.removeChild(this.spear);
		},
		reset: function () {
			this.spear.vx = 0;
			this.spear.vy = 0;
			this.counter = 0;
			this.spear.x = this.spear.y = 0;
			this.spear.rotation = 0;
		},
		resize: function () {

		},
		animate: function () {

		}
	}
}