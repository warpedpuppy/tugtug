import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';

export default {
		utils: Utils,
		returnAbove: function (i,j) {
			let newi = (i - 1 >= 0)?(i - 1):undefined;
			let newj = j;
			
			if(newi !== undefined && newj !== undefined){
				return this.utils.root.grid.gridBuild.blocks[newi][newj];
			} else {
				return undefined;
			}
			
		},
		returnBelow: function (i,j) {
			let newi = (i + 1 < (this.utils.root.grid.gridBuild.rowQ))?(i + 1):undefined;
			let newj = j;

			if(newi !== undefined && newj !== undefined){
				return this.utils.root.grid.gridBuild.blocks[newi][newj];
			} else {
				return  undefined;
			}
		},
		returnLeft: function (i,j) {
			let newi = i;
			let newj = (j - 1 >= 0)?(j - 1):undefined;
			if(newi !== undefined && newj !== undefined){
				return this.utils.root.grid.gridBuild.blocks[newi][newj];
			} else {
				return  undefined;
			}
		},
		returnRight: function (i,j) {
			let newi = i;
			let newj = (j + 1 < (this.utils.root.grid.gridBuild.colQ))?(j + 1):undefined;
			
			if(newi !== undefined && newj !== undefined){
				return this.utils.root.grid.gridBuild.blocks[newi][newj];
			} else {
				return  undefined;
			}
		},
		assignAboveBelowRightLeftCovered: function () {
		
	        for (let i = 0; i < this.utils.root.grid.gridBuild.rowQ; i ++) {
	            for (let j = 0; j < this.utils.root.grid.gridBuild.colQ; j ++) {
	                
	                let above = this.returnAbove(i, j)
	                if(!above)continue
	                this.utils.root.grid.gridBuild.blocks[i][j].above = above;
	                this.utils.root.grid.gridBuild.blocks[i][j].aboveCovered = above.covered;
	               
	                let below = this.returnBelow(i, j)
	                if(!below)continue
	                this.utils.root.grid.gridBuild.blocks[i][j].below = below;
	                this.utils.root.grid.gridBuild.blocks[i][j].belowCovered = below.covered;
	                
	                let right = this.returnRight(i, j)
	                if(!right)continue
	                this.utils.root.grid.gridBuild.blocks[i][j].right = right;
	                this.utils.root.grid.gridBuild.blocks[i][j].rightCovered = right.covered;
	                
	                let left = this.returnLeft(i, j)
	                if(!left)continue
	                this.utils.root.grid.gridBuild.blocks[i][j].left = left;
	                this.utils.root.grid.gridBuild.blocks[i][j].leftCovered = left.covered;

	               // console.log(above, right, left, below)
	            }
	        }
		}
	
}