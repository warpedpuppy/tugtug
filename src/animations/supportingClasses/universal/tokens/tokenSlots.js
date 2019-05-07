import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Tweens from '../../../utils/tweens';
export default {
		utils: Utils,
		slots: [],
		slotQ: 4, 
		tokenCounter: 0,
		totalTokens: 4,
		textCont: Assets.Container(),
		build: function () {
			let cont = Assets.Container();
			this.parent = this.utils.root;
			this.parentCont = this.utils.app.stage;
			let s;
			for (let i = 0; i < this.slotQ; i ++) {
				let c = Assets.Container();
				s = Assets.Sprite('slot.png');
				s.anchor.set(0.5);
				s.alpha = 0.25;
				c.x = 25 + (50 * i);
				c.addChild(s);
				this.slots.push(c);
				cont.addChild(c);
			}
			cont.pivot = Assets.Point(cont.width / 2, cont.height / 2);
			this.cont = cont;
			return cont;
		},
		fillSlot: function (token) {
			token.scale.set(0);
			token.placed = true;
			this.utils.app.stage.addChild(this.textCont);
			this.textCont.x = this.utils.canvasWidth / 2;
			this.textCont.y = this.utils.canvasHeight / 2;
			Tweens.tween(token.scale, 1, {x: [0,1], y: [0,1]}, undefined, 'easeOutBounce')
			this.tokenCounter ++;
			token.x = token.y = 0;
			let index = token.num - 1;
			token.name = "token";
			this.slots[index].addChild(token);

			if (this.tokenCounter === this.totalTokens) {
				this.parent.levelCompleteHandler();
			}
		},
		addToStage: function () {
			this.cont.x = (this.utils.canvasWidth + 50) / 2;
			this.cont.y = this.utils.canvasHeight - 100;
			this.parentCont.addChild(this.cont);
		}
}