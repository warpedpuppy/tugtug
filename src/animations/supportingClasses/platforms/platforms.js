import * as PIXI from 'pixi.js';
export default function(wh) {
	return {
		cont: new PIXI.Container(),
		platforms: [],
		init: function (cont) {

			let arr = this.positionArray(wh);

			for(let i = 0; i < arr.length; i ++){
				let p = this.createPlatform();
				p.x = arr[i][0] - (p.width / 2);
				p.y = arr[i][1];
				this.platforms.push(p);

				cont.addChild(p);
			}
		},
		positionArray: function (wh){
			return [
            [(wh.canvasWidth / 2), wh.canvasHeight / 2],
			[(wh.canvasWidth * 0.33),(wh.canvasHeight / 2) - 100],
			[(wh.canvasWidth * 0.66), (wh.canvasHeight / 2) - 100]];
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
		returnPlatforms: function (str, stage) {
			return this.platforms;
		},
		createPlatform: function () {
			let cont = new PIXI.Container();
			let b = new PIXI.Graphics();
		    b.beginFill(0x000000).drawRect(0,0,200,20).endFill();
		    b.pivot.set(0.5);
		    cont.addChild(b);
            return cont;
		}

	}
}