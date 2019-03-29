import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
import { TweenMax, TimelineMax, Elastic } from 'gsap';
export default function () {
	return {
		utils: Utils,
		init: function () {
			this.animation = new TimelineMax();
			this.ship = Assets.Sprite("spaceShip.png")
			this.ship.anchor.set(0.5)
			this.ship.scale.set(0.25)
			this.ship.classRef = this;
			return this.ship

		},
		blastOff: function () {
			// //PAUSE KEY LISTENERS
			this.storeActiveMode = this.utils.root.activeMode;
			console.log('storing = ')
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

			this.animation.to(this.ship, 1, {rotation: this.utils.deg2rad(90)})
			.to(this.ship.scale, 1, {x: 1, y: 1})
			.to(maze.scale, 1, {x: 0.15, y: 0.15})
			.to(maze, 1, {x: -maze.width})
			.to(background.scale, 1, {x: 1, y: 1, onComplete: this.makeJumpActive.bind(this)})


			// TESTING
			// let maze = this.utils.root.grid.cont;
			// maze.visible = false;
			// this.makeJumpActive();



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

			this.animation
			.to(background.scale, 1, {x: 0, y: 0})
			.to(maze, 1, {x: this.storeX})
			.to(maze.scale, 1, {x: 1, y: 1})
			.to(this.ship, 1, {rotation: this.utils.deg2rad(0)})
			.to(this.ship.scale, 1, {x: this.storeShipScale, y: this.storeShipScale, onComplete: this.completeReturnHomeHandler.bind(this)})
		},
		completeReturnHomeHandler: function () {
			console.log("complete");

			this.utils.root.switchPlayer(this.storeActiveMode);

			//place ship back on tile
			this.utils.root.grid.placeShip();
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