import Assets from '../assetCreation';
import Utils from '../utils';
import Config from '../../animationsConfig';
import Tweens from '../Tweens';
export default function () {
	return {
		utils: Utils,
		spaceShipBlastOff: function (ship, maze, background, onCompleteHandler) {

			this.utils.root.animations.circles({start: true, expand: false});
			this.utils.root.fly.flyBackground.clouds.removeFromStage();
			this.storeX = maze.x;
			this.storeY = maze.y;
			this.storeShipScale = ship.scale.x;
			this.mazeWidth = maze.calculatedWidth;
			this.ship = ship;
			this.maze = maze;
			this.background = background;
			this.blastOffComplete = onCompleteHandler;

			Tweens.tween(this.ship, 1, 
			{
				rotation:  [this.ship.rotation,  this.utils.deg2rad(90)]
			}, 
			this.spaceShipBlastOff_2.bind(this),
			'easeOutBounce');
			
		},
		spaceShipBlastOff_2: function () {

			this.utils.root.grid.gridBuild.vortexes.addRemoveVortexes(false);
			
			let shipSpace = this.utils.root.grid.gridBuild.shipSpace;
			this.utils.root.grid.gridBuild.cont.pivot = Assets.Point(shipSpace[0], shipSpace[1])
			//console.log(shipSpace)
			//console.log(this.utils.root.grid.gridBuild.cont.pivot)

			this.maze.x = this.utils.canvasWidth / 2;
			this.maze.y = this.utils.canvasHeight / 2;
			
			Tweens.tween(this.maze.scale, 1, {
				x: [this.maze.scale.x, 0], 
				y: [this.maze.scale.y, 0]
			}, 
			this.spaceShipBlastOff_3.bind(this),
			'easeInOutQuad'
			);

			Tweens.tween(this.ship.scale, 1, {
				x: [this.ship.scale.x, 1], 
				y: [this.ship.scale.y, 1]
			}, 
			undefined,
			'easeInOutQuad'
			);

		},
		spaceShipBlastOff_3: function () {
			this.background.alpha = 0;
			Tweens.tween(this.background.scale, 5, 
			{
				x: [10, 1], 
				y: [10, 1]
			}, 
			this.blastOffComplete,
			'linear');
			Tweens.tween(this.background, 5, 
			{
				alpha: [0, 1]
			}, 
			undefined,
			'linear');

		},
		// spaceShipBlastOff_4: function () {
		// 	//console.log("4")
		// 	//this.mazeWidth = this.maze.width;
		// 	Tweens.tween(this.maze, 2, 
		// 	{
		// 		x: [this.maze.x, -this.mazeWidth]
		// 	}, 
		// 	this.spaceShipBlastOff_5.bind(this),
		// 	'easeOutBounce');
		// },
		// spaceShipBlastOff_5: function () {
		// 	console.log("5")
		// 	Tweens.tween(this.background.scale, 2, 
		// 	{
		// 		x: [this.background.scale.x, 1], 
		// 		y: [this.background.scale.y, 1]
		// 	}, 
		// 	this.blastOffComplete,
		// 	'easeOutBounce');
		// }
	}
}