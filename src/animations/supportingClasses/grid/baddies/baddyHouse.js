import Utils from '../../../utils/utils';
import Assets from '../../../utils/assetCreation';
import Config from '../../../animationsConfig';
export default function (gridBuild) {
	return {
		init: function () {
			this.c = Assets.Sprite('castle.png');
			this.c.anchor.set(0.5);
			//this.c.scale.set(0.25);
			this.c.classRef = this;
			return this.c;
		},
		addToStage: function () {
			gridBuild.cont.addChild(this.c);
		},
		removeFromStage: function () {
			gridBuild.cont.removeChild(this.c);
		},
		resize: function () {
		},
		animate: function () {
		}
	}
}