import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Tweens from '../../utils/tweens';
// import Config from '../../animationsConfig';
export default function () {
	return {
		cont: Assets.Container(),
		utils: Utils,
		slots: [],
		slotQ: 4, 
		tokenCounter: 0,
		totalTokens: 4,
		textCont: Assets.Container(),
		init: function () {
			this.parent = this.utils.root;
			this.parentCont = this.utils.app.stage;//parentCont;
			let s;
			for(let i = 0; i < this.slotQ; i ++){
				let c = Assets.Container();
				s = Assets.Sprite('slot.png');
				s.anchor.set(0.5);
				s.alpha = 0.25;
				c.x = 25 + (50 * i);
				c.addChild(s);
				this.slots.push(c);
				this.cont.addChild(c);
			}
			
			this.token = Assets.Sprite("token.png");
			this.token.anchor.set(0.5);
			this.token.y = -100;
			
			this.earned = Assets.Sprite("earned.png");

			this.earned.anchor.set(0.5);
			//this.earned.y = this.earned.height / 2
			this.textCont.addChild(this.earned);
			this.textCont.addChild(this.token);

			// let testGraphics = Assets.Graphics();
			// testGraphics.alpha = 0.5;
			// testGraphics.beginFill(0xFFFF00).drawRect(0,0,190,40).endFill();
			// this.cont.addChild(testGraphics)

			this.cont.pivot = Assets.Point(this.cont.width / 2, this.cont.height / 2)

			return this;
			
		},
		clearText: function () {
			this.utils.app.stage.removeChild(this.textCont);
		},
		fillSlot: function (token) {

			token.placed = true;
			this.utils.app.stage.addChild(this.textCont);
			this.textCont.x = this.utils.canvasWidth / 2;
			this.textCont.y = this.utils.canvasHeight / 2;
			Tweens.tween(this.textCont, 2, {alpha: [1,0], onComplete: this.removeText.bind(this)})

			this.tokenCounter ++;
			token.x = token.y = 0;
			let index = token.num - 1;
			token.name = "token";
			this.slots[index].addChild(token);

			if (this.tokenCounter === 4) {
				this.parent.levelCompleteHandler();
			}
		},
		removeText: function () {
			this.utils.app.stage.removeChild(this.textCont);
		},
		reset: function () {
			this.tokenCounter = 0;
			// console.log('reset tokens')
			// for (let i = 0; i < 4; i ++) {
			// 	let t =  this.utils.root.grid.gridBuild.tokens[1];
			// 	t.placed = false;
			// 	console.log(i, t.placed)
			// }
			// console.log('end reset tokens')
		},
		addToStage: function () {
			this.cont.x = (this.utils.canvasWidth + 50) / 2;
			this.cont.y = this.utils.canvasHeight - 100;
			this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
			
		},
		resize: function () {
			this.textCont.x = this.utils.canvasWidth / 2;
			this.textCont.y = this.utils.canvasHeight / 2;
			this.cont.x = (this.utils.canvasWidth + 50) / 2;
			this.cont.y = this.utils.canvasHeight - 100;
		},
		animate: function () {

		}
	}
}