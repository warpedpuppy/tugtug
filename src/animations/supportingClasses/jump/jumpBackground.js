import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		background: new PIXI.Graphics(),
		colSpacing: 100,
		colQ: undefined,
		init: function (cont, wh, spritesheet) {
			this.cont = cont;
			this.wh = wh;
			this.spritesheet = spritesheet;
			this.colQ = this.wh.canvasWidth / this.colSpacing;


			for (let i = 0; i < this.colQ; i ++) {
				let s = new PIXI.Sprite(this.spritesheet.textures['goldTile.png'])
				s.y = 100;
				s.x = i * this.colSpacing;
				this.background.addChild(s);
			}
			this.background.beginFill(0xFFFFFF).drawRect(0,0,wh.canvasWidth, wh.canvasHeight).endFill();
		},
		addToStage: function () {
			this.cont.addChildAt(this.background, 0);
		},
		removeFromStage: function () {
			this.cont.addChildAt(this.background, 0);

		},
		resize: function () {

		},
		animate: function () {

		}
	}
}