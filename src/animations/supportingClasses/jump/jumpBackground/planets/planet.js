import Assets from '../../../../utils/assetCreation';
import Utils from '../../../../utils/utils';
import Config from '../../../../animationsConfig';
import Dots from './dots';
import Gremlin from './gremlins';
import Tweens from '../../../../utils/Tweens';
export default function () {
	return {
		utils: Utils,
		dots: Dots(),
		gremlin: Gremlin(),
		cont: Assets.Container(),
		dotEatBoolean: true,
		spaceShip: false, 
		buildPlanet: function (counter, scale) {
			this.scaleIt = this.scaleIt.bind(this)

			let background = Assets.Sprite('circleAlpha1.png');
			background.anchor.set(0.5);
			background.tint = this.cont.color = Config.colors[Math.floor(Math.random()*Config.colors.length)];
			this.cont.background = background;
			this.cont.addChild(background);

			let foreground = Assets.Sprite('pinWheel.png');
			foreground.anchor.set(0.5);
			this.cont.addChild(foreground);
			this.cont.foreground = foreground;

			background.scale.set(scale);
			foreground.scale.set(scale);
			this.scale = scale;
			this.background = background;
			this.foreground = foreground;
			
			this.cont.rotate = this.utils.randomNumberBetween(-2, 2);
			this.cont.radius = this.cont.r = this.cont.width / 2;
			this.cont.index = counter;

			let dotsCont = this.dots.build(background.width);
			this.cont.addChild(dotsCont);
			this.cont.dots = dotsCont.dots;
			this.cont.dotsCont = dotsCont;

			let gremlin = this.gremlin.buildGremlin(background.width);
			gremlin.rotation = this.utils.deg2rad(-90);
			gremlin.bodyCont.y = -50;
			gremlin.hit = false;
			this.cont.addChild(gremlin);
			this.cont.gremlin = gremlin;
			this.cont.scaleIt = this.scaleIt;
			this.cont.bigScale = this.scale * 2;
			this.cont.smallScale = this.scale;
			this.cont.classRef = this;
			this.cont.spaceShip = this.spaceShip;

			if (this.utils.isMobileOnly) {
				this.cont.scale.set(Config.mobileOnlyScaling)
			}

			return this.cont;
		},
		dotsAndGremlinCollision: function (heroObject) {
			this.cont.dots.forEach(dot => {
				let globalPoint = dot.toGlobal(this.utils.app.stage);
				let temp = {x:globalPoint.x,y:globalPoint.y,radius: dot.radius};
				if(dot.visible && this.dotEatBoolean && this.utils.ccc(heroObject, temp)) {
					dot.visible = false;
				}
			})
			let g = this.cont.gremlin;
			g.rotation += 0.03;
			let gp = g.body.toGlobal(this.utils.app.stage);
			let temp2 = {x:gp.x, y: gp.y, radius: 15}
			if(!g.hit && this.utils.ccc(heroObject, temp2)) {
				this.gremlinHit();
				this.cont.gremlin.hit = true;
				this.dotEatBoolean = false;
			}
		},
		gremlinHit: function () {
			this.cont.dots.forEach((dot, i) => {
				dot.visible = true;
				Tweens.tween(dot, 1, {x: [0, dot.startX],y: [0, dot.startY]}, 
				this.completeGremlinHit.bind(this, [this.cont.gremlin, i]),
				'easeOutBounce');
			})
		},
		completeGremlinHit: function (arr) {
				arr[0].hit = false;
				this.dotEatBoolean = true;
		},
		animate: function (c, hero) {
			this.cont.foreground.rotation += 0.003;
			let gp = this.cont.toGlobal(this.utils.app.stage, undefined, true);
			let po ={x:gp.x, y: gp.y, radius: this.cont.radius}
			

			if(this.cont !== c.currentOrb && !c.transition && this.utils.ccc(hero,po)){
				c.transition = true;
				c.switchPlanets(this.cont);
			}
		},
		scaleIt: function (size) {
			if (size === 'big') {
				this.background.scale.set(this.cont.bigScale);
				this.foreground.scale.set(this.cont.bigScale);
			} else {
				this.background.scale.set(this.cont.smallScale);
				this.foreground.scale.set(this.cont.smallScale);
			}
			
		}
	}
	
}