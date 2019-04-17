import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
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
				c.x = 50 * i;
				c.addChild(s);
				this.slots.push(c);
				this.cont.addChild(c);
			}

			this.token = Assets.Sprite("token.png");
			this.token.anchor.set(0.5);
			this.token.y = -100;
			console.log(this.token.height)
			this.earned = Assets.Sprite("earned.png");

			this.earned.anchor.set(0.5);
			//this.earned.y = this.earned.height / 2
			this.textCont.addChild(this.earned);
			this.textCont.addChild(this.token);

			return this;
			
		},
		clearText: function () {
			this.utils.app.stage.removeChild(this.textCont);
		},
		fillSlot: function (token) {
			this.utils.app.stage.addChild(this.textCont);
			this.textCont.x = this.utils.canvasWidth / 2;
			this.textCont.y = this.utils.canvasHeight / 2;
			

			this.tokenCounter ++;
			token.x = token.y = 0;
			let index = token.num - 1;
			token.name = "token";
			this.slots[index].addChild(token);

			if (this.tokenCounter === 4) {
				this.parent.grid.gridComplete.boardComplete();
			}
		},
		reset: function () {
			this.tokenCounter = 0;
		},
		addToStage: function () {
			this.cont.x = (this.utils.canvasWidth - this.cont.width) / 2;
			this.cont.y = this.utils.canvasHeight - this.cont.height - 100;
			this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
			
		},
		resize: function () {
			this.textCont.x = this.utils.canvasWidth / 2;
			this.textCont.y = this.utils.canvasHeight / 2;
			this.cont.x = (this.utils.canvasWidth - this.cont.width) / 2;
			this.cont.y = this.utils.canvasHeight - this.cont.height - 100;
		},
		animate: function () {

		}
	}
}