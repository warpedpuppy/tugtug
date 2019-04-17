import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
// import Config from './animationsConfig';
export default function () {
	return {
		colors: [0xFF00FF, 0xFF0000, 0xFFFF00, 0xFF9900, 0x33FF00],
		utils: Utils,
		init: function (i,j, counter) {

			let cont = Assets.Container();
			let s = Assets.Sprite('circleAlpha1.png');
			s.anchor.set(0.5);
			let p = Assets.Sprite('pinWheel.png');
			p.anchor.set(0.5);
			cont.addChild(s);
			cont.addChild(p);
			cont.p = p;
			let color1, color2;
			color1 = this.colors[Math.floor(Math.random()*this.colors.length)];
			color2 = this.colors[Math.floor(Math.random()*this.colors.length)];
			while(color2 === color1){
				color2 = this.colors[Math.floor(Math.random()*this.colors.length)];
			}
			s.tint = color1;
			p.tint = color2;
			cont.rotate = this.utils.randomNumberBetween(-2, 2);
			let scale = this.utils.randomNumberBetween(0.25, 0.8);
			cont.scale.set(scale);

			cont.radius = cont.r = cont.width / 2;
			cont.x = j * 350;//this.utils.randomNumberBetween(300, 400);
			cont.y = i * 350;//this.utils.randomNumberBetween(300, 400);
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