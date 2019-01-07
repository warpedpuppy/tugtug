import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
export default function Clock() {
	return {
		hourToRadians: (1/12) * (2 * Math.PI),
		minutesToRadians: (1/60) * (2 * Math.PI),
		secondsToRadians: (1/60) * (2 * Math.PI),
		cont: new PIXI.Container(),
		counter: 0,
		demo: false,
		init: function () {

			let hourhand = this.hourhand = new PIXI.Sprite.fromImage('/bmps/hourhand.png');
			hourhand.anchor.set(0.5);
			hourhand.tint = 0xFF0000;
			this.cont.addChild(hourhand);

			let minutehand = this.minutehand = new PIXI.Sprite.fromImage('/bmps/minutehand.png');
			minutehand.anchor.set(0.5);
			minutehand.tint = 0x000000;
			this.cont.addChild(minutehand);

			let secondhand = this.secondhand = new PIXI.Sprite.fromImage('/bmps/secondhand.png');
			secondhand.anchor.set(0.5);
			secondhand.tint = 0xFF00FF;
			this.cont.addChild(secondhand);

			let d = this.d = new Date();
			let h = d.getHours();
			let m = d.getMinutes();
			let s = d.getSeconds();

			hourhand.rotation =  h * this.hourToRadians;

			minutehand.rotation = m * this.minutesToRadians;

			secondhand.rotation = s * this.secondsToRadians;

		},
		animate: function () {
			if(!this.demo) {
				this.counter ++;
				if(this.counter === 60){
					let d = new Date();
					let h = d.getHours();
					let m = d.getMinutes();
					let s = d.getSeconds();
					this.hourhand.rotation =  h * this.hourToRadians;
					this.minutehand.rotation = m * this.minutesToRadians;
					this.secondhand.rotation = s * this.secondsToRadians;
					this.counter = 0;
				}
			} else {
				//this.counter ++;
				//if(this.counter === 10){
					
					this.hourhand.rotation += this.hourToRadians;
					this.minutehand.rotation += this.minutesToRadians;
					this.secondhand.rotation += this.secondsToRadians;
					this.counter = 0;
				//}
			}
			
			
		}
	}
}