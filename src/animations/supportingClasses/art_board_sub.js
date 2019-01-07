import {API_BASE_URL} from '../../config';
import axios from 'axios';
import * as PIXI from 'pixi.js';
import Utils from '../utils/utils';
export default function() {
	return {
    	boardWidth: 500,
    	boardHeight: 500,
    	drag: false,
		chosenColor: 0x000000,
		offsetX: 0,
		offsetY: 0,
		storeColors: {},
		dotSize: 10,
		primary: false,
		edited: false,
		init: function (fake) {
			this.utils = Utils();

			this.lsToken = localStorage.getItem('token');
	        this.canvasWidth = this.width;

	        this.artBoard = new PIXI.Container();
	        //this.pixelCont = new PIXI.Container(); 
	        this.mouseListen = new PIXI.Container(); 
	      
			this.height = this.utils.returnCanvasHeight();
			this.halfWidth = this.width/2;
			this.halfHeight = this.height/2;


			this.artBoard.addChild(this.mouseListen);
			//this.artBoard.addChild(this.pixelCont);
			let s = new PIXI.Graphics();
			s.beginFill(0xFFFF00).drawRect(0,0,this.boardWidth,this.boardHeight).endFill();
			s.alpha = 0.5;
			this.mouseListen.addChild(s);

			if (fake) {
				for(let i = 0; i < this.boardHeight; i += this.dotSize) {
					for(let j = 0; j < this.boardWidth; j += this.dotSize) {
						let n = new PIXI.Graphics();
						n.beginFill(this.utils.randomColor()).drawRect(0,0,10,10).endFill();
						n.x = j;
						n.y = i;
						
						this.artBoard.addChild(n); 
					}
				}
			}
			this.artBoard.cacheAsBitmap = true;

			this.s = s;
			this.loadData();

		},
		assignStage: function (stage) {
			this.stage = stage;
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
		mouseOverHandler: function (e) {
		},
		mouseOutHandler: function (e) {
			//console.log("out")
			this.drag = false;
		},
		mouseDownHandler: function (e) {
			//console.log("down")
			this.drag = true;
			
			this.drawPoint(e);
		},
		mouseUpHandler: function () {
			//console.log("up")
			this.drag = false;
			//this.s.pointerup = null;
		},
		mouseMoveHandler: function (e) {
			//console.log("move")
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
		loadData: function (obj) {

				axios.post(`${API_BASE_URL}/store/artBoardData`, obj, { headers: {"Authorization" : `Bearer ${this.lsToken}`} })
				.then(result => {
					//console.log("result from load artboard call ", result.data.board)
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
		    return axios.post(`${API_BASE_URL}/store/artBoard`, this.storeColors,{ headers: {"Authorization" : `Bearer ${this.lsToken}`} })
		    .then(response => {
		     	 console.log(response);
		    })
		    .catch(err => {
		       console.error(err)
		    });  

		},
		editMode: function (boolean){

				if(!this.edited){
					this.edited = true;
					this.s.interactive = boolean;
					this.s.buttonMode = boolean;
					this.mouseOverHandler = this.mouseOverHandler.bind(this);
				    this.mouseOutHandler = this.mouseOutHandler.bind(this);
				    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
				    this.drawPoint = this.drawPoint.bind(this);
				    this.mouseDownHandler = this.mouseDownHandler.bind(this);
				    this.mouseUpHandler = this.mouseUpHandler.bind(this);
				}
				
				if(boolean){
					this.s.mouseover = this.mouseOverHandler;
					this.s.mouseout = this.mouseOutHandler;
					this.s.pointerdown = this.mouseDownHandler;
					this.s.pointerup = this.mouseUpHandler;
					this.s.mousemove = this.mouseMoveHandler;
					this.artBoard.cacheAsBitmap = false;
				} else if (!boolean) {
					this.s.mouseover = undefined;
					this.s.mouseout = undefined;
					this.s.pointerdown = undefined;
					this.s.pointerup = undefined;
					this.s.mousemove = undefined;
					this.sendToServer();
					this.artBoard.cacheAsBitmap = true;
				}
		}
	}
}