import * as PIXI from 'pixi.js';
export default {
		cont: new PIXI.Container(),
		platforms: [],
		arr: [],
		init: function (cont, wh) {
			let arr = this.arr = this.positionArray(wh);
			this.cont = cont;
			for(let i = 0; i < arr.length; i ++){
				let p = this.createPlatform();
				p.x = arr[i][0] - (p.width / 2);
				p.y = arr[i][1];
				this.platforms.push(p);
			}
		},
		addPlatforms: function (boolean) {
			for(let i = 0; i < this.platforms.length; i ++){
				if(boolean){
					this.cont.addChild(this.platforms[i]);
				} else {
					this.cont.removeChild(this.platforms[i]);
				}
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