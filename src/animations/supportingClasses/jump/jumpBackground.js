import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
import TileColumn from './tileColumn';
export default function () {
	return {
		cont: new PIXI.Container(),
		background: new PIXI.Graphics(),
		colSpacing: 200,
		colQ: undefined,
		cols: {},
		columns: [],
		utils: Utils,
		activeBrick: undefined,
		brickHeight: 50,
		init: function (parentCont, wh, spritesheet) {
			this.parentCont = parentCont;
			this.wh = wh;
			this.spritesheet = spritesheet;
			this.colQ = 0;//this.wh.canvasWidth / this.colSpacing;


			this.background.beginFill(0xFFFFFF).drawRect(0,0,wh.canvasWidth, wh.canvasHeight).endFill();
			this.cont.addChild(this.background);

			for(let i = 0; i < this.colQ; i ++){
				this.tileColumn = TileColumn();
				this.tileColumn.cont.x = i * this.colSpacing;
				this.tileColumn.init(this.cont, wh, spritesheet);
				this.tileColumn.addToStage();
				this.columns.push(this.tileColumn);
			}
			
		},
		addToStage: function () {
			this.parentCont.addChildAt(this.cont, 0);
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont);

		},
		resize: function () {

		},
		animate: function () {
			for(let i = 0; i < this.colQ; i ++){
				this.columns[i].animate();
			}
		
			
		}
	}
}