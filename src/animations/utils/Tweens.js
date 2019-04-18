import Assets from './assetCreation';
import Utils from './utils';
import Config from '../animationsConfig';
import BlastOff from './tweens/spaceShipBlastOff';
import ReturnHome from './tweens/spaceShipReturnHome';
import { TweenMax, TimelineMax, Elastic } from 'gsap';
export default {
		animation: new TimelineMax(),
		utils: Utils,
		allowTween: false,
		fadeOutBoolean: false,
		fadeInBoolean: false,
		tweenArray: [],
		blastOff: BlastOff,
		tweens: [],
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
			this.tween(orbsCont.pivot, 0.5, {x: [orbsCont.pivot.x, newPlanet.x], y: [orbsCont.pivot.y, newPlanet.y], onComplete: onCompleteFunction});
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

				this.tweenArray.forEach((item, index) => {

					if(!item.changeProperties.length){
						this.tweenArray.splice(index, 1)
					}

					item.changeProperties.forEach((changeObject, index2) => {
					
						let changeObjectProperties = changeObject.changePropertiesObject;

						for(let property in changeObjectProperties) {

							let startValue = changeObjectProperties[property][0];
							let endValue = changeObjectProperties[property][1];
							let changeIncrement = -(endValue - startValue) * changeObject.changeIncrement;

							let currentChange = item[property] - startValue;
							let currentTime = new Date().getTime();
							//console.log(currentTime, startValue, currentChange,changeObject.seconds)
			//changeIncrement = this.easeInQuad(currentTime, startValue, currentChange,changeObject.seconds)

							 // let t = new Date().getTime() - item.startTime;
						  //     let b = startValue;
						  //     let c = endValue - item[property];
						  //     let d = item.seconds * 1000;
						  //     let percentage = t / d;
						  //     console.log(percentage)
						  //     let inc = this.easeInSine(t, b, c, d);
							// console.log(property, startValue, endValue, Math.round(item[property]),  changeIncrement)
							// console.log(property, changeIncrement)
	
							if (startValue < endValue) {
								if (item[property] < endValue) {
									item[property] -= changeIncrement;
								} else {
									item[property] = endValue;
									if(changeObjectProperties["onComplete"]) {
										changeObjectProperties["onComplete"]();
										changeObjectProperties["onComplete"] = function(){};
									}
									item.changeProperties.splice(index2, 1)
								}
							}

							if (startValue > endValue) {
								if (item[property] > endValue) {
									item[property] -= changeIncrement;
								} else {
									item[property] = endValue;
									if(changeObjectProperties["onComplete"]) {
										changeObjectProperties["onComplete"]();
										changeObjectProperties["onComplete"] = function(){};
									}
									item.changeProperties.splice(index2, 1)
								}
							}

						}

					})

					

				})

			}
			
			
		}
}