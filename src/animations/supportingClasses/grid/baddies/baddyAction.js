import Assets from '../../../utils/assetCreation';
import Utils from '../../../utils/utils';
import Config from '../../../animationsConfig';
export default function (soldiers, spears, gridBuild) {
	return {
		soldiers: soldiers,
		spears: spears,
		utils: Utils,
		spearHit: function (spear) {
			let globalPoint1 = gridBuild.cont.toGlobal(spear);
			let c1 = {
				x: globalPoint1.x,
				y: globalPoint1.y,
				radius: 10
			}
			let c2 = {
				x: this.utils.canvasWidth / 2,
				y: this.utils.canvasHeight / 2,
				radius: 10
			}
			let x = this.utils.circleToCircleCollisionDetection(c1, c2);
			return x[0];
		},
		hit: function () {
			if (this.health < 0) { 
				this.body.alpha = 0;
				this.spear.alpha = 0;
			} else {
			  this.health --;
			}
		},
		animate: function () {
		
			//let onScreenSoldiers = [];
			for (let i = 0; i < this.soldiers.length; i ++) {
				let s = this.soldiers[i];
				
				let onScreen = s.classRef.animate();
				if (onScreen) {

					//onScreenSoldiers.push(onScreen);
					let sp = this.spears[i];
					if (this.spearHit(sp)) {
						//sp.classRef.reset();
						//alert("2")
						this.utils.root.score.decrease(10);
					};

					//prevent overlap
					for (let j = 0; j < this.soldiers.length; j ++) {
						let s2 = this.soldiers[j];
						if (s2.classRef.onScreen()) {
							let hit = this.utils.circleToCircleCollisionDetection(s, s2);
							if (hit[0]) {
								this.utils.adjustPositions(s, s2, hit[1]);
							}
						}
					}
				 }

			}

			
		}
	}
}