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
//import GridComplete from './gridComplete';
export default {
		blocks: {},
		utils: Utils,
		boards: [],
		currentBoard: 0,
		transitionItems: TransitionItems(),
		magicPills: MagicPills(),
		treasure: Treasure(),
		transitionItemsArray: [],
		flyTreasureChests: [],
		swimTreasureChests: [],
		magicPillsArray: [],
		gridAction: GridAction,
		gridBuild: GridBuild,
		boards: [],
		init: function () {

			this.parent = this.utils.root;

			this.parentCont = this.parent.stage;

		    //this.boards = this.parent.dbData.boards;
		    
		    this.magicPillsArray = this.magicPills.init();

		    this.treasure.init();

            this.flyTreasureChests = this.treasure.createAndReturnChests(Config.flyTreasureChestQ);

            this.swimTreasureChests = this.treasure.createAndReturnChests(Config.swimTreasureChestQ);

            this.transitionItemsArray = this.transitionItems.init().build();

			this.gridBuild.init();

			this.gridAction.init()

			//this.gridComplete = GridComplete.init();

		    this.nextBoard = this.nextBoard.bind(this);

		},
		clearGrid: function () {
			console.log('clear ', this.utils.root.activeMode)
			this.gridBuild[`${this.utils.root.activeMode}Baddies`].removeCastlesAndSoldiers();
		},
		changeGridSize: function(){

			let w = Config[`${this.parent.activeMode}BlockSize`][0];
			let h = Config[`${this.parent.activeMode}BlockSize`][1];
			
			this.gridBuild.blockWidth = w;
			this.gridBuild.blockHeight = h;

			this.gridBuild.cont.removeChildren();
			this.gridBuild.buildGrid(this.parent.dbData.boards[this.currentBoard]);

			this.gridAction.setLimits();
		},
		nextBoard: function () {
			
			//console.log('NEXT BOARD')
			this.gridBuild.tokens.forEach((item, index) => {
				item.placed = false;
			})
			//console.log(this.parent.dbData)
			this.gridBuild.currentBoard = this.boards.length - 1;
			this.gridBuild.cont.removeChildren();
			this.gridBuild.blocks = {};
			console.log(this.boards)
			this.gridBuild.buildGrid(this.boards[this.gridBuild.currentBoard]);
			this.gridBuild.resetBaddies();
			this.gridAction.setLimits();
		},
		addNewBoardData: function (newData) {
			// if (newData.boards) {
			// 	this.parent.dbData.boards.push(newData.boards);
			// } 
		},

		addToStage: function (index) {
			this.gridAction.pause = false;
			this.parentCont.addChildAt(this.gridBuild.cont, index)
		},
		removeFromStage: function () {
			this.gridAction.pause = true;
			this.parentCont.removeChild(this.gridBuild.cont)
		},
		resize: function () {
			this.gridBuild.resize();
			this.gridAction.setLimits();
		},
		animate: function () {
			this.gridAction.animate(this.utils.root.activeAction.vx, this.utils.root.activeAction.vy)
		}
}