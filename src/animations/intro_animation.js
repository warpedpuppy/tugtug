export default function(Utils, PIXI, id, TimelineMax, PixiFps) {
	return {
		ripples: [],
		totalSprites: 0,
		tick: 0,
		dudeBounds: undefined,
		growing: [],
		pos: [],
		radius: 0,
		storeRadius: 0,
		idle: true,
		init: function () {
			this.utils = Utils();
			this.canvasWidth =  this.utils.returnCanvasWidth();
			this.canvasHeight = this.utils.returnCanvasHeight();

			var app = new PIXI.Application();
			document.getElementById('homeCanvas').appendChild(app.view);
			app.renderer.resize(this.canvasWidth, this.canvasHeight);

			var sprites = new PIXI.particles.ParticleContainer(10000, {
			    scale: true,
			    position: true,
			    rotation: true,
			    uvs: true,
			    alpha: true
			});
			app.stage.addChild(sprites);

			const fpsCounter = new PixiFps();
            app.stage.addChild(fpsCounter);

            this.totalSprites = app.renderer instanceof PIXI.WebGLRenderer ? 10 : 10;

            for (let i = 0; i < this.totalSprites; i++) {
                var dude = PIXI.Sprite.fromImage('/bmps/ring.png');
                dude.anchor.x = dude. anchor.y = 0.5;
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
            app.stage.on('pointermove', this.mouseMove);
            this.counter = 0;
            this.opc = 0;



            this.cont = new PIXI.Container();
            this.cont.x = this.canvasWidth / 2;
            this.cont.y = this.canvasHeight / 2;
            app.stage.addChild(this.cont);
            this.segments = [];
            for (let i = 0; i < 5; i++) {
                let segment = this.bodySegment(50, 0xFFFF00, i*50);
                this.segments.push(segment);
                this.cont.addChild(segment);
            }
            this.keyDown = this.keyDown.bind(this);
            this.keyUp = this.keyUp.bind(this);
			window.addEventListener('keydown', this.keyDown);
            window.addEventListener('keyup', this.keyUp);
			app.ticker.add(this.animate.bind(this));

		},
		rotate: function (str) {
			let inc = 90;
			if(str === 'right'){
				this.idle = false;
				this.radius += (Math.PI * 2) / inc;
				this.vx = this.velocity * Math.sin(this.radius);
				this.vy = -this.velocity * Math.cos(this.radius);
				this.storeRadius = this.radius;
			} else if(str === 'left') {
				this.idle = false;
				this.radius -= (Math.PI * 2) / inc;
				this.vx = this.velocity * Math.sin(this.radius);
				this.vy = -this.velocity * Math.cos(this.radius);
				this.storeRadius = this.radius;
			}

		},
		rotateChain: function () {

			if(this.idle)this.radius = this.utils.cosWave(this.storeRadius, 0.15, 0.01);

            this.pos.push(this.radius);
            this.increment = 5;
            let maxLength = this.increment * 5;
            if (this.pos.length > maxLength) {
                this.pos = this.pos.slice(-maxLength);
            }

            this.segments[0].rotation = this.radius;
            for (let i = 1; i < 5; i++) {
                let index = this.pos.length - (i * this.increment);
                if (this.pos.length >= index) {
                 this.segments[i].rotation = this.pos[index];
                }
            }
        },
		keyDown: function (e) {
            e.preventDefault();
            switch (e.keyCode) {
                case 37:
                    //left
                   // this.moveAllow = true;
                    this.rotateAllow = true;
                    this.rotate('left');
                    break;
                case 38:
                    //alert('up');
                    // this.moveAllow = true;
                    // this.vy = -speed;
                    // this.vx = 0;
                    break;
                case 39:
                    //alert('right');
                  //  this.moveAllow = true;
                    this.rotateAllow = true;
                    this.rotate('right');
                    break;
                case 40:
                    //alert('down');
                    // this.moveAllow = true;
                    // hero.rotate('down');
                    break;
                default:
                    this.vy = 0;
            }
        },
        keyUp: function (e) {
            e.preventDefault();
            this.idle = true;
        },
		animate: function () {
			this.rotateChain();
			for(let i = 0; i < this.growing.length; i++){
				this.grow(this.growing[i], i);
			}
		},
		grow: function (ripple, index) {
			ripple.scale.x += 0.075;
			ripple.scale.y += 0.075;
			ripple.counter ++;
			ripple.alpha -= 0.005;

			if (ripple.counter >= 100){
				this.reset(ripple);
				ripple.scale.x = 0.01;
				ripple.scale.y = 0.01;
				this.growing.splice(this.growing.indexOf(ripple), 1);
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
            let triangleWidth = 100,
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
		    b.pivot.x = b.pivot.y = 50;
		    b.rotation = this.utils.deg2rad(180);
            cont.addChild(b);
            cont.body = b;
            return cont;
		},
		reset: function (ripple) {
			ripple.counter = 0;
			ripple.alpha = 1;
		},
		mouseMove: function(e){
			this.counter ++;
			if(this.counter % 10 === 0){

				let pos = e.data.global;
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
			
		},
	}
}