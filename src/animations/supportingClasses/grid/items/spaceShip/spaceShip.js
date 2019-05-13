import Assets from '../../../../utils/assetCreation';
import Utils from '../../../../utils/utils';
// import Config from '../../../../animationsConfig';
import Tweens from '../../../../utils/tweens';
export default function () {
	return {
		utils: Utils,
		init: function () {
			this.makeJumpActive = this.makeJumpActive.bind(this);
			this.completeReturnHomeHandler = this.completeReturnHomeHandler.bind(this);
			this.ship = Assets.Sprite("spaceShip.png")
			this.ship.anchor.set(0.5)
			this.ship.scale.set(0.25)
			this.ship.counter = 0;
			this.ship.name = "spaceship";
			this.ship.classRef = this;
			return this.ship

		},
		blastOff: function () {
			this.utils.root.score.hide();
			this.utils.root.startSpaceShipJourney();

			this.storeActiveMode = this.utils.root.activeMode;

			this.utils.app.stage.addChild(this.ship);
			this.ship.x = this.utils.canvasWidth / 2;
			this.ship.y = this.utils.canvasHeight / 2;
	
			let maze = this.utils.root.grid.gridBuild.cont;
			let jump = this.utils.root.jump;
			let background = this.utils.root.jump.jumpBackground.orbsCont;
			background.scale.set(0);
			jump.addToStage();

			Tweens.spaceShipBlastOff(this.ship, maze, background, this.makeJumpActive);

		},
		makeJumpActive: function () {
			this.utils.root.animations.explosionStart();
			this.utils.root.animations.circles(false);
			this.utils.root.score.show();
			Tweens.killAll();
			this.utils.root.makeJumpActive();
		},
		returnHome: function () {
			this.utils.root.score.hide();
			this.utils.hero.cont.visible = false;
			this.utils.app.stage.addChild(this.ship);
			this.ship.x = this.utils.canvasWidth / 2;
			this.ship.y = this.utils.canvasHeight / 2;
			let maze = this.utils.root.grid.gridBuild.cont;
			let jump = this.utils.root.jump;
			let background = jump.jumpBackground.orbsCont;
			console.log(this)
			Tweens.spaceShipReturnHome(
				background, 
				maze, 
				this.ship, 
				this.completeReturnHomeHandler)
		
		},
		completeReturnHomeHandler: function (storeX) {
			//in case coming back from jump 
			this.utils.root.score.show();
			if (this.utils.root.activeMode === 'jump') {
	
				let jump = this.utils.root.jump;
				let background = jump.jumpBackground.orbsCont;
				background.scale.set(1);
				let maze = this.utils.root.grid.gridBuild.cont;
				maze.scale.set(1);
				//maze.x = this.storeX;
				this.ship.scale.set(0.25);
				this.ship.rotation = 0;

			}

			this.utils.hero.cont.visible = true;
			this.utils.hero.activeHero.cont.y = 0;


			this.ship.x = this.ship.storeX;
			this.ship.y = this.ship.storeY;

			this.utils.root.endSpaceShipJourney();
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