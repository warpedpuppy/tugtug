import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
export default function () {
	return {
		cont: new PIXI.Container(),
		dragon: [],
		utils: Utils,
		segmentsQ: 20,
		init: function (parentCont, wh, spritesheet) {
			this.parentCont = parentCont;
			if(!this.dragon.length){
				 for (let i = 0; i < this.segmentsQ; i++) {
	                let segment = this.bodySegment(25, 0xFFFF00, i * 25);
	                this.dragon.push(segment);
	                this.cont.addChild(segment);
	            }
			} else {
				 for (let i = 0; i < this.segmentsQ; i++) {
	                this.cont.addChild(this.dragon[i]);
	            }
			}

			if(!this.leftWing){
				 this.leftWing = new PIXI.Sprite(spritesheet.textures['leftWing.png']);
				 this.rightWing = new PIXI.Sprite(spritesheet.textures['rightWing.png']);
				 this.leftWing.pivot.x = 206;
				 this.leftWing.pivot.y = 54;
				 this.rightWing.pivot.y = 70;
				 this.wingCont = new PIXI.Container();
				 this.wingCont.y = 20;
				 this.wingCont.addChild(this.leftWing);
				 this.wingCont.addChild(this.rightWing);
			}
			this.cont.radius = 0;
			this.cont.addChildAt(this.wingCont, 0);
			this.segments = this.dragon;
		},
		bodySegment: function (radius, color, yVal, str) {
			let cont = new PIXI.Container();
            cont.radius = radius;
            cont.height = cont.radius * 4;
            cont.vx = 0;
            cont.vy = 0;
            cont.xpos = 0;
            cont.ypos = 0;
            //let b = new PIXI.Sprite.fromImage(str);
            let b = new PIXI.Graphics();

            b.y = yVal;
            let triangleWidth = 25,
		        triangleHeight = triangleWidth,
		        triangleHalfway = triangleWidth/2;

		    //draw triangle 
		    b.beginFill(0xFF0000, 1);
		    b.lineStyle(0, 0xFF0000, 1);
		    b.moveTo(triangleWidth, 0);
		    b.lineTo(triangleHalfway, triangleHeight); 
		    b.lineTo(0, 0);
		    b.lineTo(triangleHalfway, 0);
		    b.endFill();
		    b.pivot.x = b.pivot.y = 12.5;
		    b.rotation = this.utils.deg2rad(180);
            cont.addChild(b);
            cont.body = b;
            return cont;
		},
		addToStage: function () {
			this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont);
		},
		resize: function () {

		},
		animate: function () {

		}
	}
}