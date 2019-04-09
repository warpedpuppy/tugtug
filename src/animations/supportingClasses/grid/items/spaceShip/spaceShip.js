import Assets from '../../../../utils/assetCreation';
import Utils from '../../../../utils/utils';
import Config from '../../../../animationsConfig';
import Tweens from '../../../../utils/tweens';
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

			this.utils.hero.cont.visible = false;
			// //PAUSE KEY LISTENERS
			this.storeActiveMode = this.utils.root.activeMode;

			// //zoom ship in and tilt 90 degrees.
			this.utils.app.stage.addChild(this.ship);
			this.ship.x = this.utils.canvasWidth / 2;
			this.ship.y = this.utils.canvasHeight / 2;
			// // rush maze backwards
			let maze = this.utils.root.grid.gridBuild.cont;

			// // add jump background to stage
			let jump = this.utils.root.jump;
			let background = jump.jumpBackground.orbsCont;
			background.scale.set(0)
			jump.addToStage();
			Tweens.spaceShipBlastOff(this.ship, maze, background, this.makeJumpActive.bind(this));


		},
		makeJumpActive: function () {
			this.utils.hero.cont.visible = true;
			console.log("make jump active");
			//this.ship.parent.removeChild(this.ship);
			let jump = this.utils.root.jump.jumpBackground.addSpaceShip();
			this.utils.root.switchPlayer("jump");
		},
		returnHome: function () {
			this.utils.hero.cont.visible = false;
			this.utils.app.stage.addChild(this.ship);
			this.ship.x = this.utils.canvasWidth / 2;
			this.ship.y = this.utils.canvasHeight / 2;
			let maze = this.utils.root.grid.gridBuild.cont;
			let jump = this.utils.root.jump;
			let background = jump.jumpBackground.orbsCont;

			Tweens.spaceShipReturnHome(
				background, 
				maze, 
				this.ship, 
				this.completeReturnHomeHandler.bind(this))
		
		},
		completeReturnHomeHandler: function () {
			this.utils.hero.cont.visible = true;
			this.utils.hero.activeHero.cont.y = 0;
			
			this.utils.root.switchPlayer(this.storeActiveMode);
			
			this.utils.root.grid.gridBuild.placeHero();
			//this.utils.root.grid.gridBuild.placeShip();
			this.ship.x = this.ship.storeX;
			this.ship.y = this.ship.storeY;
			this.utils.root.grid.gridBuild.cont.addChild(this.ship);
			this.utils.root.grid.gridAction.pause = false;
			this.utils.root.activeAction.vx = this.utils.root.activeAction.vy = 0;
			this.utils.root.activeAction.radius = this.utils.root.activeAction.storeRadius = 0;
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