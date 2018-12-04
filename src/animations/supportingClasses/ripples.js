export default function Ripples (PIXI, app, renderer, stage, wh) {
	return {
		ripples: [],
		totalSprites: 0,
		tick: 0,
		dudeBounds: undefined,
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
                dude.scale.set(0.1);

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
		},
		grow: function (ripple) {
			if(ripple.scale.x < 1){
				ripple.scale.x += 0.01;
				ripple.scale.y += 0.01;
				
			}
			// if(ripple.alpha > 0){
			// 	ripple.alpha -= 0.015;
			// }
		},
		animate: function (){
			console.log("this = ",this.dudeBounds)
			this.grow(this.ripples[0])

            // for (var i = 0; i < this.ripples.length; i++) {

            //     var dude = this.ripples[i];
            //     dude.scale.y = 0.95 + Math.sin(this.tick + dude.offset) * 0.05;
            //     dude.direction += dude.turningSpeed * 0.01;
            //     dude.x += Math.sin(dude.direction) * (dude.speed * dude.scale.y);
            //     dude.y += Math.cos(dude.direction) * (dude.speed * dude.scale.y);
            //     dude.rotation = -dude.direction + Math.PI;

            //     // wrap the maggots
            //     if (dude.x < this.dudeBounds.x) {
            //         dude.x += this.dudeBounds.width;
            //     }
            //     else if (dude.x > this.dudeBounds.x + this.dudeBounds.width) {
            //         dude.x -= this.dudeBounds.width;
            //     }

            //     if (dude.y < this.dudeBounds.y) {
            //         dude.y += this.dudeBounds.height;
            //     }
            //     else if (dude.y > this.dudeBounds.y + this.dudeBounds.height) {
            //         dude.y -= this.dudeBounds.height;
            //     }
            // }

            // increment the ticker
            this.tick += 0.1;
		}
	}
}