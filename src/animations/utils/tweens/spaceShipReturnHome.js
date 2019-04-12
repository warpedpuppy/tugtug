import Assets from '../assetCreation';
import Utils from '../utils';
import Config from '../../animationsConfig';
import Tweens from '../tweens';
export default {
		utils: Utils,
		spaceShipReturnHome_old: function (background, maze, ship, onCompleteHandler) {
			

			// this.animation
			// .to(background.scale, 1, {x: 0, y: 0})
			// .to(maze, 1, {x: this.utils.root.grid.gridBuild.initialPoint.x, y:  this.utils.root.grid.gridBuild.initialPoint.y})
			// .to(maze.scale, 1, {x: 1, y: 1})
			// .to(ship, 1, {rotation: this.utils.deg2rad(0)})
			// .to(ship.scale, 1, {x: this.storeShipScale, y: this.storeShipScale, onComplete: onCompleteHandler})
		},
		spaceShipReturnHome: function (background, maze, ship, onCompleteHandler) {
			this.background = background;
			this.maze = maze;
			this.ship = ship;
			this.onCompleteHandler = onCompleteHandler;
			console.log(this.onCompleteHandler)
			Tweens.tween(background.scale, 1, {
				x: [background.scale.x,0], 
				y: [background.scale.y,0],
				onComplete: this.spaceShipReturnHome_2.bind(this)})
			
		},
		spaceShipReturnHome_2: function () {
			console.log("2")
			Tweens.tween(this.maze, 1, {
				x: [this.maze.x, this.utils.root.grid.gridBuild.initialPoint.x], 
				y:  [this.maze.y, this.utils.root.grid.gridBuild.initialPoint.y],
				onComplete: this.spaceShipReturnHome_3.bind(this)})
			
		},
		spaceShipReturnHome_3: function () {
			console.log("3")
			Tweens.tween(this.maze.scale, 1, {
				x: [this.maze.scale.x,1], 
				y: [this.maze.scale.y, 1],
				onComplete: this.spaceShipReturnHome_4.bind(this)})
			
		},
		spaceShipReturnHome_4: function () {
			console.log("4")
			Tweens.tween(this.ship, 1, {
				rotation: [this.ship.rotation, this.utils.deg2rad(0)],
				onComplete: this.spaceShipReturnHome_5.bind(this)})
			
		},
		spaceShipReturnHome_5: function () {
			console.log("5", Tweens.blastOff.storeShipScale)
			Tweens.tween(this.ship.scale, 1, {
				x: [this.ship.scale.x, Tweens.blastOff.storeShipScale], 
				y: [this.ship.scale.y, Tweens.blastOff.storeShipScale], 
				onComplete: this.onCompleteHandler})
		}
}