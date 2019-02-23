import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
//import Config from './animationsConfig';
export default {
		cont: Assets.Container(),
		blockWidth: 500,
		blockHeight: 500,
		blocks: {},
		utils: Utils,
		colQ: 10,
		rowQ: 10,
		buffer: 10,
		init: function (parentCont) {
			let hero = this.utils.hero;
			//console.log(hero.cont.x, hero.cont.y)

			//so the goal is the get from the x and y value the i and j value
			let iStart = Math.ceil(hero.cont.x / this.blockHeight);
			let jStart = Math.ceil(hero.cont.y / this.blockWidth);

			//console.log(iStart, jStart);

			this.parentCont = parentCont;
			for (let i = 0; i < this.colQ; i ++) {
				this.blocks[i] = [];
				for (let j = 0; j < this.rowQ; j ++) {
					let b = this.block();
					b.x = j * this.blockWidth;
					b.y = i * this.blockHeight;
					let text = Assets.BitmapText(`${i}, ${j}`)
					text.x = b.x;
					text.y = b.y;
					this.cont.addChild(text);
					this.cont.addChild(b);
					this.blocks[i][j] = b;
				}
			}
			//console.log(this.blocks)
			this.setLimits();
		},
		block: function () {
			let b = Assets.Graphics();
			b.lineStyle(3, 0x000000, 1).moveTo(0,0).lineTo(this.blockWidth, 0).lineTo(this.blockWidth, this.blockHeight).lineTo(0,this.blockHeight).lineTo(0,0);
			// b.beginFill(0xFFFFFF).drawRect(0,0,this.blockWidth,this.blockHeight).endFill();
			return b;
		},
		addToStage: function (index) {
			this.parentCont.addChildAt(this.cont, index)
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont)
		},
		setLimits: function () {
			this.hw = (this.utils.canvasWidth / 2);
			this.hh = (this.utils.canvasHeight / 2);
			this.rightBorder = (this.colQ * this.blockWidth) - this.hw;
			this.bottomBorder = (this.rowQ * this.blockHeight) - this.hh;
		},
		resize: function () {
			this.setLimits();
		},
		animate: function (vx, vy) {

			
			//boundaries
			//console.log(this.cont.x, hw);
			this.cont.x -= vx;
			if (this.cont.x > this.hw) {
			 	this.cont.x = this.hw - this.buffer;
			 	vx *= -1;
			} else if (this.cont.x < -this.rightBorder) {
				this.cont.x = -this.rightBorder + this.buffer;
			 	vx *= -1;
			}

			this.cont.y -= vy;
			if (this.cont.y > this.hh) {
			 	this.cont.y = this.hh - this.buffer;
			 	vy *= -1;
			} else if (this.cont.y < -this.bottomBorder) {
				this.cont.y = -this.bottomBorder + this.buffer;
			 	vy *= -1;
			}
			


		}
	
}