export default function(PIXI, Utils, obj) {
	return {
		idle: true,
		vx: 0,
		vy: 5,
		rotateBoolean: false,
		renderTextureTestBoolean: false,
		inc: 90,
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

			// this.ripples = obj.ripples(PIXI, app);
			// this.ripples.init();

			let wh = {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight};

			this.pellets = obj.pellets(PIXI, app, this.utils, wh);
			this.pellets.init();

			this.magicPills = obj.magicPills(PIXI, app, this.utils, wh, this.filterTest.bind(this));
			this.magicPills.init();

            this.filterContainer = new PIXI.Container();
            app.stage.addChild(this.filterContainer);
            this.filter_animation = obj.filter_animation(PIXI, app, this.filterContainer)
            this.filter_animation.init();

            this.renderTexture = new obj.renderTexture(PIXI, app, this.pelletsArray);
            this.renderTexture.init();

            this.hero = new obj.hero(PIXI, app, this.utils, wh);
            this.hero.init();

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
			if(str === 'right'){
				this.idle = false;
				this.hero.radius += (Math.PI * 2) / this.inc;
				this.velocity = this.utils.randomNumberBetween(4, 6);
				this.vx = this.velocity * Math.sin(this.hero.radius);
				this.vy = -this.velocity * Math.cos(this.hero.radius);
				this.hero.storeRadius = this.hero.radius;
				let obj = {vx: -this.vx, vy: -this.vy}
				this.pellets.rotate("right", obj)
			
			} else if(str === 'left') {
				this.idle = false;
				this.hero.radius -= (Math.PI * 2) / this.inc;
				this.vx = this.velocity * Math.sin(this.hero.radius);
				this.vy = -this.velocity * Math.cos(this.hero.radius);
				this.hero.storeRadius = this.hero.radius;
				let obj = {vx: -this.vx, vy: -this.vy}
				this.pellets.rotate("left", obj)
			
			}

		},
		keyDown: function (e) {
            e.preventDefault();
            switch (e.keyCode) {
                case 37:
                    // left
                    this.rotateBoolean = true;
                    this.rotate('left');
                    break;
                case 38:
                    // up
                    break;
                case 39:
                    // right
                    this.rotateBoolean = true;
                    this.rotate('right');
                    break;
                case 40:
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
			
			this.hero.animate();
			//this.ripples.animate();
			this.pellets.animate();
			this.magicPills.animate();
			

		}
	}
}