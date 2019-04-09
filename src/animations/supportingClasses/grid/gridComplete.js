import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
export default {
	utils: Utils,
	init: function () {
		this.root = this.utils.root;
		this.addButton = this.addButton.bind(this)
        this.uponNewBoardButtonPress = this.uponNewBoardButtonPress.bind(this)
        return this;
	},
	boardComplete: function () {
        setTimeout(this.addButton, Config.boardCompleteButtonAppearDelay);
    },
    addButton: function () {

        if (!this.nextMazeButton) {
            this.nextMazeButton = Assets.Sprite("nextMaze.png");
            this.nextMazeButton.anchor.set(0.5)
            this.nextMazeButton.x = this.utils.canvasWidth / 2;
            this.nextMazeButton.y = this.utils.canvasHeight / 2;
            this.nextMazeButton.interactive = this.nextMazeButton.buttonMode = true;
            this.nextMazeButton.on('pointerdown',this.uponNewBoardButtonPress);
        }
        this.root.stage.addChild(this.nextMazeButton)

        this.root.activeAction.vx = this.root.activeAction.vy = 0;
        this.root.keyHandler.removeFromStage();
    },
    uponNewBoardButtonPress: function (e) {
        this.root.stage.removeChild(this.nextMazeButton)
        this.root.grid.nextBoard();
        this.root.levelSlots.reset();
        this.root.keyHandler.addToStage();  
        this.loadNewBoard();
    },
    loadNewBoard: function () {
        this.root.getDatabaseData();
    }
}