import Assets from '../assetCreation';
import Utils from '../utils';
import Config from '../../animationsConfig';
import Tweens from '../tweens';
export default {
		utils: Utils,
		spaceShipBlastOff: function (ship, maze, background, onCompleteHandler) {
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
			//console.log("2")
			Tweens.tween(this.ship.scale, 1, 
			{
				x: [this.ship.scale.x, 1], 
				y: [this.ship.scale.y, 1]
			}, 
			this.spaceShipBlastOff_3.bind(this),
			'easeOutBounce'
			);
		},
		spaceShipBlastOff_3: function () {
			//console.log("3")
			Tweens.tween(this.maze.scale, 1, {
				x: [this.maze.scale.x, 0.015], 
				y: [this.maze.scale.y, 0.015]
			}, 
			this.spaceShipBlastOff_4.bind(this),
			'easeInOutQuad'
			);
		},
		spaceShipBlastOff_4: function () {
			//console.log("4")
			//this.mazeWidth = this.maze.width;
			Tweens.tween(this.maze, 2, 
			{
				x: [this.maze.x, -this.mazeWidth]
			}, 
			this.spaceShipBlastOff_5.bind(this),
			'easeOutBounce');
		},
		spaceShipBlastOff_5: function () {
			console.log("5")
			Tweens.tween(this.background.scale, 2, 
			{
				x: [this.background.scale.x, 1], 
				y: [this.background.scale.y, 1]
			}, 
			this.blastOffComplete,
			'easeOutBounce');
		}
}