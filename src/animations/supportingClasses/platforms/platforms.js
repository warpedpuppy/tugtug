import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function() {
	return {
		cont: new PIXI.Container(),
		platforms: [],
		init: function (arr, cont) {
			for(let i = 0; i < arr.length; i ++){
				let p = this.createPlatform();
				p.x = arr[i][0] - (p.width / 2);
				p.y = arr[i][1];
				this.platforms.push(p);
				cont.addChild(p);
			}
		},
		resize: function (arr) {
			for(let i = 0; i < arr.length; i ++){
				let p = this.platforms[i];
				p.x = arr[i][0] - (p.width / 2);
				p.y = arr[i][1];
			}
		},
		toggleVisibility: function (boolean) {
			for(let i = 0; i < this.platforms.length; i ++){
				this.platforms[i].visible = boolean;
			}
		},
		returnPlatforms: function () {
			return this.platforms;
		},
		createPlatform: function () {
			let b = new PIXI.Graphics();
		    b.beginFill(0x000000).drawRect(0,0,200,20).endFill();
		    b.pivot.set(0.5);
            return b;
		}

	}
}