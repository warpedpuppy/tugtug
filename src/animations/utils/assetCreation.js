import * as PIXI from 'pixi.js';
import Utils from './utils';
export default {
		utils: Utils,
		opQ: 0,
		op: [],
		init: function () {
			this.opQ = (this.utils.app.renderer instanceof PIXI.WebGLRenderer)?1000:100;
			for (let i = 0; i < this.opQ; i ++) {
				this.op.push(this.Sprite());
			}
		},
		Container: function () {
			return new PIXI.Container();
		},
		Loader: function () {
			return PIXI.loader;
		},
		Application: function (w, h, transParentBoolean) {
			return new PIXI.Application(w, h, {transparent: transParentBoolean});
		},
		webgl: function () {
			return this.utils.app.renderer instanceof PIXI.WebGLRenderer;
		},
		ParticleContainer: function (q) {
			return new PIXI.particles.ParticleContainer(q, {
			    scale: true,
			    position: true,
			    rotation: true,
			    uvs: true,
			    alpha: true
			});
		},
		ColorFilter: function () {
			return new PIXI.filters.ColorMatrixFilter();
		},
		BitmapText: function (str) {
			return new PIXI.extras.BitmapText(str, {font: "38px Hobo Std"});
		},
		Rope: function(texture, points) {
			return new PIXI.mesh.Rope(texture, points);
		},
		Texture: function (str) {
			return PIXI.Texture.fromFrame(str)
		},
		AnimatedSprite: function (array) {
			return new PIXI.extras.AnimatedSprite(array);
		},
		returnObjectPool: function (str) {
			for (let i = 0; i < this.opQ; i ++) {
				this.op[i].texture = this.utils.spritesheet.textures[str];
			}
			return this.op;
		},
		Sprite: function (str) {

			if(!str){
				return new PIXI.Sprite();
			} else {
				if (this.utils.spritesheet && this.utils.spritesheet.textures[str]) {
					return new PIXI.Sprite(this.utils.spritesheet.textures[str])
				} else {
					return new PIXI.Sprite.fromImage(`/bmps/${str}`);
				}
			}
			
			
		},
		Graphics: function () {
			return new PIXI.Graphics();
		}

	}
