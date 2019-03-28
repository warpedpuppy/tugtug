import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
export default function () {
	return {
		init: function () {
			this.ship = Assets.Sprite("spaceShip.png")
			this.ship.anchor.set(0.5)
			this.ship.scale.set(0.25)
			return this.ship

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