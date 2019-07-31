import Utils from '../../../utils/utils';
import Tweens from '../../../utils/Tweens';
import Config from '../../../animationsConfig';

export default function GridItems () {
	return {
		utils: Utils,
		placeItems: function (array, isTransitionItem) {
			if(!array)return;
			let gridBuild = this.utils.root.grid.gridBuild;
			array.forEach((item, index) => {
				if (!gridBuild.freeSpaces.length) return;

				if (isTransitionItem) {
					if (item.name === this.utils.root.activeMode) {
						if (this.utils.root.activeMode === "fly") {
							item.texture = this.utils.spritesheet.textures["swimTrans.png"];
							item.name = "swim";
						} else if (this.utils.root.activeMode === "swim") {
							item.texture = this.utils.spritesheet.textures["flyTrans.png"];
							item.name = "fly";
						}
					}
				}

				item.hit = false;
				let i = Math.floor(Math.random()*gridBuild.freeSpaces.length);
				item.x = gridBuild.freeSpaces[i][0] + gridBuild.blockWidth / 2;
				item.y = gridBuild.freeSpaces[i][1] + gridBuild.blockHeight / 2;
				item.storeScaleX = item.scale.x;
				item.storeScaleY = item.scale.y;
				item.counter = 0;
            	item.counterLimit = this.utils.randomIntBetween(Config.itemLifeSpan[0], Config.itemLifeSpan[1]);
            	//item.isTweening = false;
				//this.freeSpaces.push([b.x, b.y, b, i, j]);
				item.currentSpace = gridBuild.freeSpaces[i];
				gridBuild.freeSpaces.splice(i, 1);
				gridBuild.cont.addChild(item);
			})
		},
		moveItem1: function (item) {
			item.hit = true;
			Tweens.tween(item.scale, 1, 
				{
					x: [item.scale.x,0], 
					y: [item.scale.y,0]
				}, 
				this.moveItem2.bind(this, item), 
				'easeOutBounce'
				)
			
		},
		moveItem2: function (item) {
			Tweens.tween(item.scale, 1, 
				{
					x: [0,item.storeScaleX], 
					y: [0,item.storeScaleY]
				}, 
				this.moveItem3.bind(this, item), 
				'easeOutBounce'
				)

			let gridBuild = this.utils.root.grid.gridBuild;
			gridBuild.freeSpaces.push(item.currentSpace);


			//get new space for item
			let i = Math.floor(Math.random() * gridBuild.freeSpaces.length);
			item.x = gridBuild.freeSpaces[i][0] + gridBuild.blockWidth / 2;
			item.y = gridBuild.freeSpaces[i][1] + gridBuild.blockHeight / 2;
			item.currentSpace = gridBuild.freeSpaces[i];
			gridBuild.freeSpaces.splice(i, 1);
			//this.cont.addChild(item);
			
		},
		moveItem3: function (item) {
			//alert("reset")
			item.hit = false;
			item.counter = 0;
			item.isTweening = false;
			
		},
	}
}