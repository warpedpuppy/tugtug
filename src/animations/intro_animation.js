export default function(Utils, PIXI, id, TimelineMax, PixiFps, filter_animation, renderTexture) {
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
		vx: 0,
		vy: 5,
		pelletsArray: [],
		edgeBuffer: 200,
		pelletQ: 100,
		rotateBoolean: false,
		renderTextureTestBoolean: false,
		init: function () {


			this.utils = Utils();
			this.canvasWidth =  this.utils.returnCanvasWidth();
			this.canvasHeight = this.utils.returnCanvasHeight();



			var app = new PIXI.Application(this.canvasWidth, this.canvasHeight, {backgroundColor: 0x0033CC});
			document.getElementById('homeCanvas').appendChild(app.view);


			this.backgroundCont = new PIXI.Container();
			app.stage.addChild(this.backgroundCont);

			this.bottomEdge = this.canvasHeight + this.edgeBuffer;
			this.rightEdge = this.canvasWidth + this.edgeBuffer;


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
            this.pelletQ = app.renderer instanceof PIXI.WebGLRenderer ? 1000 : 100;

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

            this.gradient = PIXI.Sprite.fromImage('/bmps/gradient.png');
            this.gradient.alpha = 0.5;
			this.gradient.anchor.set(0.5);
			app.stage.addChild(this.gradient);



			var pellets = new PIXI.particles.ParticleContainer(10000, {
			    scale: true,
			    position: true,
			    rotation: true,
			    uvs: true,
			    alpha: true
			});
			app.stage.addChild(pellets);
			 for(let i = 0; i < this.pelletQ; i ++ ){
            	let s =  PIXI.Sprite.fromImage('/bmps/pellet.png');
            	s.tint = Math.random() * 0xFFFFFF;
            	s.vx = 0;//this.utils.randomNumberBetween(1,5);
            	s.vy = this.utils.randomNumberBetween(1,5); 
            	s.x = this.utils.randomNumberBetween(0, this.canvasWidth);
            	s.y = this.utils.randomNumberBetween(0, this.canvasHeight);
            	s.scale.set(this.utils.randomNumberBetween(0.05, 0.25));
            	pellets.addChild(s);
            	this.pelletsArray.push(s);
            }

            this.filterContainer = new PIXI.Container();
            app.stage.addChild(this.filterContainer);
            this.filter_animation = filter_animation(PIXI, app, this.filterContainer)
            this.filter_animation.init();

            this.renderTexture = new renderTexture(PIXI, app, this.pelletsArray);
            this.renderTexture.init();

            this.cont = new PIXI.Container();
            this.cont.x = this.canvasWidth / 2;
            this.cont.y = this.canvasHeight / 2;
            app.stage.addChild(this.cont);
            this.segments = [];
            for (let i = 0; i < 5; i++) {
                let segment = this.bodySegment(25, 0xFFFF00, i*25);
                this.segments.push(segment);
                this.cont.addChild(segment);
            }

            this.app = app;
          

			this.keyDown = this.keyDown.bind(this);
            this.keyUp = this.keyUp.bind(this);
			window.addEventListener('keydown', this.keyDown);
            window.addEventListener('keyup', this.keyUp);
			app.ticker.add(this.animate.bind(this));

		},
		filterTest: function () {
			this.filter_animation.filterToggle();
		},
		renderTextureTest: function () {
			this.renderTextureTestBoolean = !this.renderTextureTestBoolean;
		},
		rotate: function (str) {
			let inc = 90;
			console.log("TURN!!!")
			if(str === 'right'){
				this.idle = false;
				this.radius += (Math.PI * 2) / inc;

				this.vx = this.velocity * Math.sin(this.radius);
				this.vy = -this.velocity * Math.cos(this.radius);
				this.storeRadius = this.radius;


				for(let i = 0; i < this.pelletQ; i++){
					this.velocity = this.utils.randomNumberBetween(4, 6);
					this.pelletsArray[i].vx = -this.velocity * Math.sin(this.radius);
	            	this.pelletsArray[i].vy = this.velocity * Math.cos(this.radius);
	            }


			} else if(str === 'left') {
				console.log('boom')
				this.idle = false;
				this.radius -= (Math.PI * 2) / inc;
				this.vx = this.velocity * Math.sin(this.radius);
				this.vy = -this.velocity * Math.cos(this.radius);
				this.storeRadius = this.radius;

				for(let i = 0; i < this.pelletQ; i++){
					this.velocity = this.utils.randomNumberBetween(4, 6);
					this.pelletsArray[i].vx = -this.velocity * Math.sin(this.radius);
	            	this.pelletsArray[i].vy =  this.velocity * Math.cos(this.radius);
	            }
			}

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
                    this.rotateBoolean = true;

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
                    this.rotateBoolean = true;
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
            this.rotateBoolean = false;
            this.idle = true;
        },
		animate: function () {
			
			this.filter_animation.animate();

			if(this.renderTextureTestBoolean){
				this.renderTexture.animate();
				this.app.renderer.render(this.app.stage, this.renderTexture.renderTexture2, true);
			} else {
				this.app.renderer.render(this.app.stage, undefined, true);
			}
			

			this.rotateChain();
			for(let i = 0; i < this.growing.length; i++){
				this.grow(this.growing[i], i);
			}
			

			for(let i = 0; i < this.pelletQ; i++){
				this.pelletsArray[i].x += this.pelletsArray[i].vx;// * rate;
            	this.pelletsArray[i].y += this.pelletsArray[i].vy;// * rate;

            	if(this.pelletsArray[i].y > this.bottomEdge) {
            		this.pelletsArray[i].y = this.utils.randomNumberBetween(-this.edgeBuffer, 0);
            	} else if(this.pelletsArray[i].y < -this.edgeBuffer) {
            		this.pelletsArray[i].y = this.utils.randomNumberBetween(this.canvasHeight, this.bottomEdge);
            	}

            	if(this.pelletsArray[i].x > this.rightEdge) {
            		this.pelletsArray[i].x = this.utils.randomNumberBetween(-this.edgeBuffer, 0);
            	} else if(this.pelletsArray[i].x < -this.edgeBuffer) {
            		this.pelletsArray[i].x = this.utils.randomNumberBetween(this.canvasWidth, this.rightEdge);
            	}

			}

			// this.cont.x += this.vx;// * rate;
   //          this.cont.y += this.vy;// * rate;
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
		reset: function (ripple) {
			ripple.counter = 0;
			ripple.alpha = 1;
		},
		mouseMove: function(e){
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
			
		},
	}
}