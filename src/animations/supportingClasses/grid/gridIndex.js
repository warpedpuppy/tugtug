import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import TransitionItems from './items/transition/transitionItems';
import Treasure from './items/treasure/treasure';
import MagicPills from './items/magic/magicPills';
import GridBuild from './gridBuild';
import GridAction from './gridAction';
import GridComplete from './gridComplete';
export default {
		blockWidth: 0,
		blockHeight: 0,
		blocks: {},
		utils: Utils,
		boards: [],
		currentBoard: 0,
		transitionItems: TransitionItems(),
		magicPills: MagicPills(),
		treasure: Treasure(),
		transitionItemsArray: [],
		treasureChests: [],
		magicPillsArray: [],
		gridAction: GridAction,
		gridBuild: GridBuild,
		init: function () {

			this.parent = this.utils.root;
			this.parentCont = this.parent.stage;

			this.blockWidth = Config[`${this.parent.activeMode}BlockSize`][0];
			this.blockHeight = Config[`${this.parent.activeMode}BlockSize`][1];

			this.flyTexture = this.utils.spritesheet.textures['grassSquareSmall.png'];
			this.whiteSquare = this.utils.spritesheet.textures['whiteTile.png'];

		    this.boards = this.parent.dbData.boards;
		    
		    this.magicPillsArray = this.magicPills.init();

            this.treasureChests = this.treasure.init();

            this.transitionItemsArray = this.transitionItems.init().build();

			this.gridBuild = GridBuild.init();


			this.gridAction.init(this.magicPillsArray,this.transitionItemsArray,this.treasureChests)

			this.gridComplete = GridComplete.init();

			//this.setAction = this.setAction.bind(this);
		    this.nextBoard = this.nextBoard.bind(this);
		    this.cont = this.gridBuild.cont;
		    GridAction.pause = false;

		},
		changeGridSize: function(){

			let w = Config[`${this.parent.activeMode}BlockSize`][0];
			let h = Config[`${this.parent.activeMode}BlockSize`][1];

			if(w === this.blockWidth && h === this.blockHeight)return
			this.blockWidth = w;
			this.blockHeight = h;

			
			this.cont.removeChildren();
			this.gridBuild.buildGrid(this.boards[this.currentBoard]);
		},
		nextBoard: function () {
			this.gridBuild.currentBoard = this.boards.length - 1;
			this.cont.removeChildren();
			this.gridBuild.blocks = {};
			this.gridBuild.buildGrid(this.boards[this.gridBuild.currentBoard]);
			this.gridAction.setAction();
		},
		addNewBoardData: function (newData) {
			if(newData.boards){
				//console.log("new data", newData)
				this.boards.push(newData.boards);
				//console.log(this.boards)
			} else {
				//console.log("just use old one")
			}
			
		},
		addToStage: function (index) {
			this.parentCont.addChildAt(this.gridBuild.cont, index)
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.gridBuild.cont)
		},
		resize: function () {
			this.gridAction.setLimits();
		},
		animate: function () {
			GridAction.animate(this.utils.root.activeAction.vx, this.utils.root.activeAction.vy)
		}
}