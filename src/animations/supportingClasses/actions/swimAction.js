import Utils from '../../utils/utils';
export default function () {
	return {
		mode: undefined,
		radius: 0,
		storeRadius: 0,
		spinning: false,
		utils: Utils,
		vx: 0,
		vy: 0,
		init: function (hero, mode) {
			this.hero = hero;
			this.mode = mode;
			this.vx = this.utils.randomNumberBetween(1,2); 
            this.vy = this.utils.randomNumberBetween(1,2);
		},
		resize: function (wh) {
			this.canvasWidth = wh.canvasWidth;
			this.canvasHeight = wh.canvasHeight;
		},
		switchMode: function(mode) {
			this.mode = mode;
		},
		rotate: function (obj) {
				this.vx = -obj.vx;
				this.vy = -obj.vy;
		},
		animate: function () {
			if(!this.spinning){
				this.radius = this.utils.cosWave(this.storeRadius, 0.15, 0.01);
			}
				

	        this.hero.pos.push(this.radius);
	        this.increment = 5;
	        let maxLength = this.increment * this.hero.segmentsQ;

	        if (this.hero.pos.length > maxLength) {
	            this.hero.pos = this.hero.pos.slice(-maxLength);
	        }

	        this.hero.segments[0].rotation = this.radius;


	        for (let i = 1; i < this.hero.segmentsQ; i++) {
	            let index = this.hero.pos.length - (i * this.increment);
	            if (this.hero.pos.length >= index) {
	              //console.log(this.pos[index]);
	              this.hero.segments[i].rotation = this.hero.pos[index];
	            }
	        }

	        if(this.mode === 'fly'){
	        	this.hero.wingCont.rotation = this.storeRadius;
	        	this.hero.leftWing.rotation = this.utils.deg2rad(this.utils.cosWave(0, 20, 0.004));
	        	this.hero.rightWing.rotation = this.utils.deg2rad(this.utils.cosWave(0, -20, 0.004));
	        }

		}
	}
}