export default function(Utils, PIXI) {
	return {
		utils: new Utils(),
    	app: new PIXI.Application(),
    	width: 1000,
    	height:300,
    	drag: false,
		chosenColor: 0x000000,
		init: function () {
			window.onresize = this.resizeHandler.bind(this);
	        this.canvasWidth = this.width;//this.utils.returnCanvasWidth();
	        this.stage = new PIXI.Container();
	        this.pixelCont = new PIXI.Container(); 
	        this.mouseListen = new PIXI.Container(); 
	        this.renderer = PIXI.autoDetectRenderer(1000, 300);
	        this.renderer.backgroundColor = 0xFF0000;
	        document.getElementById('art_board_canvas').appendChild(this.renderer.view);
	        this.webGL = (this.renderer instanceof PIXI.CanvasRenderer) ? false : true;
			this.width =  this.utils.returnCanvasWidth();
			this.height = this.utils.returnCanvasHeight();
			this.halfWidth = this.width/2;
			this.halfHeight = this.height/2;


			this.stage.addChild(this.mouseListen);
			this.stage.addChild(this.pixelCont);
			let s = new PIXI.Graphics();
			s.beginFill(0x00FF00).drawRect(0,0,1000,300).endFill();
			s.alpha = 0.5;
			this.mouseListen.addChild(s);

			this.mouseOverHandler = this.mouseOverHandler.bind(this);
			this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
			this.mouseOutHandler = this.mouseOutHandler.bind(this);
			this.mouseDownHandler = this.mouseDownHandler.bind(this);
			this.mouseUpHandler = this.mouseUpHandler.bind(this);


			s.interactive = true;
			s.buttonMode = true;
			s.mouseover = this.mouseOverHandler;
			s.mouseout = this.mouseOutHandler;
			this.s = s;

			if (!this.webGL) {
				console.log('this webgl = ', this.webGL)
				console.log('not webgl')
			} else {
				console.log('this webgl = ', this.webGL)
				console.log('webgl')
			}
			
	        this.app.ticker.add(this.animate.bind(this));
	        this.resizeHandler();

		},
		changeColor: function (color) {
			console.log('change to '+color.hex);
				console.log(color.hex)
		 	let convert = '0x' + color.hex.substr(1);
		 	console.log(convert)
			this.chosenColor = convert;
		},
		mouseOverHandler: function () {
			this.s.mousemove = this.mouseMoveHandler;
			this.s.pointerdown = this.mouseDownHandler;
			document.getElementById('results2').innerHTML = `over`;
		},
		mouseDownHandler: function () {
			this.drag = true;
			this.s.pointerup = this.mouseUpHandler;
		},
		mouseUpHandler: function () {
			this.drag = false;
			this.s.pointerup = null;
		},
		mouseMoveHandler: function (e) {
			if (this.drag) {
				let x = this.x = Math.floor(e.data.global.x);
				let y =  this.y = Math.floor(e.data.global.y);
				let n = new PIXI.Graphics();
				n.beginFill(this.chosenColor).drawRect(0,0,10,10).endFill();
				n.x = Math.floor(this.x / 10) * 10;
				n.y = Math.floor(this.y / 10) * 10;
				this.stage.addChild(n);
				document.getElementById('results2').innerHTML = `${x} by ${y}`;
			}
			
		},
		mouseOutHandler: function () {
			this.s.mousemove = this.s.pointerdown = undefined;
			document.getElementById('results2').innerHTML = `out`;
		},
		stop: function () {
			window.onresize = undefined;
	        this.app.ticker.destroy();
		},
		animate: function () {
			this.renderer.render(this.stage);
		},
		resizeHandler: function (){
			this.stage.removeChildren();
			this.width =  1000;//this.utils.returnCanvasWidth();
			this.height = 300;//this.canvasHeight = this.utils.returnCanvasHeight();
			this.renderer.resize(this.width, this.height);

			this.stage.addChild(this.mouseListen);
			
		}


	}
}