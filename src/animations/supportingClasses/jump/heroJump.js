import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		cont: new PIXI.Container(),
		w: 50,
		h: 10,
		blocks: [],
		utils: Utils,
		init: function (parentCont, wh, spritesheet) {
			this.parentCont = parentCont;
			for(let i = 0; i < 5; i ++){
				let g = new PIXI.Graphics();
				g.beginFill(0x666600).drawRect(-this.w / 2,-this.h / 2,this.w, this.h).endFill();
				g.pivot.set(0.5);
				g.differential = i * 10;
				g.y = g.yPos = (this.h + 10) * i * -1;
				this.blocks.push(g);
				this.cont.addChild(g);

			}
			
			
		},
		addToStage: function () {
			this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont);
		},
		resize: function () {

		},
		animate: function () {
			for(let i = 0; i < 5; i ++){
				let b = this.blocks[i];
				b.y = this.utils.cosWave(b.yPos, b.differential, 0.01);
			}
		}
	}
}