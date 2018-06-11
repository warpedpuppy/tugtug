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
		shapes: [],
		blockForegrounds: [],
		blockBackgrounds: [],
		colors: [0x9400D3, 0x4B0082, 0x0000FF, 0x00FF00, 0xFFFF00, 0xFF7F00, 0xFF0000],
		Init: function(){
			window.onresize = this.resizeHandler.bind(this);
	        this.canvasWidth = this.utils.returnCanvasWidth();
	        this.stage = new PIXI.Container(); 
	        this.kingCont = new PIXI.Container(); 
	        this.renderer = PIXI.autoDetectRenderer(this.canvasWidth, this.canvasHeight);
	        this.renderer.backgroundColor = 0x333333;
	        canvas.appendChild(this.renderer.view);
	        this.webGL = (this.renderer instanceof PIXI.CanvasRenderer) ? false : true;
			this.stage.addChild(this.backgroundContainer);
			this.stage.addChild(this.foregroundContainer);
			this.width =  this.utils.returnCanvasWidth();
			this.height = this.utils.returnCanvasHeight();
			this.halfWidth = this.width/2;
			this.halfHeight = this.height/2;

			this.build = this.build.bind(this);

			if (!this.webGL) {
				console.log('this webgl = ', this.webGL)
				console.log('not webgl')
			}
			
			this.build();
			this.stage.addChild(this.kingCont);
	        this.app.ticker.add(this.animate.bind(this));
	       

	    },
	    Stop: function () {
	    	window.onresize = undefined;
	        this.app.ticker.destroy();
	    },
	    build: function () {
	    	let counter = 0;

	    	for(let i = 0; i < 7; i ++){
	    		let size = 100 + (i*120);
	    		let c = this.colors[counter];
	    		let shape = this.Ring(size, this.colors[counter]);

	    		this.kingCont.addChildAt(shape, 0);
	    		counter ++;
	    		this.shapes.push(shape);
	    		if(counter >= this.colors.length){
	    			counter = 0;
	    		}
	    	}



	    },
		Ring: function (sizeParam, color) {
			var size = sizeParam,
	    		innerSize,
		        x = sizeParam,
		        y = sizeParam,
		        points = [],
		        innerPoints = [];
		        innerSize = size * 0.75;

			points.push(x + size * Math.cos(0), y + size * Math.sin(0));
			innerPoints.push(x + innerSize * Math.cos(0), y + innerSize * Math.sin(0));
			
			for (let side = 0; side < 7; side++) {
				points.push(x + size * Math.cos(side * 2 * Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6));
				innerPoints.push(x + innerSize * Math.cos(side * 2 * Math.PI / 6), y + innerSize * Math.sin(side * 2 * Math.PI / 6));
			}

			let test = new PIXI.Graphics();
			test.beginFill(color);
			test.drawPolygon(points)
			test.drawPolygon(innerPoints)
			test.addHole();
			test.pivot.x = test.pivot.y = test.width/2;
			test.rotation = test.rot = this.utils.randomNumberBetween(0.0001, 0.005);
			if(Math.floor(Math.random()*2) > 0){
				test.rotation *=-1;
				test.rot *=-1;
			}
			return test;
		},
		resizeHandler: function (){
			this.width =  this.utils.returnCanvasWidth();
			this.height = this.canvasHeight = this.utils.returnCanvasHeight();
			this.renderer.resize(this.width, this.height);
			this.clear();

			
		},
		clear: function (){
		},
		displayFPS: function (fps) {
			document
			.getElementById('fpsChecker')
			.innerHTML = `current fps = ${Math.round(fps)}`;
		},
		animate: function () {
			this.renderer.render(this.stage);
			
			//this.displayFPS(this.app.ticker.FPS)
			

			for(let shape of this.shapes){
				shape.rotation += shape.rot;
			}
			
				
		}
	}

}

