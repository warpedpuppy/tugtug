import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
export default function Hero (wh, items) {
	return {
		segmentsQ: 5,
		cont: new PIXI.Container(),
		pos: [],
		radius: 0,
		storeRadius: 0,
		init: function () {
			this.utils = Utils();
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
            this.cont.x = this.canvasWidth / 2;
            this.cont.y = this.canvasHeight / 2;
            this.segments = [];

            for (let i = 0; i < this.segmentsQ; i++) {
                let segment = this.bodySegment(25, 0xFFFF00, i*25);
                this.segments.push(segment);
                this.cont.addChild(segment);
            }
            
            if(items){
            	  for(let i = 0; i < items.length; i ++){
            	  	console.log(items[i])
	            	var item = PIXI.Sprite.fromImage(items[i].url);
	            	if(items[i].active) {
		            	this.cont.addChild(item);
		            }
	            }
            }
          
		},
		bodySegment: function (radius, color, yVal) {
			let cont = new PIXI.Container();
            cont.radius = radius;
            cont.height = cont.radius * 4;
            cont.vx = 0;
            cont.vy = 0;
            cont.xpos = 0;
            cont.ypos = 0;

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
		rotateChain: function () {

			if(!this.rotateBoolean)this.radius = this.utils.cosWave(this.storeRadius, 0.15, 0.01);

	        this.pos.push(this.radius);
	        this.increment = 5;
	        let maxLength = this.increment * 5;
	        if (this.pos.length > maxLength) {
	            this.pos = this.pos.slice(-maxLength);
	        }

	        this.segments[0].rotation = this.radius;
	        for (let i = 1; i < this.segmentsQ; i++) {
	            let index = this.pos.length - (i * this.increment);
	            if (this.pos.length >= index) {
	             this.segments[i].rotation = this.pos[index];
	            }
	        }
        },
		animate: function () {
			this.rotateChain();
		}
	}
}