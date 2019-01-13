import * as PIXI from 'pixi.js';
export default function Ripples (app) {
	return {
		ripples: [],
		growing: [],
		action: true,
		init: function () {
			var sprites = this.sprites = new PIXI.particles.ParticleContainer(10000, {
			    scale: true,
			    position: true,
			    rotation: true,
			    uvs: true,
			    alpha: true
			});
		
            this.totalSprites = app.renderer instanceof PIXI.WebGLRenderer ? 10 : 10;

            for (let i = 0; i < this.totalSprites; i++) {
                var dude = PIXI.Sprite.fromImage('/bmps/ring.png');
                dude.anchor.x = dude.anchor.y = 0.5;
                dude.startScale = 0.1
                dude.scale.set(dude.startScale);
                dude.counter = 0;
                this.ripples.push(dude);
                sprites.addChild(dude);
            }
            // create a bounding box box for the little maggots
            var dudeBoundsPadding = 100;
            this.dudeBounds = new PIXI.Rectangle(
                -dudeBoundsPadding,
                -dudeBoundsPadding,
                this.canvasWidth + dudeBoundsPadding * 2,
                this.canvasHeight + dudeBoundsPadding * 2
            );

            this.tick = 0;
            app.stage.interactive = true;
            this.mouseMove = this.mouseMove.bind(this);
            
            this.counter = 0;
            this.opc = 0;

            this.gradient = PIXI.Sprite.fromImage('/bmps/gradient.png');
            this.gradient.alpha = 0.5;
			this.gradient.anchor.set(0.5);

		    // app.stage.addChild(sprites);
		    // app.stage.on('pointermove', this.mouseMove);
		    // app.stage.addChild(this.gradient);
			
		},
		on: function(boolean) {
			if(boolean){
				//start ripples
				app.stage.addChild(this.sprites);
			    app.stage.on('pointermove', this.mouseMove);
			    app.stage.addChild(this.gradient);
			} else {
				// end ripples
				app.stage.removeChild(this.sprites);
		    	app.stage.on('pointermove', undefined);
		    	app.stage.removeChild(this.gradient);
			}
		},
		pause: function (boolean) {
			if(boolean){
				//PAUSE!
				this.action = !boolean;

				//remove 
			} else {
				this.action = !boolean;
			}
		},
		grow: function (ripple, index) {
		

			ripple.scale.x += 0.0075;
			ripple.scale.y += 0.0075;
			ripple.counter ++;
			ripple.alpha -= 0.005;

			if (ripple.counter >= 100){
				this.reset(ripple);
				ripple.scale.x = 0.01;
				ripple.scale.y = 0.01;
				this.growing.splice(this.growing.indexOf(ripple), 1);
			}
		
		},
		reset: function (ripple) {
			ripple.counter = 0;
			ripple.alpha = 1;
		},
		animate: function () {
			for(let i = 0; i < this.growing.length; i++){
				this.grow(this.growing[i], i);
			}
		},
		mouseMove: function(e){
			if(!this.action) return;
			this.counter ++;
			let pos = e.data.global;
			if(this.counter % 10 === 0){

				
				if(this.growing.indexOf(this.ripples[this.opc]) !== -1)return;
				
				this.ripples[this.opc].tint = Math.random() * 0xE8D4CD;
				this.ripples[this.opc].x = pos.x;
				this.ripples[this.opc].y = pos.y;
				this.ripples[this.opc].alpha = 0.75;
				this.growing.push(this.ripples[this.opc]);
				this.opc ++;
				if(this.opc > this.totalSprites -1 ){
					this.opc = 0;
				}
				this.counter = 0;
			}

			this.gradient.x = pos.x;
			this.gradient.y = pos.y;
			
		}


	}
}