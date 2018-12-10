export default function(PIXI, Utils, obj) {
	return {
		pos: [],
		radius: 0,
		storeRadius: 0,
		idle: true,
		vx: 0,
		vy: 5,
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

		
			const fpsCounter = new obj.PixiFps();
            app.stage.addChild(fpsCounter);

            


			this.ripples = obj.ripples(PIXI, app);
			this.ripples.init();

			this.pellets = obj.pellets(PIXI, app, this.utils, {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight});
			this.pellets.init();

            this.filterContainer = new PIXI.Container();
            app.stage.addChild(this.filterContainer);
            this.filter_animation = obj.filter_animation(PIXI, app, this.filterContainer)
            this.filter_animation.init();

            this.renderTexture = new obj.renderTexture(PIXI, app, this.pelletsArray);
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
			if(str === 'right'){
				this.idle = false;
				this.radius += (Math.PI * 2) / inc;
				this.velocity = this.utils.randomNumberBetween(4, 6);
				this.vx = this.velocity * Math.sin(this.radius);
				this.vy = -this.velocity * Math.cos(this.radius);
				this.storeRadius = this.radius;
				let obj = {vx: -this.vx, vy: -this.vy}
				this.pellets.rotate("right", obj)
			
			} else if(str === 'left') {
				this.idle = false;
				this.radius -= (Math.PI * 2) / inc;
				this.vx = this.velocity * Math.sin(this.radius);
				this.vy = -this.velocity * Math.cos(this.radius);
				this.storeRadius = this.radius;
				let obj = {vx: -this.vx, vy: -this.vy}
				this.pellets.rotate("left", obj)
			
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
			this.ripples.animate();
			this.pellets.animate();


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
		}
	}
}