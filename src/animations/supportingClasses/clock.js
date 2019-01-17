import * as PIXI from 'pixi.js';
export default {
		hourToRadians: (1/12) * (2 * Math.PI),
		minutesToRadians: (1/60) * (2 * Math.PI),
		secondsToRadians: (1/60) * (2 * Math.PI),
		cont: new PIXI.Container(),
		counter: 0,
		demo: false,
		init: function (cont, wh) {

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

			this.demoH = 12;
			this.demoM = 0;
			this.demoS = 0;

			this.cont.alpha = 0.25;
         	this.cont.scale.set(0.5);
         	this.cont.x = wh.canvasWidth / 2;
         	this.cont.y = wh.canvasHeight / 2;

         	cont.addChild(this.cont);
		},
		resize: function (wh) {
			this.cont.x = wh.canvasWidth / 2;
         	this.cont.y = wh.canvasHeight / 2;
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
				this.counter ++;
				
				//console.log(this.counter)
				if(this.counter){
					this.secondhand.alpha = 0;
					let increment = 30;
					this.demoS += increment;
					console.log(this.demoH+":"+this.demoM+":"+this.demoS)
					this.hourhand.rotation =  this.demoH * this.hourToRadians;
					this.minutehand.rotation = this.demoM * this.minutesToRadians;
					this.secondhand.rotation = this.demoS * this.secondsToRadians;
					this.counter = 0;
					if(this.demoS === 60){
						this.demoS = 0;
						this.demoM ++;
						if(this.demoM === 60){
							this.demoM = 0;
							if(this.demoH === 12){
								this.demoH = 1;
								//toggle day and night
							} else {
								this.demoH ++;
							}
							
						}
					}


					
					//if(this.demoS === 60)this.demoH = 0;
				}
			}
			
			
		}
	
}