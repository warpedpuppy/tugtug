import * as PIXI from 'pixi.js';
import Utils from './utils';
import Config from '../animationsConfig';
export default {
		utils: Utils,
		opQ: 0,
		op: [],
		rings: [],
		lines: [],
		coins: [],
		opCounter: 0,
		init: function () {

			this.ringQ = (this.utils.app.renderer instanceof PIXI.WebGLRenderer)?Config.bounceTotalPoints:100;
			for (let i = 0; i < this.ringQ; i ++) {
				this.lines.push(this.Graphics());
				this.rings.push(this.Sprite('transparentRing.png'));
			}

			this.coinQ = (this.utils.app.renderer instanceof PIXI.WebGLRenderer)?Config.flyCoinsPerTreasureChest:10;
			for (let i = 0; i < this.coinQ; i ++) {
				let num = Math.ceil(Math.random()*11);
				//console.log(num)
				this.coins.push(this.Sprite(`jewel${num}.png`));
			}


			this.opQ = (this.utils.app.renderer instanceof PIXI.WebGLRenderer)?300:50;
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
			for (let i = 0; i < 4; i ++) {
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
					//if(test)console.log('from spritesheet', str)
					return new PIXI.Sprite(this.utils.spritesheet.textures[str])
				} else {
					//if(test)console.log('from directory', str, this.utils.spritesheet)
					return new PIXI.Sprite.fromImage(`/bmps/${str}`);
				}
			}
			
			
		},
		Graphics: function () {
			return new PIXI.Graphics();
		},
		createPool: function (cont, str, colors, scaleArray) {
			let flameArray = this.returnObjectPool(str);
            let flameQ = flameArray.length;
            let colorCounter = 0;
			let item;
			for (let i = 0; i < flameQ; i ++) {
				item = flameArray[i];
				let scale = this.utils.randomNumberBetween(scaleArray[0], scaleArray[0]);
				item.scale.set(scale);
				item.anchor.set(0.5);
				item.angle = this.utils.deg2rad(this.utils.randomNumberBetween(-110, -70));
				item.fade = this.utils.randomNumberBetween(0.001, 0.01);
				item.maxDistance = this.utils.randomNumberBetween(100, 1000);
				let hypotenuse = this.utils.randomNumberBetween(10, 100);
				item.vx = Math.cos(item.angle) * hypotenuse;
	        	item.vy = Math.sin(item.angle) * hypotenuse;
				
				item.tint = colors[colorCounter];
				colorCounter ++;
				if (colorCounter > colors.length - 1) {
					colorCounter = 0;
				}
				cont.addChild(item);
			}
			return {flameArray, flameQ}
			
		}

	}
