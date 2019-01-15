import * as PIXI from 'pixi.js';
import Utils from './utils/utils';
export default {
	line: new PIXI.Texture.fromImage('/bmps/bouncePlatformLine.png'),
	radialQ: undefined,
	explosionQ: undefined,
	showerQ: undefined,
	radials: [],
	explosions: [],
	showers: [],
	init: function () {
		this.radialQ = this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 100 : 10;

		this.explosionQ = this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 100 : 10;

		this.showerQ = this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 100 : 10;

		for(let i = 0; i < radialQ; i ++){
			let r = new PIXI.Sprite(this.line);
			r.width = 20;
			r.height = 10;
			r.tint = 0xFFFF00;
			this.radials.push(r);

			let s = new PIXI.Sprite(this.line);
			s.width = 20;
			s.height = 10;
			s.tint = 0xFF9900;
			this.showers.push(r);

			let e = new PIXI.Sprite(this.line);
			e.width = 20;
			e.height = 10;
			e.tint = 0xFFFF00;
			this.explosions.push(r);
		}


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

	}
}