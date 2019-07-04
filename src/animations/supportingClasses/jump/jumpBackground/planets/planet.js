import Assets from '../../../../utils/assetCreation';
import Utils from '../../../../utils/utils';
import Config from '../../../../animationsConfig';
import Dots from './dots';
import Gremlin from './gremlins';

export default function () {
	return {
		utils: Utils,
		dots: Dots(),
		gremlin: Gremlin(),
		buildPlanet: function (counter, scale) {

			let cont = Assets.Container();

			

			let background = Assets.Sprite('circleAlpha1.png');
			background.anchor.set(0.5);
			background.tint = cont.color = Config.colors[Math.floor(Math.random()*Config.colors.length)];
			cont.background = background;
			cont.addChild(background);

			let foreground = Assets.Sprite('pinWheel.png');
			foreground.anchor.set(0.5);
			cont.addChild(foreground);
			cont.foreground = foreground;

			background.scale.set(scale);
			foreground.scale.set(scale)
			
			cont.rotate = this.utils.randomNumberBetween(-2, 2);
			cont.radius = cont.r = cont.width / 2;
			cont.index = counter;

			let dotsCont = this.dots.build(background.width);
			cont.addChild(dotsCont);
			cont.dots = dotsCont.dots;
			cont.dotsCont = dotsCont;

			let gremlin = this.gremlin.buildGremlin(background.width);
			//cont.gremlin = gremlinCont;
			// gremlinCont.speed = this.utils.deg2rad(this.utils.randomNumberBetween(-2, 2));
			// gremlin.y = -background.width / 2;
			// gremlinCont.gremlin = gremlin;
			//gremlin.rotation = this.utils.deg2rad(-90);
			gremlin.hit = false;
			cont.addChild(gremlin);
			cont.gremlin = gremlin;
			// this.gremlinContsArray.push(gremlinCont)

			//cont.width = background.width;
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