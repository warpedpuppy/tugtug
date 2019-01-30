import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
import TileColumn from './tileColumn';
export default function () {
	return {
		cont: new PIXI.Container(),
		background: new PIXI.Graphics(),
		ground: new PIXI.Graphics(),
		colSpacing: 200,
		colQ: undefined,
		cols: {},
		columns: [],
		utils: Utils,
		activeBrick: undefined,
		brickHeight: 50,
		groundHeight: 150,
		init: function (app, parentCont, wh, spritesheet, action) {
			this.parentCont = parentCont;
			this.wh = wh;
			this.spritesheet = spritesheet;
			this.colQ = 3;//this.wh.canvasWidth / this.colSpacing;


			this.background.beginFill(0x00CCFF).drawRect(0,0,wh.canvasWidth, wh.canvasHeight).endFill();
			this.cont.addChild(this.background);



			this.startXs = [0.25, 0.5, 0.75];
			for(let i = 0; i < this.colQ; i ++){
				this.tileColumn = TileColumn();
				

				this.tileColumn.init(app, this.cont, wh, spritesheet, this.wh.canvasWidth * this.startXs[i], action);
				//this.tileColumn.cont.x = 200 + (i * this.colSpacing);
				this.tileColumn.addToStage();
				this.columns.push(this.tileColumn);
			}

			
			this.ground.beginFill(0x33FF00).drawRect(0,0,wh.canvasWidth, this.groundHeight).endFill();
			this.ground.y = wh.canvasHeight - this.groundHeight;
			this.cont.addChild(this.ground);
			
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