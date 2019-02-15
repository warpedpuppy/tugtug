import Assets from '../utils/assetCreation';
import Utils from '../utils/utils';
export default {
	gears: [],
	utils: Utils,
	init: function (cont) {
		let gear;
		let corners = this.corners = [
		[0,0],
		[this.utils.wh.canvasWidth, 0], 
		[this.utils.wh.canvasWidth,this.utils.wh.canvasHeight], 
		[0, this.utils.wh.canvasHeight]
		];
		for(let i = 0; i < 4;i++){
		    gear = Assets.Sprite('/gear.png');
		    gear.anchor.x = gear.anchor.y = 0.5;
		    gear.x = corners[i][0];
		    gear.y = corners[i][1];
		    gear.alpha = 0.15;
		    gear.rotate = (Math.random()*0.01)+0.01;
		    cont.addChild(gear);
		    this.gears.push(gear);
		}
	},
	resize: function () {
		let corners = this.corners = [
			[0,0],
			[this.utils.wh.canvasWidth, 0], 
			[this.utils.wh.canvasWidth, this.utils.wh.canvasHeight], 
			[0, this.utils.wh.canvasHeight]
		];
		for (let i = 0; i < this.gears.length;i++) {
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