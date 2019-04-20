import Assets from './assetCreation';
import Utils from './utils';
import Config from '../animationsConfig';
import BlastOff from './tweens/spaceShipBlastOff';
import ReturnHome from './tweens/spaceShipReturnHome';
import Easing from './tweens/easing';
export default {
		utils: Utils,
		allowTween: false,
		fadeOutBoolean: false,
		fadeInBoolean: false,
		tweenArray: [],
		blastOff: BlastOff,
		tweens: [],
		defaultEasing: 'linear',
		killAll: function () {
			
			let clone = (this.tweens)?this.tweens.slice():[];
			this.tweens.length = 0;

			clone.forEach((item, index) => {
				for(let property in item.obj) {
						let endValue = item.obj[property][1];
						item[property] = endValue;
						clone.splice(index, 1);
						break;
				}
			})
		},
		planetJump: function (orbsCont, hero, newPlanet, onCompleteFunction) {
			let newX = (this.utils.canvasWidth / 2);
			let newY = (this.utils.canvasHeight / 2);
			this.tween(orbsCont.pivot, 0.5, 
				{
					x: [orbsCont.pivot.x, newPlanet.x], 
					y: [orbsCont.pivot.y, newPlanet.y] 
				},
				onCompleteFunction,
				'easeOutBounce'
				);
			this.tween(hero, 0.5, {y:  [hero.y, -newPlanet.radius]});
		},
		spaceShipBlastOff: function (ship, maze, background, onCompleteHandler) {
			BlastOff.spaceShipBlastOff(ship, maze, background, onCompleteHandler);
		},
		spaceShipReturnHome: function (background, maze, ship, onCompleteHandler) {
			ReturnHome.spaceShipReturnHome(background, maze, ship, onCompleteHandler);
		},
		tween: function (item, seconds, changePropertiesObject, onComplete, easing) {
			
			if(item.isTweening)return;

			item.id = this.utils.randomIntBetween(10, 20);
			
			item.seconds = seconds;
			item.onComplete = onComplete;
			item.easing = easing;
			item.startTime = new Date().getTime();
			item.obj = changePropertiesObject
		
			item.isTweening = true;
			this.tweenArray.push(item);

			
		},
		easeInQuad: function (t, b, c, d) {
			// t: current time, b: begInnIng value, c: change In value, d: duration
			return c*(t/=d)*t + b;
		},
		easeInSine: function (t, b, c, d) {
		    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		 },
		animate: function () {
			if (this.tweenArray.length) {
				this.tweenArray.forEach((item, index) => {
					if (!item.obj) {
						item.isTweening = false;
						 if(item.onComplete) {
							item.onComplete();
						}
						this.tweenArray.splice(index, 1)
					}
					for(let property in item.obj) {
							let t = new Date().getTime() - item.startTime;
							let b = item.obj[property][0];
							let c = item.obj[property][1];
							let d = item.seconds * 1000;
							let e = c - b;
							let percentage = t / d;
							//console.log(t, d)
							let easing = (!item.easing)?this.defaultEasing:item.easing;
							let inc = Easing[easing](percentage);
							var inc2 = b + inc*(c-b);
					      
					      if (percentage <  1) {
					          item[property] = inc2;
					       } else {
					       	item.obj = undefined;
					       	break;
					       }
					}
				})
			}
		}
}