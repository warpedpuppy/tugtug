import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
// import Config from './animationsConfig';
export default function () {
	return {
		utils: Utils,
		init: function (i,j, counter, spacer, colors, startScale) {

			let cont = Assets.Container();
			let s = Assets.Sprite('circleAlpha1.png');
			s.anchor.set(0.5);
			let p = Assets.Sprite('pinWheel.png');
			p.anchor.set(0.5);
			cont.addChild(s);
			cont.addChild(p);
			cont.p = p;
			cont.pRotate = this.utils.randomNumberBetween(-0.5, 0.5);
			let color1, color2;
			color1 = colors[Math.floor(Math.random()*colors.length)];
			color2 = colors[Math.floor(Math.random()*colors.length)];
			while(color2 === color1){
				color2 = colors[Math.floor(Math.random()*colors.length)];
			}
			s.tint = cont.color = color1;
			cont.s = s;
			//p.tint = color2;
			cont.rotate = this.utils.randomNumberBetween(-2, 2);
			//let scale = this.utils.randomNumberBetween(0.25, 0.8);
			cont.scale.set(startScale);

			cont.radius = cont.r = cont.width / 2;
			cont.x = j * spacer;//this.utils.randomNumberBetween(300, 400);
			cont.y = cont.startY = i * spacer;//this.utils.randomNumberBetween(300, 400);
			cont.index = counter;




			return cont;
		},
		
		addToStage: function () {

		},
		removeFromStage: function () {

		},
		resize: function () {

		},
		animate: function () {

		}
	}
}