import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		cont: new PIXI.Container(),
		colSpacing: 200,
		colQ: undefined,
		cols: {},
		bricks: [],
		utils: Utils,
		activeBrick: undefined,
		brickHeight: 50,
		init: function (parentCont, wh, spritesheet) {
			this.parentCont = parentCont;
			this.wh = wh;
			this.spritesheet = spritesheet;
			this.colQ = this.wh.canvasWidth / this.colSpacing;

			let s = this.brick();
			s.y = this.wh.canvasHeight - this.brickHeight;
		
			this.bricks.push(s);
			this.cont.addChild(s);
			this.newBrick();

		},
		brick: function () {
			let s = new PIXI.Sprite(this.spritesheet.textures['goldTile.png']);
			s.anchor.set(0.5);
			return s;
		},
		newBrick: function () {
			let s = this.brick();
			let previousYVal = this.bricks[this.bricks.length -1].y;
			this.bricks.push(s);
			s.y =  -50;
			s.dest = previousYVal - this.brickHeight;;
			this.activeBrick = s;
			this.cont.addChild(s);
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
			if(this.activeBrick && this.activeBrick.y < this.activeBrick.dest){
				this.activeBrick.y += 5;
			} else {
				this.activeBrick.y = this.activeBrick.dest;
				this.newBrick();
			}
			
		}
	}
}