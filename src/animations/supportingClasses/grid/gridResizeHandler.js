import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';

export default function GridResizeHandler() {
	return {
		utils: Utils,
		resize: function () {

			let gridBuild = this.utils.root.grid.gridBuild;
			
			 this.utils.root.grid.gridAction.pause = true;
			 this.utils.root.action = false;
		
			if (!gridBuild.calcResize) {
				gridBuild.calcResize = true;
				let block = this.utils.root.grid.gridAction.storeCurrent;
				gridBuild.saveI = block.i;
				gridBuild.saveJ = block.j;
			}


			gridBuild.cont.alpha = 0;
			window.clearTimeout(this.timeOut);
			this.timeOut = setTimeout(this.resized.bind(this), 200)

		},
		resized: function () {
			let gridBuild = this.utils.root.grid.gridBuild;
			
			gridBuild.calcResize = false;
			gridBuild.cont.alpha = 1;
			gridBuild.saveI++;
			gridBuild.saveJ++;
			let halfWidth = this.utils.canvasWidth / 2;
			let halfHeight = this.utils.canvasHeight / 2;
			gridBuild.cont.x = halfWidth - (gridBuild.saveJ * gridBuild.blockWidth) + (gridBuild.blockWidth / 2);
			gridBuild.cont.y = halfHeight - (gridBuild.saveI * gridBuild.blockHeight) + (gridBuild.blockHeight /2);

			this.utils.root.grid.gridAction.pause = false;
			this.utils.root.action = true;

			gridBuild.placeItems(gridBuild[`${this.utils.root.activeMode}TreasureChests`]);
			gridBuild.placeItems(gridBuild.magicPillsArray);

			window.clearTimeout(this.timeOut);
		},

	}
}