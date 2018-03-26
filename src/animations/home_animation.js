export default function(Utils, PIXI, canvas, TimelineMax) {
	return {
		gv: {},
		pegQ: 0,
		pegs: [],
		utils: new Utils(),
    	app: new PIXI.Application(),
		body_radius: 10,
		character: new PIXI.Container(),
		body: new PIXI.Graphics(),
		foregroundContainer: new PIXI.Container(),
		backgroundContainer: new PIXI.Container(),
		canvasID: '',
		shakeAllow: true,
		tl: new TimelineMax(), 
		beads: [],
		beadQ: 300,
		beadsAtATime: 100,
		beadCounter: 0,
		beadsOnStage: [],
		beadRadius: 5,
		beadLoopingQ: 0,
		Init: function(){
			window.onresize = this.resizeHandler.bind(this);
			this.addBeadsHandler = this.addBeadsHandler.bind(this)
	        this.gv.animate = true;
	        this.gv.canvasWidth = this.utils.returnCanvasWidth();
	        this.gv.canvasHeight = this.utils.returnCanvasHeight();
	        this.gv.halfHeight = this.gv.canvasHeight / 2;
	        this.gv.halfWidth = this.gv.canvasWidth / 2;
	        this.gv.stage = new PIXI.Container(); 
	        this.gv.renderer = PIXI.autoDetectRenderer(this.gv.canvasWidth, this.gv.canvasHeight);
	        this.gv.renderer.backgroundColor = 0x333333;
	        canvas.appendChild(this.gv.renderer.view);
	        this.gv.webGL = (this.gv.renderer instanceof PIXI.CanvasRenderer) ? false : true;
			this.gv.stage.addChild(this.backgroundContainer);
			this.gv.stage.addChild(this.foregroundContainer);
			this.rainbowShake = this.rainbowShake.bind(this);
			this.shakeAllow = true;

			for(let j = 0; j < this.beadQ; j++){
				let b = this.Bead();
				this.beads.push(b)
			}

	        this.app.ticker.add(this.animate.bind(this));
	        this.resizeHandler();
	        this.rainbowShake();
	    },
	    Stop: function () {
	        this.app.ticker.remove(this.animate.bind(this));
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
			let width =  this.utils.returnCanvasWidth();
			let height = this.utils.returnCanvasHeight();
			this.gv.renderer.resize(width, height)
			this.buildBoard(this.backgroundContainer);
		},
		buildBoard: function(){
			let dot = new PIXI.Graphics(),
			horizBoxesQ = 5,
		    vertBoxesQ = 5,
		    width =  this.utils.returnCanvasWidth(),
			height = this.utils.returnCanvasHeight(),
		    horizBoxesWidth = this.horizBoxesWidth = width/horizBoxesQ,
		    vertBoxesHeight = height/vertBoxesQ,
			block;
			this.backgroundContainer.removeChildren();
			this.pegQ = 0;
			this.pegs = [];
			for(let i = 0; i < horizBoxesQ; i++){
				for(let j = 0; j < vertBoxesQ; j++){
					block = new PIXI.Container();
					let cont = new PIXI.Container();
					block.cont= cont;
					block.addChild(cont)
					dot = new PIXI.Graphics();
					dot
					.beginFill(0xFF00FF)
					.lineStyle(2, 0xFFFFFF, 1)
					.moveTo(0,0)
					.lineTo(horizBoxesWidth, 0)
					.lineTo(horizBoxesWidth, vertBoxesHeight)
					.lineTo(0, vertBoxesHeight)
					.lineTo(0, 0).endFill();
					block.x = i*horizBoxesWidth + horizBoxesWidth/2;
					block.y = j*vertBoxesHeight + vertBoxesHeight/2;
					dot.radius = 10;
					block.graphic = dot;
					dot.pivot = new PIXI.Point(horizBoxesWidth/2, vertBoxesHeight/2);
					this.pegs.push(block)
					block.addChild(dot)
					this.backgroundContainer.addChild(block);
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
		animate: function (stage) {
			this.gv.renderer.render(this.gv.stage);
			let gravity = 0.03;
			let that = this;
			let bead;
			
			for(let i = 0; i < that.beadLoopingQ; i++){

					bead = that.beadsOnStage[i];
					if(bead && bead.parent){
						if(bead.vy > 8)bead.vy -=2;
						bead.y += bead.vy;
						bead.x += bead.vx;
						bead.vy += gravity;

						let globalPoint = bead.toGlobal(bead.parent, new PIXI.Point(bead.x, bead.y), false);
						if(globalPoint.y > this.gv.canvasHeight - bead.radius){
							bead.vy =-(Math.random()*3)-1;
						}

						if(globalPoint.x < 0 || globalPoint.x > that.width) {
								bead.parent.removeChild(bead);
								that.beadsOnStage.splice(i, 1);
						}
					}
					
			}
				
			
		}
	}

}

