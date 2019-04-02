import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
import { TweenMax } from 'gsap';
export default function () {
	return {
		cont: Assets.Container(),
		w: 60,
		h: 14,
		spacer: 0,
		bounceQ: 10,
		blocks: [],
		utils: Utils,
		pos: {},
		counter: 0,
		counterLimit: 5,
		max: 0, 
		contractBoolean: true,
		expandBoolean: false,
		trigger: 100,
		gravity: 1.01,
		bounceAllow: false,
		blockQ: 5,
		bounceBlockIndex: 4, 
		doneCounter: 0,
		type:undefined,
		legStyle: 2,
		init: function (parentCont) {
			this.parentCont = parentCont;
			this.spritesheet = this.utils.spritesheet;
			this.buildReticulatedHero();
		},
		smileyEye: function () {
			let cont = Assets.Container();
			let eye = Assets.Sprite('jumpEye.png');
			eye.anchor.set(0.5);
			let pupil = Assets.Sprite('jumpPupil.png');
			pupil.anchor.set(0.5);
			cont.addChild(eye);
			cont.addChild(pupil);
			cont.pupil = pupil;
			return cont;

		},
		smileyMouth: function () {
			this.grimace = this.spritesheet.textures['grimace.png']
			let s = Assets.Sprite('smile.png');
			this.smile = this.spritesheet.textures['smile.png']
			s.anchor.set(0.5);
			s.scale.set(0.5);
			return s;
		},
		jumpMouth: function () {
			this.mouth.texture = this.smile;
		},
		grimaceMouth: function () {
			this.mouth.texture = this.grimace;
		},
		look: function (str) {
			if(str === 'right') {
				this.leftEye.pupil.x = 5;
				this.rightEye.pupil.x = 5;
				this.leftEye.pupil.y = 0;
				this.rightEye.pupil.y = 0;
				this.feet.scale.x = 1;
			} else if(str === 'left'){
				this.leftEye.pupil.x = -5;
				this.rightEye.pupil.x = -5;
				this.leftEye.pupil.y = 0;
				this.rightEye.pupil.y = 0;
				this.feet.scale.x = -1;
			} else if (str === 'up'){
				this.leftEye.pupil.x = 0;
				this.rightEye.pupil.x = 0;
				this.leftEye.pupil.y = -5;
				this.rightEye.pupil.y = -5;
			} else if (str === 'down') {
				this.leftEye.pupil.x -= 0;
				this.rightEye.pupil.x -= 0;
				this.leftEye.pupil.y += 5;
				this.rightEye.pupil.y += 5;
			} else {
				this.leftEye.pupil.x = 0;
				this.rightEye.pupil.x = 0;
				this.leftEye.pupil.y = 0;
				this.rightEye.pupil.y = 0;
			}
		},
		bounce: function (boolean) {
			if (boolean) {
				this.legStyle = 2;
				this.feet.texture = this.spritesheet.textures['bounceLegs2.png'];
			} else {
				this.legStyle = 1;
				this.feet.texture = this.spritesheet.textures['bounceLegs1.png'];
			}
			//TweenMax.to(this.cont, 0.5, {rotation: this.utils.deg2rad(360),onComplete: this.reset.bind(this)})
			this.bounceStart();
		},
		reset: function () {
			this.cont.rotation = 0;
		},
		bounceStart: function () {
			this.bounceAllow = true;
			this.blocks[4].active = true;
			this.doneCounter = 0;
			this.bounceBlockIndex = this.blocks.length - 1;
			for (let i = 0; i < this.blockQ; i ++) {
				let b = this.blocks[i];
				b.y = b.bottomY;
				b.vy = b.storeVY;

			}
		},
		buildReticulatedHero: function () {
			this.type = 'reticulated';
			this.feet = Assets.Sprite('bounceLegs1.png')
			this.feet.anchor.set(0.5)
			this.cont.addChild(this.feet);
			for(let i = 0; i < this.blockQ; i ++){
				let b;
				let num = i + 1;
				if(i < this.blockQ - 1){
					b = Assets.Sprite(`ball${num}.png`);
				} else {
					b = this.feet;
				}
				b.anchor.set(0.5);

				b.y = b.bottomY = i * (this.h + this.spacer);
				b.topY = i * this.h;
				b.bounceTop = b.y - this.bounceQ;
				if(i === 0)b.topY -= this.bounceQ;
				let distanceToTravel = this.bounceQ;
				let vy = distanceToTravel / 4;
				b.vy = b.storeVY = vy;
				this.blocks.push(b);
				this.cont.addChildAt(b, 0);
				//this.cont.y = -b.y;
			}
			let leftEye = this.leftEye = this.smileyEye();
			let rightEye = this.rightEye = this.smileyEye();
			leftEye.x = -15;
			leftEye.y = rightEye.y = 15;
			rightEye.x = 15;
			this.cont.addChild(leftEye);
			this.cont.addChild(rightEye);

			this.mouth = this.cont.mouth = this.smileyMouth();
			this.cont.addChild(this.mouth);
			this.mouth.y = 35 ;
			this.blocks[this.bounceBlockIndex].active = true;
			this.cont.pivot = Assets.Point( 0, this.cont.height /2)
			console.log("this cont height",this.cont.height)

		},
		bounceStyle2: function () {


			if (!this.bounceAllow) {
				return;
			}

			// console.log(this.blocks[1].y, this.blocks[1].bottomY)
			for(let i = 0; i < this.blockQ; i ++){
				let b = this.blocks[i];
				if (b.active) {
					b.y -= b.vy;
					if (b.y < b.bounceTop) {
						b.y = b.bounceTop;
						b.vy *= -1;
						//TRIGGER NEXT BRICK
						this.bounceBlockIndex --;
						if (this.bounceBlockIndex >= 0) {
							this.blocks[this.bounceBlockIndex].active = true;
						}

					} else if (b.y > b.bottomY) {
						b.y = b.bottomY;
						b.vy *= -1;
						b.active = false;
						this.doneCounter ++;
						if (this.doneCounter === this.blocks.length) {
							this.counter = 0;
							this.doneCounter = 0;
							this.bounceBlockIndex = this.blocks.length - 1;
							this.bounceAllow = false;
						}
					}
				}
				
			}
			

		},
		addToStage: function () {
			this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont);
		},
		resize: function () {

		},
		animate: function () {
			this.bounceStyle2();
		}
	}
}