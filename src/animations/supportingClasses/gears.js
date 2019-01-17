import * as PIXI from 'pixi.js';
export default {
	gears: [],
	init: function (cont, wh) {
		let gear;
		let corners = this.corners = [[0,0],[wh.canvasWidth, 0], [wh.canvasWidth, wh.canvasHeight], [0, wh.canvasHeight]];
		for(let i = 0; i < 4;i++){
		    gear = new PIXI.Sprite.fromImage('/bmps/gear.png');
		    gear.anchor.x = gear.anchor.y = 0.5;
		    gear.x = corners[i][0];
		    gear.y = corners[i][1];
		    gear.alpha = 0.15;
		    gear.rotate = (Math.random()*0.01)+0.01;
		    cont.addChild(gear);
		    this.gears.push(gear);
		}
	},
	resize: function (wh) {
		let corners = this.corners = [[0,0],[wh.canvasWidth, 0], [wh.canvasWidth, wh.canvasHeight], [0, wh.canvasHeight]];
		for(let i = 0; i < 4;i++){
		    let gear = this.gears[i];
		    gear.x = corners[i][0];
		    gear.y = corners[i][1];
		}
	},
	animate: function () {
		for(let i = 0; i < 4; i++){
	      this.gears[i].rotation += this.gears[i].rotate;
	    }
	}
}