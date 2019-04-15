import * as PIXI from 'pixi.js';
import Utils from './utils';
export default {
		utils: Utils,
		opQ: 0,
		op: [],
		rings: [],
		init: function () {

			this.ringQ = (this.utils.app.renderer instanceof PIXI.WebGLRenderer)?1000:100;
			for (let i = 0; i < this.ringQ; i ++) {
				this.rings.push(this.Sprite('treasureRing.png'));
			}


			this.opQ = (this.utils.app.renderer instanceof PIXI.WebGLRenderer)?1000:100;
			for (let i = 0; i < this.opQ; i ++) {
				this.op.push(this.Sprite());
			}
		},
		Point: function (x, y){
			return new PIXI.Point(x, y)
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
		quadrupleSpriteSize: function (texture) {
			//texture should be 1000x500
			let arr = [
				[0,0,1,1],
				[2000, 0, -1,1],
				[0,1000,1,-1],
				[2000,1000,-1,-1]
			],s, cont = this.Container();
			for(let i = 0; i < 4; i ++){
				s = this.Sprite(texture);
				s.x = arr[i][0];
				s.y = arr[i][1];
				s.scale.x = arr[i][2];
				s.scale.y = arr[i][3];
				cont.addChild(s);
			}
			return cont;

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
			return new PIXI.extras.BitmapText(str, {font: "21px Hiragino Sans"});
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
		returnFirstHalfObjectPool: function(str){
			let stopVal = this.opQ / 2,
			    returnArr = [];
			for (let i = 0; i < stopVal; i ++) {
				this.op[i].texture = this.utils.spritesheet.textures[str];
				returnArr.push(this.op[i]);
			}
			return returnArr;
		},
		returnSecondHalfObjectPool: function(str){
			let startVal = this.opQ / 2,
			    returnArr = [];
			for (let i = startVal; i < this.opQ; i ++) {
				this.op[i].texture = this.utils.spritesheet.textures[str];
				returnArr.push(this.op[i]);
			}
			return returnArr;
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
