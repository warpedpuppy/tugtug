import * as PIXI from 'pixi.js';
export default function () {
	return {
		cont: new PIXI.Container(),
		platforms: [],
		arr: [],

		init: function (cont, wh, spritesheet) {
			this.spritesheet = spritesheet;
			let arr = this.arr = this.positionArray(wh);
			this.cont = cont;
			for(let i = 0; i < arr.length; i ++){
				let p = this.createPlatform();
				p.x = arr[i][0];
				p.y = arr[i][1];
				this.platforms.push(p);
			}
		},
		addPlatforms: function (boolean) {
			// for(let i = 0; i < this.platforms.length; i ++){
			// 	if(boolean){
			// 		this.cont.addChild(this.platforms[i]);
			// 	} else {
			// 		this.cont.removeChild(this.platforms[i]);
			// 	}
			// }
		},
		positionArray: function (wh){
			return [
            [(wh.canvasWidth / 2), wh.canvasHeight / 2],
			[(wh.canvasWidth * 0.25),(wh.canvasHeight / 2) - 300],
			[(wh.canvasWidth * 0.75), (wh.canvasHeight / 2) - 300],
			[(wh.canvasWidth * 0.25),(wh.canvasHeight / 2) + 300],
			[(wh.canvasWidth * 0.75), (wh.canvasHeight / 2) + 300]


			];
		},
		resize: function (wh) {
			let arr = this.positionArray(wh);
			for(let i = 0; i < arr.length; i ++){
				let p = this.platforms[i];
				p.x = arr[i][0];
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
			//let cont = new PIXI.Container();
			let b = new PIXI.Sprite(this.spritesheet.textures['platform.png']);
			b.halfWidth = b.width / 2;
		    b.anchor.set(0.5);
		    //cont.addChild(b);
            return b;
		}
	}
}