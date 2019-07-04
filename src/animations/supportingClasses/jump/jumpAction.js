import Utils from '../../utils/utils';
import dotAction from './jumpAction/jumpDotAction';
import gremlinAction from './jumpAction/jumpGremlinAction';
import orbAction from './jumpAction/jumpOrbAction';
export default function () {
	return {
		gravity: 0.3,
		speedLimit: 20,
		speed: 1,
		vy: 0,
		vx: 0.5,
		jumpTimer: 0,
		jumpTimeLimit: 21,
		utils: Utils,
		pause: false,
		init: function (stage) {
			this.hero = this.utils.hero;
			this.canvasWidth = this.utils.canvasWidth;
			this.canvasHeight = this.utils.canvasHeight;
			this.stage = stage;
			this.vx = this.speed;
		},
		rotate: function (str) {
			this.move(str);
		},
		jump: function () {
			this.vy = -6;
			this.jumpTimer = 1;
			//this.hero.heroJump.bounce();
			this.hero.heroJump.jumpMouth();
		},
		resize: function (wh){
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
		},
		move: function (str) {
			if(str === 'left'){
				this.vx = -this.speed;
				this.hero.heroJump.look('left');
			} else if (str === 'right'){
				 this.vx = this.speed;
				 this.hero.heroJump.look('right');
			} else {
				this.vx = 0;
			}
		},
		animate: function () {

			if(this.pause)return;

			// for(let i = 0; i < this.utils.root.jump.jumpBackground.orbsCont.length; i ++){
			// 	dotAction.animate(i);
			// 	gremlinAction.animate(i);
			// 	orbAction.animate(i);
			// }
			//this.hero.activeHero.cont.y = 
//this.hero.activeHero.floor = -this.currentOrb.background.width;
			console.log(this.hero.activeHero.cont.y, this.vy, this.hero.activeHero.floor)
			this.hero.cont.rotation += this.utils.deg2rad(this.vx);
			this.hero.activeHero.cont.y += this.vy;
			if(this.hero.activeHero.cont.y > this.hero.activeHero.floor) {
				this.hero.activeHero.cont.y = this.hero.activeHero.floor;
				this.vy = 0;
				this.hero.activeHero.grimaceMouth();
			} else if (this.hero.activeHero.cont.y < this.hero.activeHero.floor) {
				this.vy += this.gravity;
			}

		}
	}
}








