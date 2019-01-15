import * as PIXI from 'pixi.js';
import Utils from './utils/utils';
export default {
	line: new PIXI.Texture.fromImage('/bmps/line.png'),
	radialQ: undefined,
	explosionQ: undefined,
	showerQ: undefined,
	radials: [],
	explosions: [],
	showers: [],
	radialCont: new PIXI.Container(),
	explosionCont: new PIXI.Container(),
	init: function (app, wh) {
		this.canvasHeight = wh.canvasHeight;
		this.canvasWidth = wh.canvasWidth;
		this.utils = Utils();

		this.radialQ = this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 100 : 10;

		this.explosionQ = this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 100 : 10;

		this.showerQ = this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 100 : 10;

		for(let i = 0; i < this.radialQ; i ++){
			let r = new PIXI.Sprite(this.line);
			r.width = 1;
			r.height = 100;//this.utils.randomNumberBetween(20, 200);
			r.alpha = this.utils.randomNumberBetween(0.2, 0.8);
			r.anchor.x = 0;
			r.anchor.y = 0;
			r.storeHeight = r.height;
			r.variance = this.utils.randomNumberBetween(20, 50);
			r.rotation = this.utils.deg2rad(i*(360 / this.radialQ));
			r.speed = this.utils.randomNumberBetween(.0003, .003);
			r.tint = 0xFFFF00;
			this.radials.push(r);
			this.radialCont.addChild(r);

			let s = new PIXI.Sprite(this.line);
			s.width = 10;
			s.height = 10;
			s.tint = this.utils.randomColor();
			this.showers.push(r);

			let e = new PIXI.Sprite(this.line);
			e.width = 20;
			e.height = 10;
			e.tint = this.utils.randomColor();
			this.explosions.push(r);
		}


	},
	addAnimations: function (cont) {
		this.radialCont.x = this.canvasWidth / 2;
		this.radialCont.y = this.canvasHeight / 2;
		cont.addChild(this.radialCont);
	},
	swimTransition: function () {

		//radial line

		//explosion of wave icons

		//shower down of water

	},
	bounceTransition: function () {

		//exposion of balls

		//shower down and bounce of springs

	},
	jumpTransition: function () {

		//explosion of something

		//shower down of something else
	},
	flyTransition: function () {



	},
	animate: function () {
		this.radialCont.rotation += this.utils.deg2rad(0.5);
		for(let i = 0; i < this.radialQ; i ++){
			let r = this.radials[i];
			r.height = this.utils.cosWave(r.storeHeight, r.variance, r.speed);
		}
	}
}