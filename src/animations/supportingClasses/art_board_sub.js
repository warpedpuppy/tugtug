import {API_BASE_URL} from '../../config';
import axios from 'axios';
export default function(utils, PIXI) {
	return {
		utils: utils,
    	boardWidth: 500,
    	boardHeight: 500,
    	drag: false,
		chosenColor: 0x000000,
		offsetX: 0,
		offsetY: 0,
		storeColors: {},
		dotSize: 10,
		init: function () {

			this.lsToken = localStorage.getItem('token');
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
			s.beginFill(0x00FF00).drawRect(0,0,this.boardWidth,this.boardHeight).endFill();
			s.alpha = 0.5;
			this.mouseListen.addChild(s);

			this.mouseOverHandler = this.mouseOverHandler.bind(this);
			this.mouseOutHandler = this.mouseOutHandler.bind(this);
			this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
			this.drawPoint = this.drawPoint.bind(this);
			this.mouseDownHandler = this.mouseDownHandler.bind(this);
			this.mouseUpHandler = this.mouseUpHandler.bind(this);

			
			this.s = s;
			this.loadData();

		},
		assignStage: function (stage) {
			this.stage = stage;
			console.log(stage)
		},		
		returnArtBoard: function () {
			return this.artBoard;
		},
		setOffsets: function (x,y) {
			this.offsetX = x;
			this.offsetY = y;
		},	
		changeColor: function (color) {
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
		mouseOutHandler: function (e) {
			this.drag = false;
		},
		mouseDownHandler: function (e) {
			this.drag = true;
			this.s.pointerup = this.mouseUpHandler;
			this.drawPoint(e);
		},
		mouseUpHandler: function () {
			this.drag = false;
			this.s.pointerup = null;
		},
		mouseMoveHandler: function (e) {
			this.drawPoint(e);
		},
		drawPoint: function (e) {
			if (this.drag) {
				this.x = Math.floor(e.data.global.x);
				this.y = Math.floor(e.data.global.y);
				let n = new PIXI.Graphics();
				
				let fromPoint = new PIXI.Point(this.x, this.y);
				let localPoint = this.artBoard.toLocal(fromPoint, this.stage, undefined, true);
				n.beginFill(this.chosenColor).drawRect(0,0,10,10).endFill();
				n.x = Math.floor(localPoint.x / 10) * 10;
				n.y = Math.floor(localPoint.y / 10) * 10;
				this.artBoard.addChild(n);

				this.storeColors[`${n.x}_${n.y}`] = this.chosenColor;

				
			}
		},
		loadData: function () {

				axios.get(`${API_BASE_URL}/store/artBoard`,{ headers: {"Authorization" : `Bearer ${this.lsToken}`} })
				.then(result => {
					console.log(result.data.board)
					if(result.data.board){
						for (let key in result.data.board[0]){
							// console.log(key+" ) "+ result.data.board[0][key])
							let tempArray = key.split("_");
							let x = tempArray[0];
							let y = tempArray[1];
							let n = new PIXI.Graphics();
							n.beginFill(result.data.board[0][key]).drawRect(0,0,10,10).endFill();
							n.x = tempArray[0];
							n.y = tempArray[1];
							this.storeColors[`${n.x}_${n.y}`] = result.data.board[0][key];
							this.artBoard.addChild(n);

						}
						this.artBoard.cacheAsBitmap = true;
					}
				
				})
				.catch(err => {
					console.error(err)
				})

		},
		sendToServer: function () {
		    console.log('send to server')
			
		    return axios.post(`${API_BASE_URL}/store/artBoard`, this.storeColors,{ headers: {"Authorization" : `Bearer ${this.lsToken}`} })
		    .then(response => {
		     	 console.log(response);
		    })
		    .catch(err => {
		       console.error(err)
		    });  

		},
		editMode: function (boolean){
			this.s.interactive = boolean;
			this.s.buttonMode = boolean;
			if(boolean){
				this.s.mouseover = this.mouseOverHandler;
				this.s.mouseout = this.mouseOutHandler;
				this.s.mouseout = this.mouseOutHandler;

				//uncache artboard
				this.artBoard.cacheAsBitmap = false;
			} else if (!boolean) {
				this.s.mouseover = undefined;
				this.s.mouseout = undefined;
				this.s.mousemove = this.s.pointerdown = undefined;
				this.sendToServer();

				//cache artboard
				this.artBoard.cacheAsBitmap = true;
			}

		}


	}
}