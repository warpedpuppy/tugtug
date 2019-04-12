import Utils from '../../utils/utils';
import Assets from '../../utils/assetCreation';
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
		init: function (parentCont) {
			this.parentCont = parentCont;
			this.spritesheet = this.utils.spritesheet;
			this.buildHero();
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
			let s = Assets.Sprite(this.grimace);
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
		buildHero: function () {

			let feet = [
				Assets.Texture('walk1.png'),
				Assets.Texture('walk2.png'),
				Assets.Texture('walk3.png'),
				Assets.Texture('walk2.png')
			];
			let walking = Assets.AnimatedSprite(feet);
			walking.animationSpeed = 0.1;
			walking.play();

			this.feet = walking;
			this.feet.anchor.set(0.5)
			this.cont.addChild(this.feet);

			let body = Assets.Sprite('jumpBody.png');
			body.scale.set(0.75);
			body.anchor.set(0.5)
			body.y = -40;
			this.body = body;
			this.cont.addChild(body);


			let leftEye = this.leftEye = this.smileyEye();
			let rightEye = this.rightEye = this.smileyEye();
			leftEye.x = -15;
			leftEye.y = rightEye.y = -45;
			rightEye.x = 15;
			this.cont.addChild(leftEye);
			this.cont.addChild(rightEye);

			this.mouth = this.cont.mouth = this.smileyMouth();
			this.mouth.y = -25;
			this.cont.addChild(this.mouth);

			this.grimaceMouth();

		},
		addToStage: function () {
			console.log('add hero jump to stage')
			this.parentCont.addChild(this.cont);
		},
		removeFromStage: function () {
			this.parentCont.removeChild(this.cont);
		},
		resize: function () {

		}
	}
}