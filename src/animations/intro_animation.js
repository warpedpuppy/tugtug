import * as PIXI from 'pixi.js';
import Utils from './utils/utils';
import Clock from './supportingClasses/clock';
import Platforms from './supportingClasses/platforms/platforms';

export default function(obj) {
	return {
		idle: true,
		vx: 0,
		vy: 5,
		rotateBoolean: false,
		renderTextureTestBoolean: false,
		inc: 90,
		mode: ['person', 'fish', 'dragon'],
        activeModeIndex: 0,
        activeMode: undefined,
		init: function () {

			this.activeMode = this.mode[this.activeModeIndex];

			this.utils = Utils();
			this.canvasWidth =  this.utils.returnCanvasWidth();
			this.canvasHeight = this.utils.returnCanvasHeight();

			var app = new PIXI.Application(this.canvasWidth, this.canvasHeight, {transparent: true});
			document.getElementById('homeCanvas').appendChild(app.view);


			this.backgroundCont = new PIXI.Container();
			app.stage.addChild(this.backgroundCont);

		
			const fpsCounter = new obj.PixiFps();
            app.stage.addChild(fpsCounter);

			this.ripples = obj.ripples(app);
			this.ripples.init();

			let wh = {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight};

			 let gear;
            let corners = this.corners = [[0,0],[this.canvasWidth, 0], [this.canvasWidth, this.canvasHeight], [0, this.canvasHeight]];
            this.gears = [];
            for(let i = 0; i < 4;i++){
                gear = new PIXI.Sprite.fromImage('/bmps/gear.png');
                gear.anchor.x = gear.anchor.y = 0.5;
                gear.x = corners[i][0];
                gear.y = corners[i][1];
                gear.alpha = 0.15;
                gear.rotate = (Math.random()*0.01)+0.01;
                app.stage.addChild(gear);
                this.gears.push(gear);
            }

            let clock = this.clock = Clock();
         	clock.init();
         	clock.cont.alpha = 0.25;
         	clock.cont.scale.set(0.5);
         	clock.cont.x = this.canvasWidth / 2;
         	clock.cont.y = this.canvasHeight / 2;
         	app.stage.addChild(clock.cont);

			this.pellets = obj.pellets(app, wh);
			this.pellets.init();

			this.magicPills = obj.magicPills(app, wh, this.filterTest.bind(this));
			this.magicPills.init();

            this.filterContainer = new PIXI.Container();
            app.stage.addChild(this.filterContainer);
            this.filter_animation = obj.filter_animation(app, this.filterContainer, wh)
            this.filter_animation.init();

          
            this.hero = new obj.hero(wh);
            this.hero.init();
            this.hero.switchPlayer(this.mode[this.activeModeIndex]);
            app.stage.addChild(this.hero.cont)

 
            
            let pos = [
            [(this.canvasWidth / 2), this.canvasHeight / 2],
			[(this.canvasWidth * 0.33),(this.canvasHeight / 2) - 100],
			[(this.canvasWidth * 0.66), (this.canvasHeight / 2) - 100]];

			let platforms = this.platforms = new Platforms();
			platforms.init(pos, app.stage)


            this.hero.setPlatforms(platforms.returnPlatforms())




            this.app = app;
          

			this.keyDown = this.keyDown.bind(this);
            this.keyUp = this.keyUp.bind(this);
			window.addEventListener('keydown', this.keyDown);
            window.addEventListener('keyup', this.keyUp);
			app.ticker.add(this.animate.bind(this));
			window.onresize = this.resizeHandler.bind(this);
		},
		stop: function () {
			window.onresize = undefined;
	        this.app.destroy(true);
	        window.removeEventListener('keydown', undefined);
            window.removeEventListener('keyup', undefined);
		},
		switchPlayer: function () {
			this.activeModeIndex ++;
			if(this.activeModeIndex >= this.mode.length)this.activeModeIndex = 0;
			this.activeMode = this.mode[this.activeModeIndex];
			// console.log(this.activeMode);
			this.hero.switchPlayer(this.activeMode);

			this.platforms.toggleVisibility(this.activeMode === 'person');
		},
		resizeHandler: function () {
			this.canvasWidth =  this.utils.returnCanvasWidth();
			this.canvasHeight = this.utils.returnCanvasHeight();
			this.hero.cont.x = this.canvasWidth / 2;
			this.hero.cont.y = this.canvasHeight / 2;

			this.corners = [[0,0],[this.canvasWidth, 0], [this.canvasWidth, this.canvasHeight], [0, this.canvasHeight]];
			for (let i = 0; i < 4; i++) {
                this.gears[i].x = this.corners[i][0];
                this.gears[i].y = this.corners[i][1];
            }

            let pos = [
            [(this.canvasWidth / 2), this.canvasHeight / 2],
			[(this.canvasWidth * 0.33),(this.canvasHeight / 2) - 100],
			[(this.canvasWidth * 0.66), (this.canvasHeight / 2) - 100]];
			this.platforms.resize(pos);

            this.clock.cont.x = this.canvasWidth / 2;
         	this.clock.cont.y = this.canvasHeight / 2;

			let wh = {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight};
			this.magicPills.resize(wh);
			this.filter_animation.resize(wh);
			this.pellets.resize(wh);
			this.app.renderer.resize(this.canvasWidth, this.canvasHeight);
		},
		nightMode: function () {
			this.pellets.change();
			this.app._options.backgroundColor = '0x000000';
			console.log(this.app._options.backgroundColor)
		},
		filterTest: function () {
			this.filter_animation.filterToggle();
		},
		rotate: function (str) {

			if (this.activeMode === 'person') {
				this.hero.move(str);
				return;
			}

			if(str === 'right'){
				this.idle = false;
				this.hero.radius += 0.5;
				this.velocity = this.utils.randomNumberBetween(4, 6);
				this.vx = this.velocity * Math.sin(this.hero.radius);
				this.vy = -this.velocity * Math.cos(this.hero.radius);
				this.hero.storeRadius = this.hero.radius;
				let obj = {vx: -this.vx, vy: -this.vy}
				this.pellets.rotate("right", obj)
			
			} else if(str === 'left') {
				this.idle = false;
				this.hero.radius -= 0.5;
				this.vx = this.velocity * Math.sin(this.hero.radius);
				this.vy = -this.velocity * Math.cos(this.hero.radius);
				this.hero.storeRadius = this.hero.radius;
				let obj = {vx: -this.vx, vy: -this.vy}
				this.pellets.rotate("left", obj)
			}
		},
		keyDown: function (e) {
            //e.preventDefault();
            switch (e.keyCode) {
            	case 32:
            		this.hero.jump();
            		break
                case 37:
                    // left
                    this.rotateBoolean = true;
                    this.rotate('left');
                    break;
                case 38:
                    // up
                    this.rotate('up');
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
			this.clock.animate();
			this.filter_animation.animate();
			this.hero.animate();
			this.ripples.animate();
			this.pellets.animate();
			this.magicPills.animate();

			for(let i = 0; i < 4;i++){
              this.gears[i].rotation += this.gears[i].rotate;
            }
		}
	}
}