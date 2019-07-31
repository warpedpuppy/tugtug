import Utils from '../../../utils/utils';
export default function () {
	return {
		utils: Utils,
		// spearHit: function (spear) {
		// 	let globalPoint1 = this.utils.root.grid.gridBuild.cont.toGlobal(spear);
		// 	let c1 = {
		// 		x: Math.floor(globalPoint1.x),
		// 		y: Math.floor(globalPoint1.y),
		// 		radius: 10
		// 	}
		// 	let c2 = {
		// 		x: this.utils.canvasWidth / 2,
		// 		y: this.utils.canvasHeight / 2,
		// 		radius: 10
		// 	}
			
		// 	let x = this.utils.circleToCircleCollisionDetection(c1, c2);
		// 	//console.log(Math.floor(spear.x), Math.floor(spear.y))
		// 	return x[0];
		// },
		hit: function () {
			if (this.health < 0) { 
				this.body.alpha = 0;
				this.spear.alpha = 0;
			} else {
			  this.health --;
			}
		},
		setVars: function (soldiers, spears, gridBuild) {
			this.soldiers = soldiers;
			this.spears = spears;
			this.grid = gridBuild;
		},
		animate: function () {
		
			this.onScreenSoldiers = [];
			for (let i = 0; i < this.soldiers.length; i ++) {
				let s = this.soldiers[i];
				
				let onScreen = s.classRef.animate();
				if (onScreen) {
					this.onScreenSoldiers.push(s);

					//let spear = this.spears[i];
					
					// if (spear.visible && this.spearHit(spear)) {
					// 	spear.classRef.disable();
					// 	this.utils.root.score.gridWeaponHit();		
					// } else if (!spear.visible) {
					// 	spear.classRef.counter ++;
					// 	if (spear.classRef.counter == spear.classRef.counterLimit) {
					// 		spear.classRef.reenable();
					// 	}
					// }

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