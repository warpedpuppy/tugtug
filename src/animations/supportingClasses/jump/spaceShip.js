import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
import Tweens from '../../utils/tweens';
export default function () {
	return {
		utils: Utils,
		init: function () {
			
			this.ship = Assets.Sprite("spaceShip.png")
			this.ship.anchor.set(0.5)
			this.ship.scale.set(0.25)
			this.ship.classRef = this;
			return this.ship

		},
		blastOff: function () {
			// //PAUSE KEY LISTENERS
			this.storeActiveMode = this.utils.root.activeMode;

			// //zoom ship in and tilt 90 degrees.
			this.utils.app.stage.addChild(this.ship);
			this.ship.x = this.utils.canvasWidth / 2;
			this.ship.y = this.utils.canvasHeight / 2;
			// // rush maze backwards
			 let maze = this.utils.root.grid.cont;

			// // add jump background to stage
			let jump = this.utils.root.jump;
			let background = jump.jumpBackground.orbsCont;
			background.scale.set(0)
			jump.addToStage();

			this.storeX = maze.x;
			this.storeShipScale = this.ship.scale.x;

			Tweens.spaceShipBlastOff(this.ship, maze, background, this.makeJumpActive.bind(this));
		



		},
		makeJumpActive: function () {
			console.log("make jump active");
			//this.ship.parent.removeChild(this.ship);
			let jump = this.utils.root.jump.jumpBackground.addSpaceShip();
			this.utils.root.switchPlayer("jump");
		},
		returnHome: function () {
			this.utils.app.stage.addChild(this.ship);
			this.ship.x = this.utils.canvasWidth / 2;
			this.ship.y = this.utils.canvasHeight / 2;
			let maze = this.utils.root.grid.cont;
			let jump = this.utils.root.jump;
			let background = jump.jumpBackground.orbsCont;

			Tweens.spaceShipReturnHome(background, maze, this.ship, this.completeReturnHomeHandler.bind(this), this.storeX, this.storeShipScale)
		
		},
		completeReturnHomeHandler: function () {
			console.log("complete");

			this.utils.root.switchPlayer(this.storeActiveMode);

			//place ship back on tile
			this.utils.root.grid.gridBuild.placeShip();
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