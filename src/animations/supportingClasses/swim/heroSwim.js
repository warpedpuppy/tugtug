import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
export default function () {
	return {
		cont: Assets.Container(),
		dists: [0, 40, 35, 30, 23],
		airBubbles: [],
		fish: [],
		pos: [],
		utils: Utils,
		init: function (parentCont) {
			this.parentCont = parentCont;
			this.spritesheet = this.utils.spritesheet;
			this.segmentsQ = 5;
			this.finCont = Assets.Container();
			this.eyeCont = Assets.Container();
			this.headCont = Assets.Container();
			this.fishArray = [
				'headSegment.png', 
				'bodySegment1.png', 
				'bodySegment2.png', 
				'bodySegment3.png', 
				'bodySegment4.png', 
				'bodySegment5.png'];
			this.distTotal = 0;
			
			//AIR BUBBLES
			for(let i = 0; i < 4; i ++){
				let r = Assets.Sprite('gradientRing.png');
				r.anchor.set(0.5);
				r.scale.set(0);
				this.airBubbles.push(r);
			}
			this.cont.addChild(this.headCont);

			 for (let i = 0; i < this.segmentsQ; i++) {
				let segment = this.fishBodySegment(this.segmentHeight, 0xFFFF00, i, this.fishArray[i]);
				segment.scale.set(0.5);
                this.fish.push(segment);
                this.cont.addChildAt(segment, 0);
            }


            let rightFin = this.rightFin = Assets.Sprite('swimFin.png');
			this.rightFin.x =  20;
			rightFin.scale.set(0.5);
            this.rightFin.y = 15;
            rightFin.scale.x = -1;
			this.finCont.addChild(rightFin);
			
            let leftFin = this.leftFin = Assets.Sprite('swimFin.png');
			this.leftFin.x =  -20;
			leftFin.scale.set(0.5);
            leftFin.y = 15;
            this.finCont.addChild(leftFin);
            this.cont.addChildAt(this.finCont, 0);

            let rightEye = this.rightEye = Assets.Sprite('swimEye.png');
			rightEye.anchor.set(0.5);
			rightEye.scale.set(0.5);
            this.rightEye.x = 10;
			this.eyeCont.addChild(rightEye)
			
            let leftEye = this.leftEye = Assets.Sprite('swimEye.png');
            this.leftEye.x = -10;
			leftEye.anchor.set(0.5);
			leftEye.scale.set(0.5);
            this.eyeCont.addChild(leftEye);
            this.cont.addChild(this.eyeCont)

			
			this.cont.radius = 0;
			this.segments = this.fish;

			this.activeHero = this;
			
		},
		hit: function () {

		},
		fishBodySegment: function (radius, color, num, str) {
			let cont = Assets.Container();
            cont.radius = radius;
            cont.height = cont.radius * 4;
            cont.vx = 0;
            cont.vy = 0;
            cont.xpos = 0;
            cont.ypos = 0;

 
            let b = Assets.Sprite(str);
            this.fishRadius = b.width / 2;
            let scale = 1 - (num * 0.1);
            b.scale.set(scale);
            this.distTotal += this.dists[num];
            b.y = this.distTotal;
		    b.anchor.set(0.5);
            cont.addChild(b);
            cont.body = b;
            if (num === this.segmentsQ - 1) {
               let tail = this.tail = Assets.Sprite('bodySegmentTail.png');
               this.tail.anchor.x = 0.5;

               tail.y = b.y + (b.height / 2) - 10;
               cont.addChildAt(tail, 0);
            }
            
            return cont;
		},
		addToStage: function () {
			this.cont.x = this.utils.canvasWidth / 2;
            this.cont.y = this.utils.canvasHeight / 2;
			this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont);
		},
		resize: function () {
			this.cont.x = this.utils.canvasWidth / 2;
            this.cont.y = this.utils.canvasHeight / 2;
		},
		animate: function () {

		}
	}
}