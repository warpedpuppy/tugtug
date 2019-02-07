import * as PIXI from 'pixi.js';
import Utils from './utils';
import Config from '../animationsConfig';
export default {
		utils: Utils,
		init: function (cont, wh) {

		},
		Container: function () {
			return new PIXI.Container();
		},
		Loader: function () {
			return PIXI.loader;
		},
		Application: function () {
			return new PIXI.Application(this.utils.returnCanvasWidth(), this.utils.returnCanvasHeight(), {transparent: true});
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
		Sprite: function (str) {
			if(!str){
				return new PIXI.Sprite();
			} else {
				if (this.utils.spritesheet.textures[str]) {
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
