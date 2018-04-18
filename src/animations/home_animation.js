export default function(Utils, PIXI, canvas, TimelineMax) {
	return {
		gv: {},
		pegQ: 0,
		pegs: [],
		utils: new Utils(),
    	app: new PIXI.Application(),
		body: new PIXI.Graphics(),
		foregroundContainer: new PIXI.Container(),
		backgroundContainer: new PIXI.Container(),
		canvasID: '',
		shakeAllow: true,
		tl: new TimelineMax(), 
		beads: [],
		beadQ: 1200,
		beadsAtATime: 400,
		beadCounter: 0,
		beadsOnStage: [],
		beadRadius: 5,
		beadLoopingQ: 0,
		horizBoxesQ: 5,
		vertBoxesQ: 5,
		totalBoxes: undefined,
		blockContainers: [],
		blockForegrounds: [],
		blockBackgrounds: [],
		Init: function(){
			window.onresize = this.resizeHandler.bind(this);
			this.totalBoxes =  this.horizBoxesQ * this.vertBoxesQ;
			this.addBeadsHandler = this.addBeadsHandler.bind(this)
	        this.canvasWidth = this.utils.returnCanvasWidth();
	        this.canvasHeight = this.utils.returnCanvasHeight();
	        this.stage = new PIXI.Container(); 
	        this.renderer = PIXI.autoDetectRenderer(this.canvasWidth, this.canvasHeight);
	        this.renderer.backgroundColor = 0x333333;
	        canvas.appendChild(this.renderer.view);
	        this.webGL = (this.renderer instanceof PIXI.CanvasRenderer) ? false : true;
			this.stage.addChild(this.backgroundContainer);
			this.stage.addChild(this.foregroundContainer);
			this.rainbowShake = this.rainbowShake.bind(this);
			this.shakeAllow = true;
			this.width =  this.utils.returnCanvasWidth();
			this.height = this.utils.returnCanvasHeight();

			if (!this.webGL) {
				console.log('this webgl = ', this.webGL)
				this.smallerQs();
			}
			
			//make object pools
			for(let j = 0; j < this.beadQ; j++){
				let b = this.Bead();
				this.beads.push(b)
			}
			for(let j = 0; j < this.totalBoxes; j ++){
				this.blockContainers.push(new PIXI.Graphics());
				this.blockForegrounds.push(new PIXI.Graphics());
				this.blockBackgrounds.push(new PIXI.Graphics());
			}

	        this.app.ticker.add(this.animate.bind(this));
	        this.resizeHandler();
	        this.rainbowShake();

	    },
	    smallerQs: function () {
			this.beadQ = 60;
			this.beadsAtATime = 20;
			this.beadRadius = 20;
	    },
	    Stop: function () {
	        this.app.ticker.destroy();
	    },
		Bead: function () {
			let bead = new PIXI.Graphics();
			bead.radius = this.beadRadius;
			bead
			.beginFill('0x'+Math.floor(Math.random()*16777215).toString(16))
			.drawCircle(0, 0, bead.radius)
			.endFill();
			return bead;
		},
		resizeHandler: function (){
			this.width =  this.utils.returnCanvasWidth();
			this.height = this.canvasHeight = this.utils.returnCanvasHeight();
			this.renderer.resize(this.width, this.height);
			this.clear();
			this.buildBoard(this.backgroundContainer);
		},
		clear: function (){
			this.backgroundContainer.removeChildren();
			for(let j = 0; j < this.totalBoxes; j ++){
				this.blockContainers[j].removeChildren();
				this.blockBackgrounds[j].removeChildren();
			}
		},
		buildBoard: function(){
			let horizBoxesWidth = this.horizBoxesWidth = this.width/this.horizBoxesQ,
		    vertBoxesHeight = this.height/this.vertBoxesQ,
			blockcontainer,
			blockBackground,
			blockForeground;
			this.backgroundContainer.removeChildren();
			this.pegQ = 0;
			this.pegs = [];
			for(let i = 0; i < this.horizBoxesQ; i++){
				for(let j = 0; j < this.vertBoxesQ; j++){
					blockcontainer = this.blockContainers[this.pegQ];
					blockBackground = this.blockBackgrounds[this.pegQ];
					blockcontainer.cont= blockBackground;
					blockcontainer.addChild(blockBackground)
					blockForeground = this.blockForegrounds[this.pegQ];
					blockForeground.clear();
					blockForeground
					.beginFill(0xFF00FF)
					.lineStyle(2, 0xFFFFFF, 1)
					.moveTo(0,0)
					.lineTo(horizBoxesWidth, 0)
					.lineTo(horizBoxesWidth, vertBoxesHeight)
					.lineTo(0, vertBoxesHeight)
					.lineTo(0, 0).endFill();
					blockcontainer.x = i*horizBoxesWidth + horizBoxesWidth/2;
					blockcontainer.y = j*vertBoxesHeight + vertBoxesHeight/2;
					blockcontainer.graphic = blockForeground;
					blockForeground.pivot = new PIXI.Point(horizBoxesWidth/2, vertBoxesHeight/2);
					this.pegs.push(blockcontainer)
					blockcontainer.addChild(blockForeground)
					this.backgroundContainer.addChild(blockcontainer);
					this.pegQ ++;
				}
			}
		},
		destroy: function () {
			this.shakeAllow = false;
			this.tl.stop();
			this.tl = null;
		},
		rainbowShake: function () {
			if(this.shakeAllow) {
				this.shakeAllow = false;
			} else {
				return;
			}
			//console.log('start rainbow shake!!!!!')
			let newIndex = Math.floor(Math.random()*this.pegs.length);
			let element = this.pegs[newIndex];
			let parent = element.parent;
			parent.removeChild(element);
			parent.addChild(element);
			let rotateQ = this.utils.deg2rad(20);
			this.tl = new TimelineMax({onComplete: done });
			this.tl.to(element.graphic, 1, {scaleX:1.2, scaleY:1.2, onComplete:this.addBeadsHandler, onCompleteParams: [element]});
			this.tl.to(element.graphic, 0.1, {rotation:rotateQ});
			this.tl.to(element.graphic, 0.1, {rotation:-rotateQ});
			this.tl.to(element.graphic, 0.1, {rotation:rotateQ});
			this.tl.to(element.graphic, 0.1, {rotation:-rotateQ});
			this.tl.to(element.graphic, 0.1, {rotation:0});
			this.tl.to(element.graphic, 1, {scaleX:1, scaleY:1});
			let that = this;
			function done(){
				that.shakeAllow = true;
				that.rainbowShake();
			}
		},
		addBeadsHandler: function(element){
			for(let i = 0; i < this.beadsAtATime; i++){
				let bead = this.beads[this.beadCounter]
				bead.x = Math.random()*this.horizBoxesWidth - (this.horizBoxesWidth/2);
				bead.y = 0;
				bead.blockCont = true;
				bead.vy = (Math.random()*3)+3;
				bead.vx = (Math.random()*1)+1;
				if(bead.x < 0){	bead.vx *=-1;}
				element.cont.addChild(bead);
				this.beadCounter ++;
				this.beadsOnStage.push(bead);
				if(this.beadCounter >= this.beadQ){
					this.beadCounter = 0;
				}
			}
			this.beadLoopingQ = this.beadsOnStage.length;
		},
		displayFPS: function (fps) {
			document
			.getElementById('fpsChecker')
			.innerHTML = `current fps = ${Math.round(fps)}`;

			// if (Number(fps) < 10) {
			// 	this.smallerQs();
			// }
		},
		animate: function () {
			this.renderer.render(this.stage);
			let gravity = 0.03;
			let bead;
			this.displayFPS(this.app.ticker.FPS)
			

			for(let i = 0; i < this.beadLoopingQ; i++){

					bead = this.beadsOnStage[i];
					if(bead && bead.parent){
						//if(bead.vy > 2)bead.vy -=2;
						bead.y += bead.vy;
						bead.x += bead.vx;
						bead.vy += gravity;

						let globalPoint = bead.toGlobal(bead.parent, new PIXI.Point(bead.x, bead.y), false);
						if(globalPoint.y > this.canvasHeight - bead.radius){
							bead.vy =-(Math.random()*3)-1;
							//switch bead to front plane if not
							if (bead.blockCont) {
								bead.blockCont = false;
								bead.y = globalPoint.y;
								bead.x = globalPoint.x;
								this.stage.addChild(bead);
							}
						}

						if(globalPoint.x < 0 || globalPoint.x > this.width) {
								bead.parent.removeChild(bead);
								this.beadsOnStage.splice(i, 1);
						}
					}
					
			}
			
				
		}
	}

}

