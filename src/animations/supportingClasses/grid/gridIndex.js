import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import SpaceShip from '../jump/spaceShip.js';
import Config from '../../animationsConfig';
import TransitionItems from './items/transition/transitionItems';
import Treasure from './items/treasure/treasure';
import MagicPills from './items/magic/magicPills';
import GridBuild from './gridBuild';
import GridAction from './gridAction';
export default {
		//cont: Assets.ParticleContainer(10000),
		blockWidth: 0,
		blockHeight: 0,
		blocks: {},
		utils: Utils,
		colQ: 4,
		rowQ: 10,
		buffer: 10,
		pause: true,
		tokens: [],
		tokenData: {},
		freeSpaces: [],
		coveredSpaces: [],
		boards: [],
		currentBoard: 0,
		blockPool: [],
		spaceShip: {},
		wallHit: 0,
		transitionItems: TransitionItems(),
		magicPills: MagicPills(),
		treasure: Treasure(),
		transitionItemsArray: [],
		treasureChests: [],
		magicPillsArray: [],
		itemLoopingQ: 0,
		soldiers: [],
		castles: [],
		spears: [],
		solderPerGridSquareQ: 1,
		gridAction: GridAction,
		gridBuild: GridBuild,
		init: function (parent) {



			this.blockWidth = Config[`${this.utils.root.activeMode}BlockSize`][0];
			this.blockHeight = Config[`${this.utils.root.activeMode}BlockSize`][1];

			this.spaceShip = SpaceShip().init()

			// for (let i = 0; i < 900; i ++) {
			// 	this.blockPool.push(Assets.Sprite())
			// }
			this.parent = parent;
			this.flyTexture = this.utils.spritesheet.textures['grassSquareSmall.png'];
			this.whiteSquare = this.utils.spritesheet.textures['whiteTile.png'];

			this.parent = parent;
			this.parentCont = parent.stage;
		

			//this.setLimits();

			this.boxCircles = [];
		
		
		    this.boards = parent.dbData.boards;
		    

		   this.magicPillsArray = this.magicPills.init();

            this.treasureChests = this.treasure.init();

            this.transitionItemsArray = this.transitionItems.init(
                this.utils.root.mode, 
                this.utils.root.stage, 
                this.utils.root.switchPlayer.bind(this.utils.root)).build();

		    //this.buildGrid(this.boards[this.currentBoard]);

		  //   this.itemLoopingQ = Math.max(this.magicPillsArray.length, this.transitionItemsArray.length, this.treasureChests.length)
		

		  //   this.heroCollisionDetector = {
				// 	x: this.utils.canvasWidth / 2,
				// 	y: this.utils.canvasHeight / 2,
				// 	radius: 10
				// }

			this.gridBuild = GridBuild.init(
				this.magicPillsArray,
				this.treasureChests,
				this.transitionItemsArray, 
				this.spaceShip)
			GridAction.init(this.magicPillsArray,this.transitionItemsArray,this.treasureChests)

			this.setAction = this.setAction.bind(this);
		    this.nextBoard = this.nextBoard.bind(this);
		    this.cont = this.gridBuild.cont;
		    GridAction.pause = false;

		},
		changeGridSize: function(w, h){
			if(w === this.blockWidth && h === this.blockHeight)return
			this.blockWidth = w;
			this.blockHeight = h;
			this.cont.removeChildren();
			this.gridBuild.buildGrid(this.boards[this.currentBoard]);
		},
		nextBoard: function () {
			//GridAction.pause = true;
			this.gridBuild.currentBoard = this.gridBuild.boards.length - 1;
			this.cont.removeChildren();
			this.gridBuild.blocks = {};
			console.log("next board")
			this.gridBuild.buildGrid(this.gridBuild.boards[this.gridBuild.currentBoard]);
			GridAction.setAction(this.parent.activeAction, this.parent.activeMode);

		},
		addNewBoardData: function (newData) {
			if(newData.boards){
				console.log("new data", newData)
				this.boards.push(newData.boards);
				console.log(this.boards)
			} else {
				console.log("just use old one")
			}
			
		},
		setAction: function (action, mode) {
			console.log(this)
			this.action = action;
			this.gridBuild.changeBackground(mode)
		},
		addToStage: function (index) {
			console.log("grid init add to stage", this.gridBuild)
			//this.gridBuild.addToStage();

			this.parentCont.addChildAt(this.gridBuild.cont, index)
		},
		removeFromStage: function () {
			//this.parentCont.removeChild(this.cont)
		},
		resize: function () {
			this.setLimits();
		},
		animate: function () {
			GridAction.animate(this.utils.root.activeAction.vx, this.utils.root.activeAction.vy)
		}
}