import Assets from './assetCreation';
import Utils from './utils';
import Config from '../animationsConfig';
import BlastOff from './tweens/spaceShipBlastOff';
import ReturnHome from './tweens/spaceShipReturnHome';
import { TweenMax, TimelineMax, Elastic } from 'gsap';
import Easing from './tweens/easing';
export default {
		animation: new TimelineMax(),
		utils: Utils,
		allowTween: false,
		fadeOutBoolean: false,
		fadeInBoolean: false,
		tweenArray: [],
		blastOff: BlastOff,
		tweens: [],
		defaultEasing: 'linear',
		killAll: function () {
			//TweenMax.killAll();
			let clone = (this.tweens)?this.tweens.slice():[];
			this.tweens.length = 0;

			clone.forEach((item, index) => {

				item.changeProperties.forEach((changeObject, index2) => {
					let changeObjectProperties = changeObject.changePropertiesObject;
					for(let property in changeObjectProperties) {

							let startValue = changeObjectProperties[property][0];
							let endValue = changeObjectProperties[property][1];
							item[property] = endValue;
							clone.splice(index, 1);
							break;
					}

				})
			})
		},
		isTweening: function (item) {
			return TweenMax.isTweening(item);
		},
		planetJump: function (orbsCont, hero, newPlanet, onCompleteFunction) {
			let newX = (this.utils.canvasWidth / 2);
			let newY = (this.utils.canvasHeight / 2);
			this.tween(orbsCont.pivot, 0.5, {x: [orbsCont.pivot.x, newPlanet.x], y: [orbsCont.pivot.y, newPlanet.y], onComplete: onCompleteFunction, easing: 'easeOutBounce'});
			this.tween(hero, 0.5, {y:  [hero.y, -newPlanet.radius]});
		},
		spaceShipBlastOff: function (ship, maze, background, onCompleteHandler) {
			BlastOff.spaceShipBlastOff(ship, maze, background, onCompleteHandler);
		},
		spaceShipReturnHome: function (background, maze, ship, onCompleteHandler) {
			ReturnHome.spaceShipReturnHome(background, maze, ship, onCompleteHandler);
		},
		tween: function (item, seconds, changePropertiesObject) {

			let changeIncrement = (1 / this.utils.app._ticker.FPS) / seconds
			let obj = {
				changePropertiesObject,
				changeIncrement,
				seconds 
			}
			item.seconds = seconds;
			item.startTime = new Date().getTime();
			if (Array.isArray(item.changeProperties)) {
				item.changeProperties.push(obj);
			} else {
				item.changeProperties = [obj];
			}
			//console.log(obj)
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
				//console.log(this.tweenArray.length)
				this.tweenArray.forEach((item, index) => {

					if(!item.changeProperties.length){
						this.tweenArray.splice(index, 1)
					}

					item.changeProperties.forEach((changeObject, index2) => {
					
						let changeObjectProperties = changeObject.changePropertiesObject;

						for(let property in changeObjectProperties) {

							// let startValue = changeObjectProperties[property][0];
							// let endValue = changeObjectProperties[property][1];
							// let changeIncrement = -(endValue - startValue) * changeObject.changeIncrement;

							// let currentChange = item[property] - startValue;
							// let currentTime = new Date().getTime();
							

						
								let t = new Date().getTime() - item.startTime;
								let b = changeObjectProperties[property][0];
								let c = changeObjectProperties[property][1];
								let d = item.seconds * 1000;
								let e = c - b;
								let percentage = t / d;
								//console.log(t, d)
								let easing = (!changeObjectProperties["easing"])?this.defaultEasing:changeObjectProperties["easing"];
								let inc = Easing[easing](percentage);
								var inc2 = b + inc*(c-b);
						      //console.log(percentage,inc2)

						      if (percentage <  1) {
						          item[property] = inc2;
						       } else {
						        //console.log("done")
						        if(changeObjectProperties["onComplete"]) {
									changeObjectProperties["onComplete"]();
									changeObjectProperties["onComplete"] = function(){};
								}
						        item.changeProperties.splice(index2, 1)
						       }


						}

					})

					

				})

			}
			
			
		}
}