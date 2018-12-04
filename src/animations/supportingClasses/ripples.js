export default function Ripples (PIXI, app, renderer, stage, wh) {
	return {
		ripples: [],
		totalSprites: 0,
		tick: 0,
		dudeBounds: undefined,
		growing: [],
		init: function () {

			var sprites = new PIXI.particles.ParticleContainer(100, {
                scale: true,
                position: true,
                rotation: true,
                uvs: true,
                alpha: true
            });
            stage.addChild(sprites);

            this.totalSprites = renderer instanceof PIXI.WebGLRenderer ? 100 : 10;

            for (let i = 0; i < this.totalSprites; i++) {

                // create a new Sprite
                var dude = PIXI.Sprite.fromImage('/bmps/ring.png');

                dude.anchor.x = dude. anchor.y = 0.5;
                // dude.tint = Math.random() * 0xE8D4CD;

                // // set the anchor point so the texture is centerd on the sprite
                // dude.anchor.set(0.5);

                // // different maggots, different sizes
                dude.scale.set(0.01);

                // // scatter them all
                // dude.x = Math.random() * wh.width;
                // dude.y = Math.random() * wh.height;

                // dude.tint = Math.random() * 0x808080;

                // // create a random direction in radians
                // dude.direction = Math.random() * Math.PI * 2;

                // // this number will be used to modify the direction of the sprite over time
                // dude.turningSpeed = Math.random() - 0.8;

                // // create a random speed between 0 - 2, and these maggots are slooww
                // dude.speed = (2 + Math.random() * 2) * 0.2;

                // dude.offset = Math.random() * 100;

                // finally we push the dude into the maggots array so it it can be easily accessed later
                this.ripples.push(dude);

                sprites.addChild(dude);
            }
            // create a bounding box box for the little maggots
            var dudeBoundsPadding = 100;
            this.dudeBounds = new PIXI.Rectangle(
                -dudeBoundsPadding,
                -dudeBoundsPadding,
                app.screen.width + dudeBoundsPadding * 2,
                app.screen.height + dudeBoundsPadding * 2
            );

            this.tick = 0;
            this.animate = this.animate.bind(this);
            stage.interactive = true;
            this.mouseMove = this.mouseMove.bind(this);
            stage.on('pointermove', this.mouseMove);
             this.counter = 0;
             this.opc = 0;
		},
		grow: function (ripple) {
			if(ripple.scale.x < 1){
				ripple.scale.x += 0.01;
				ripple.scale.y += 0.01;
				
			} else {
				ripple.alpha = 0;
				ripple.visible = false;
				this.growing.splice(this.growing.indexOf(ripple), 1);
			}

			if(ripple.alpha > 0){
				ripple.alpha -= 0.025;
			} else {
				ripple.alpha = 0;
				ripple.visible = false;
			}
		},
		mouseMove: function(e){
			this.counter ++;
			if(this.counter % 2 === 0){

				let pos = e.data.global;
				this.ripples[this.opc].alpha = 1;
				this.ripples[this.opc].scale.set(0.01);
				this.ripples[this.opc].tint = Math.random() * 0xE8D4CD;
				this.ripples[this.opc].x = pos.x;
				this.ripples[this.opc].y = pos.y;
				this.growing.push(this.ripples[this.opc]);
				this.opc ++;
				if(this.opc > this.totalSprites -1 ){
					this.opc = 0;
				}
				console.log(this.opc)
			}
			
		},
		animate: function (){
			for(let i = 0; i < this.growing.length; i++){
				this.grow(this.growing[i]);
			}
		}
	}
}