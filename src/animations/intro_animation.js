import * as PIXI from 'pixi.js';
import Utils from './utils/utils';
import Clock from './supportingClasses/clock';
import BouncePlatform from './supportingClasses/bounce/bouncePlatform';
import BounceBackground from './supportingClasses/bounce/bounceBackground';
import FlyBackground from './supportingClasses/fly/flyBackground';
import BounceAction from './supportingClasses/actions/bounceAction';
import JumpAction from './supportingClasses/actions/jumpAction';
import SwimAction from './supportingClasses/actions/swimAction';
import Platforms from './supportingClasses/platforms/platforms';
import FlyAction from './supportingClasses/actions/flyAction';
import Pellets from './supportingClasses/pellets';
import MagicPills from './supportingClasses/magicPills';
import TransitionItems from './supportingClasses/transitionItems';
import FilterAnimation from './supportingClasses/filterAnimation';
import Gears from './supportingClasses/gears';
import Hero from './supportingClasses/hero';
import Ripples from '../animations/supportingClasses/ripples';
import Treasure from '../animations/supportingClasses/treasure';
import Score from '../animations/supportingClasses/score';
import PixiFps from "pixi-fps";
import Config from './animationsConfig';
import SwimBackground from './supportingClasses/swim/swimBackground';
import FishSchool from './supportingClasses/swim/fishSchool';
import LilypadsLotuses from './supportingClasses/swim/lilypadsLotuses';
import JumpBackground from './supportingClasses/jump/jumpBackground';
export default function(obj) {
	return {
		idle: true,
		vx: 0,
		vy: 5,
		rotateLeftBoolean: false,
		rotateRightBoolean: false,
		renderTextureTestBoolean: false,
		inc: 90,
		mode: ['bounce', 'fly', 'swim', 'jump'],
        activeModeIndex: 0,
        activeMode: undefined,
        backgroundCont: new PIXI.Container(),
        foregroundCont: new PIXI.Container(),
        filterContainer: new PIXI.Container(),
        ripples: undefined,
        action: true,
        tempRect: new PIXI.Rectangle(),
        spriteSheet: undefined,
        gears: Gears,
        clock: Clock,
        pellets: Pellets(),
        magicPills: MagicPills(),
        filterAnimation: FilterAnimation(),
        hero: Hero(),
        transitionItems: TransitionItems(),
        utils: Utils,
        treasure: Treasure(),
        score: Score(),
        loader: PIXI.loader,
        activeAction: undefined,
        config: Config,
		init: function () {

			this.canvasWidth =  this.utils.returnCanvasWidth();
			this.canvasHeight = this.utils.returnCanvasHeight();

			var app = this.app = new PIXI.Application(this.canvasWidth, this.canvasHeight, {transparent: true});
			document.getElementById('homeCanvas').appendChild(app.view);

			this.stage = app.stage;
		
			const fpsCounter = new PixiFps();
            app.stage.addChild(fpsCounter);

			this.wh = {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight};

			this.stage.addChild(this.backgroundCont);
			this.stage.addChild(this.filterContainer);
			this.stage.addChild(this.foregroundCont);

			this.keyDown = this.keyDown.bind(this);
            this.keyUp = this.keyUp.bind(this);
			window.addEventListener('keydown', this.keyDown);
   			window.addEventListener('keyup', this.keyUp);

			window.onresize = this.resizeHandler.bind(this);

			this.start = this.start.bind(this);
            if (!this.loader.resources["/ss/ss.json"]) {
                 this.loader
                    .add("/ss/ss.json")
                    .add("Hobo", "/fonts/hobostd.xml")
                    .load(this.start);
            } else {
                this.start();
            }

		},
		start: function () {

			this.spritesheet = this.loader.resources["/ss/ss.json"].spritesheet;

			this.gears.init(this.stage, this.wh);

            this.clock.init(this.stage, this.wh);

			//this.pellets.init(this.app, this.wh, this.stage, this.activeMode, this.spritesheet);

			this.magicPills.init(this.app, this.wh, this.filterTest.bind(this), this.backgroundCont, this.spritesheet);

            this.filterAnimation.init(this.app, this.filterContainer, this.wh);

            this.hero.init(this.wh, undefined, this.stage, this.spritesheet).switchPlayer(this.mode[this.activeModeIndex]);

            this.transitionItems.init(
            	this.mode, 
            	this.stage, 
            	this.wh, 
            	this.spritesheet, 
            	this.hero.cont, 
            	this.app, 
            	this.switchPlayer.bind(this)).build();

            this.treasure.init(this.app, this.wh, this.spritesheet, this.hero.cont, this.stage);
            
            //this.score.init(this.stage, this.wh);

            this.switchPlayer(this.mode[this.activeModeIndex]);

            this.app.ticker.add(this.animate.bind(this));
		},
		stop: function () {
			window.onresize = undefined;
	        if(this.app)this.app.destroy(true);
	        window.removeEventListener('keydown', this.keyDown);
            window.removeEventListener('keyup', this.keyUp);
		},
		switchPlayer: function (str) {

			if(str) {
				this.activeMode = str;
			} else {
				this.activeModeIndex ++;
				if(this.activeModeIndex >= this.mode.length)this.activeModeIndex = 0;
				this.activeMode = this.mode[this.activeModeIndex];
			}


			this.hero.switchPlayer(this.activeMode);
			this.pellets.changeMode(this.activeMode);

			if (this.activeMode === 'jump') {

				if (!this.jumpAction) {
					this.platforms = Platforms();
					this.platformCont = new PIXI.Container();
					this.platforms.init(this.platformCont, this.wh, this.spritesheet);

					this.jumpAction = JumpAction();
            		this.jumpAction.init(this.hero, this.platforms.returnPlatforms('intro'), this.canvasWidth, this.canvasHeight, this.platformCont, this.stage);

            		this.jumpBackground = JumpBackground();
            		this.jumpBackground.init(this.app, this.stage, this.wh, this.spritesheet, this.jumpAction, this.hero);

				}
				this.activeAction = this.jumpAction;
				this.platforms.addPlatforms(true);
				this.stage.addChild(this.platformCont)
				this.jumpBackground.addToStage();

			} else {
				if(this.jumpBackground)this.jumpBackground.removeFromStage();
				if(this.platforms)this.platforms.addPlatforms(false);
				this.stage.removeChild(this.platformCont)
			}

			if (this.activeMode === 'bounce') {

				if(!this.bouncePlatform){
					this.bouncePlatform = BouncePlatform();
            		this.bouncePlatform.init(this.stage, this.spritesheet);
            		this.bouncePlatform.on(false); 
					this.bounceAction = BounceAction();
            		this.bounceAction.init(this.hero, this.bouncePlatform, this.canvasWidth, this.canvasHeight);

            		this.bounceBackground = BounceBackground();
            		this.bounceBackground.init(
            			this.app, 
            			this.wh, 
            			this.spritesheet,
            			this.hero,
            			this.bounceAction);
				}  
				this.activeAction = this.bounceAction;
				this.bouncePlatform.start(this.canvasWidth, this.canvasHeight);
				this.bouncePlatform.on(true);
				this.bounceBackground.addToStage();

			} else {
				if (this.bouncePlatform) this.bouncePlatform.on(false);
				if (this.bounceBackground) this.bounceBackground.removeFromStage();
			}

			// if(this.activeMode === 'swim' || this.activeMode === 'fly'){
			// 	if (!this.swimAction) {
			// 		this.swimAction = SwimAction();
			// 		this.swimAction.init(this.hero, this.activeMode, this.wh, this.stage);

			// 		this.fishSchool = FishSchool(this.spritesheet);
			// 		this.fishSchool.init(this.stage, this.wh);

			// 		this.swimBackground = SwimBackground();
			// 		this.swimBackground.init(this.stage, this.wh);

			// 		this.lilypadLotuses = LilypadsLotuses();
			// 		this.lilypadLotuses.init(this.stage, this.wh);

			// 	}
			// 	this.fishSchool.addToStage();
			// 	this.lilypadLotuses.addToStage();
			// 	this.swimBackground.addToStage();
			// 	this.activeAction = this.swimAction;
			// 	this.swimAction.switchMode(this.activeMode);
			// }

			if(this.activeMode === 'swim'){
				if (!this.ripples) {
					this.ripples = Ripples();
					this.ripples.init(this.app, this.wh);

					this.swimAction = SwimAction();
					this.swimAction.init(this.hero, this.activeMode, this.wh, this.stage);

					this.fishSchool = FishSchool(this.spritesheet);
					this.fishSchool.init(this.stage, this.wh);

					this.swimBackground = SwimBackground();
					this.swimBackground.init(this.stage, this.wh);

					this.lilypadLotuses = LilypadsLotuses();
					this.lilypadLotuses.init(this.stage, this.wh);
				}
				
				this.ripples.on(true);
				this.fishSchool.addToStage();
				this.lilypadLotuses.addToStage();
				this.swimBackground.addToStage();
				this.activeAction = this.swimAction;
				this.swimAction.switchMode(this.activeMode);
			} else {
				if (this.ripples) this.ripples.on(false);
				if (this.fishSchool) this.fishSchool.removeFromStage();
				if (this.lilypadLotuses) this.lilypadLotuses.removeFromStage();
				if (this.swimBackground) this.swimBackground.removeFromStage();
				if (this.swimAction) this.swimAction.airBubbles.resetAirBubbles();

			}

			if(this.activeMode === 'fly'){
				if (!this.flyBackground) {
					this.flyBackground = FlyBackground();
					this.flyBackground.init(this.app, this.stage, this.wh, this.spritesheet, this.hero);

					this.flyAction = FlyAction();
					this.flyAction.init(this.hero, this.activeMode, this.wh, this.app, this.spritesheet);
				}
				this.activeAction = this.flyAction;
				this.flyBackground.addToStage();
			} else {
				if(this.flyBackground)this.flyBackground.removeFromStage();

			}

		},
		resizeHandler: function () {
			this.canvasWidth =  this.utils.returnCanvasWidth();
			this.canvasHeight = this.utils.returnCanvasHeight();

			let wh = {canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight};
			this.clock.resize(wh);
			this.gears.resize(wh);
		//	this.score.resize(wh);
			if(this.platforms)this.platforms.resize(wh);
			this.magicPills.resize(wh);
			this.treasure.resize(wh);
			this.transitionItems.resize(wh);
			this.filterAnimation.resize(wh);
			this.pellets.resize(wh);
			this.hero.resize(wh);
			if(this.jumpAction)this.jumpAction.resize(wh);
			if(this.bouncePlatform)this.bouncePlatform.resize(wh);
			if(this.bounceAction)this.bounceAction.resize(wh);

			this.app.renderer.resize(this.canvasWidth, this.canvasHeight);
		},
		nightMode: function () {
			this.pellets.change();
			this.app._options.backgroundColor = '0x000000';
			console.log(this.app._options.backgroundColor)
		},
		filterTest: function () {
			this.filterAnimation.filterToggle();
		},
		rotate: function (str) {

			if (this.activeMode === 'jump') {
				this.jumpAction.move(str);
				return;
			}

			if (str === 'right') {
				this.idle = false;
				this.activeAction.radius += 0.25;
				this.velocity = this.utils.randomNumberBetween(
					this.config.swimVelocities[0], 
					this.config.swimVelocities[1]);
				this.vx = this.velocity * Math.sin(this.activeAction.radius);
				this.vy = -this.velocity * Math.cos(this.activeAction.radius);
				this.activeAction.storeRadius = this.activeAction.radius;
				let obj = {vx: -this.vx, vy: -this.vy};
				this.pellets.rotate(obj);
				//this.transitionItems.rotate(obj);
				this.activeAction.rotate(obj);
			
			} else if (str === 'left') {
				this.idle = false;
				this.activeAction.radius -= 0.25;
				this.velocity = this.utils.randomNumberBetween(
					this.config.swimVelocities[0], 
					this.config.swimVelocities[1]);
				this.vx = this.velocity * Math.sin(this.activeAction.radius);
				this.vy = -this.velocity * Math.cos(this.activeAction.radius);
				this.activeAction.storeRadius = this.activeAction.radius;
				let obj = {vx: -this.vx, vy: -this.vy};
				this.pellets.rotate(obj);
				//this.transitionItems.rotate(obj);
				this.activeAction.rotate(obj);
			}
		},
		keyDown: function (e) {
            //e.preventDefault();
            this.hero.heroJump.look();
            switch (e.keyCode) {
            	case 32:
            	// space
            		if(this.jumpAction)this.jumpAction.jump();
            		if(this.flyAction)this.flyAction.fire(true);
            		break;
                case 37:
                    // left
                    if(this.activeMode === 'bounce')break;
                    if(this.swimAction)this.swimAction.spinning = true;
                    this.rotateLeftBoolean = true;
                    
                    //this.rotate('left');
                    break;
                case 38:
                    // up
                    this.rotate('up');
                    this.hero.heroJump.look('up');
                    break;
                case 39:
                    // right
                    if(this.activeMode === 'bounce')break;
                    if(this.swimAction)this.swimAction.spinning = true;
                    this.rotateRightBoolean = true;
                    //this.rotate('right');
                    break;
                case 40:
                    break;
                default:
                    this.vy = 0;
            }
        },
        keyUp: function (e) {
            e.preventDefault();
            if(this.swimAction)this.swimAction.spinning = false;
            this.rotateLeftBoolean = false;
            this.rotateRightBoolean = false;
            this.idle = true;
            if(this.flyAction)this.flyAction.fire(false);
        },
		animate: function () {

			this.score.animate();

			if (this.treasure.hit || this.transitionItems.hit) {
				if(this.action){
					this.filterAnimation.shutOff();
					this.action = false;
				}
				if (this.treasure.hit) {
					this.score.increase(100);
					this.treasure.animateSpecial();
				} else {
					this.transitionItems.animateSpecial();
				}

			} else {
				this.action = true;
			}

			if(this.action){
				if(this.rotateLeftBoolean)this.rotate('left');
				if(this.rotateRightBoolean)this.rotate('right');
				this.clock.animate();
				this.filterAnimation.animate();
				
				this.gears.animate();
				this.activeAction.animate();
				this.pellets.animate(this.activeAction.vx, this.activeAction.vy);
				this.treasure.animate(this.activeAction.vx, this.activeAction.vy);
				this.transitionItems.animate(this.activeAction.vx, this.activeAction.vy);
				this.magicPills.animate(this.activeAction.vx, this.activeAction.vy);
				
				if (this.activeMode === 'bounce') {
					this.bouncePlatform.animate();
					this.bounceBackground.animate();
				} else if (this.activeMode === 'swim') {
					this.ripples.animate();
					this.fishSchool.animate();
					this.swimBackground.animate();
					this.lilypadLotuses.animate();
				} else if (this.activeMode === 'jump') {
					this.jumpBackground.animate();
				} else if (this.activeMode === 'fly') {

				}
			}
			
			


		}
	}
}