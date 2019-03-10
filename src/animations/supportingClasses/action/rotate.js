import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
export default {
		utils: Utils,
		config: Config,
        movementQ: 0.1,
		init: function (parentCont) {
		},
		rotate: function (str, activeAction) {
            // leaving this here for now because this really relates to the background current
            let returnObj = {};
            

            if (str === 'right') {
                this.idle = false;
                activeAction.radius += this.movementQ;
                this.velocity = this.utils.randomNumberBetween(
                    this.config.swimVelocities[0], 
                    this.config.swimVelocities[1]);
                this.vx = this.velocity * Math.sin(activeAction.radius);
                this.vy = -this.velocity * Math.cos(activeAction.radius);
                activeAction.storeRadius = activeAction.radius;
                returnObj = {vx: -this.vx, vy: -this.vy};
              
            } else if (str === 'left') {
                this.idle = false;
                activeAction.radius -= this.movementQ;
                this.velocity = this.utils.randomNumberBetween(
                    this.config.swimVelocities[0], 
                    this.config.swimVelocities[1]);
                this.vx = this.velocity * Math.sin(activeAction.radius);
                this.vy = -this.velocity * Math.cos(activeAction.radius);
                activeAction.storeRadius = activeAction.radius;
                returnObj = {vx: -this.vx, vy: -this.vy};
               
            }
            return returnObj;
        },
		addToStage: function () {

		},
		removeFromStage: function () {

		},
		resize: function () {

		},
		animate: function () {

		}
	
}