export default function(utils, PIXI) {
	return {
		utils: utils,
    	width: 1000,
    	height:300,
    	drag: false,
		chosenColor: 0x000000,
		offsetX: 0,
		offsetY: 0,
		init: function () {
	        this.canvasWidth = this.width;//this.utils.returnCanvasWidth();
	        this.artBoard = new PIXI.Container();
	        this.pixelCont = new PIXI.Container(); 
	        this.mouseListen = new PIXI.Container(); 
	      
			this.height = this.utils.returnCanvasHeight();
			this.halfWidth = this.width/2;
			this.halfHeight = this.height/2;


			this.artBoard.addChild(this.mouseListen);
			this.artBoard.addChild(this.pixelCont);
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


		},
		returnArtBoard: function () {
			return this.artBoard;
		},
		setOffsets: function (x,y) {
			this.offsetX = x;
			this.offsetY = y;
		},	
		changeColor: function (color) {
			console.log('change to '+color);
			if(color){
				let convert = '0x' + color.substr(1);
				this.chosenColor = convert;
			}
		
		},
		mouseOverHandler: function () {
			this.s.mousemove = this.mouseMoveHandler;
			this.s.pointerdown = this.mouseDownHandler;
			// document.getElementById('results2').innerHTML = `over`;
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

				// let x = this.x = Math.floor(e.data.global.x);
				// let y =  this.y = Math.floor(e.data.global.y);
				let n = new PIXI.Graphics();
				n.beginFill(this.chosenColor).drawRect(0,0,10,10).endFill();
				n.x = (Math.floor(this.x / 10) * 10) - this.offsetX;
				n.y = Math.floor(this.y / 10) * 10 - this.offsetY;
				this.artBoard.addChild(n);
				// document.getElementById('results2').innerHTML = `${x} by ${y}`;
				//console.log(`${x} by ${y}`)
			}
			
		},
		mouseOutHandler: function () {
			this.s.mousemove = this.s.pointerdown = undefined;
			// document.getElementById('results2').innerHTML = `out`;
		}


	}
}