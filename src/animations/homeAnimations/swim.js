import Utils from '../utils/utils';
import Assets from '../utils/assetCreation';
import Hero from '../supportingClasses/universal/hero';

export default function() {
    return {
        hero: Hero(),
        loader: Assets.Loader(),
        utils: Utils,
        radius: 0,
        storeRadius: 0,
        increment: 5,
        init: function () {
            this.buildGame = this.buildGame.bind(this);
            var app = this.app = Assets.Application(200,200,  true);
            document.getElementById('swim-home').appendChild(app.view);
            this.stage = app.stage;

            if (!this.loader.resources["/ss/ss.json"]) {
                 this.loader
                    .add("/ss/ss.json")
                    .load(this.buildGame)
            } else {
               this.buildGame();
            }

        },
        buildGame: function() {
            let spritesheet = this.loader.resources["/ss/ss.json"].spritesheet;
            this.utils.setProperties({
                spritesheet,
                app: this.app,
                root: this
            })
            this.hero.init(undefined, this.stage).switchPlayer("swim");
            this.hero.activeHero.cont.scale.set(0.75);
            this.hero.activeHero.cont.x = 100;
            this.hero.activeHero.cont.y = 50;
            this.stage.addChild(this.hero.activeHero.cont);
            this.app.ticker.add(this.animate.bind(this)); 
            this.maxLength = this.increment * this.hero.activeHero.segmentsQ;
        },
        animate: function () {
           
            this.hero.activeHero.eyeCont.rotation = this.radius;
			this.hero.activeHero.headCont.rotation = this.radius;
            
	        this.hero.pos.push(this.radius);

	        if (this.hero.pos.length > this.maxLength) {
	            this.hero.pos = this.hero.pos.slice(-this.maxLength);
	        }

	        for (let i = 1; i < this.hero.activeHero.segmentsQ; i++) {
                let index = this.hero.pos.length - (i * this.increment);

	            if (this.hero.pos.length >= index) {
                    this.hero.activeHero.segments[i].rotation = this.hero.pos[index];
	            }
            }
            this.radius = this.utils.cosWave(this.storeRadius, 0.15, 0.01);
            this.hero.activeHero.finCont.rotation = this.radius;
	        this.hero.activeHero.eyeCont.rotation = this.radius;
        },
        stop: function () {
            if(this.app)this.app.destroy(true);
        }
    }
}