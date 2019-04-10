import Assets from './assetCreation';
import Utils from './utils';
import Config from '../animationsConfig';
import { TweenMax, TimelineMax, Elastic } from 'gsap';
export default {
		animation: new TimelineMax(),
		utils: Utils,
		killAll: function () {
			TweenMax.killAll()
		},
		isTweening: function (item) {
			return TweenMax.isTweening(item);
		},
		planetJump: function (orbsCont, hero, newPlanet, onCompleteFunction) {
			let newX = (this.utils.canvasWidth / 2);
			let newY = (this.utils.canvasHeight / 2);
			TweenMax.to(orbsCont.pivot, 1.5, {x: newPlanet.x, y: newPlanet.y, ease: Elastic.easeOut})
			TweenMax.to(orbsCont, 1.5, {x: newX, y: newY, ease: Elastic.easeOut, onComplete: onCompleteFunction})
			TweenMax.to(hero, 1.5, {y:  -newPlanet.radius, ease: Elastic.easeOut})
		},
		spaceShipBlastOff: function (ship, maze, background, onCompleteHandler) {
			this.storeX = maze.x;
			this.storeY = maze.y;
			this.storeShipScale = ship.scale.x;
			this.animation.to(ship, 1, {rotation: this.utils.deg2rad(90)})
			.to(ship.scale, 1, {x: 1, y: 1})
			.to(maze.scale, 1, {x: 0.15, y: 0.15})
			.to(maze, 1, {x: -maze.width})
			.to(background.scale, 1, {x: 1, y: 1, onComplete: onCompleteHandler})
		},
		spaceShipReturnHome: function (background, maze, ship, onCompleteHandler) {

			this.animation
			.to(background.scale, 1, {x: 0, y: 0})
			.to(maze, 1, {x: this.utils.root.grid.gridBuild.initialPoint.x, y:  this.utils.root.grid.gridBuild.initialPoint.y})
			.to(maze.scale, 1, {x: 1, y: 1})
			.to(ship, 1, {rotation: this.utils.deg2rad(0)})
			.to(ship.scale, 1, {x: this.storeShipScale, y: this.storeShipScale, onComplete: onCompleteHandler})
		},
		animate: function () {

		}
}