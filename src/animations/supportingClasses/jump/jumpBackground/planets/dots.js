import Assets from '../../../../utils/assetCreation';
import Utils from '../../../../utils/utils';
import Config from '../../../../animationsConfig';
import Dots from './dots';
import Gremlin from './gremlins';

export default function () {
	return {
		utils: Utils,
		radius: 5, 
		collisionDetect: {},
		build: function (planetWidth) {

			let dotsCont = Assets.Container();
			let dotsArray = [];
			let dotQ = this.dotQ = Config.spaceDotsPerPlanet;
			let dist = this.dist = (planetWidth / 2) + 20;
	
			dotsCont.dist = dist;
			
			for (let k = 0; k < dotQ; k++) {
				let dot = this.dot();
				dot.radius = this.radius;
				dot.dist = this.dist;
	            dot.x = dot.startX =  this.dist * Math.cos( ( 2 * Math.PI) * k /  this.dotQ);
	            dot.y = dot.startY =  this.dist * Math.sin( ( 2 * Math.PI) * k /  this.dotQ);
	            //cont.dots.push(dot);
	            dotsCont.addChild(dot);
	            //this.dotOP.push(dot);
	            dotsArray.push(dot);
	        }
	        dotsCont.dots = dotsArray;
	        dotsCont.rotate = 0.02;
	        //dotsCont.x = cont.x;
	        //dotsCont.y = cont.y;
	        //this.orbsCont.addChild(dotsCont);
	        //this.dotsContArray.push(dotsCont);


			return dotsCont;
		},
		dot: function () {
			let dot = Assets.Graphics();
			dot.beginFill(0xFFFF00).drawCircle(0,0,this.radius).endFill();
			return dot;
		},
		// collisionDetect: function (heroObject, dot) {
		// 	let globalPoint = dot.toGlobal(this.utils.app.stage);
		// 	this.collisionDetect.x = globalPoint.x
		// 	this.collisionDetect.y = globalPoint.y;
		// 	this.collisionDetect.radius = this.radius;
		// 	if(dot.visible &&
		// 	   this.dotEatBoolean && 
		// 		this.utils.circleToCircleCollisionDetection(heroObject, this.collisionDetect)[0]) 
		// 	{
		// 		console.log("hit")
		// 		dot.visible = false;
		// 	}
		// },
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