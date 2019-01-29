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
		init: function (app, parentCont, wh, spritesheet) {
			this.parentCont = parentCont;
			this.wh = wh;
			this.spritesheet = spritesheet;
			this.colQ = 3;//0;//this.wh.canvasWidth / this.colSpacing;


			this.background.beginFill(0x999999).drawRect(0,0,wh.canvasWidth, wh.canvasHeight).endFill();
			this.cont.addChild(this.background);
			this.startXs = [0.25, 0.5, 0.75];
			for(let i = 0; i < this.colQ; i ++){
				this.tileColumn = TileColumn();
				

				this.tileColumn.init(app, this.cont, wh, spritesheet, this.wh.canvasWidth * this.startXs[i]);
				//this.tileColumn.cont.x = 200 + (i * this.colSpacing);
				this.tileColumn.addToStage();
				this.columns.push(this.tileColumn);
			}
			
		},
		addToStage: function () {
			// this.parentCont.addChild(this.cont);
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