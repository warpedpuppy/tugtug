import Assets from '../../../../utils/assetCreation';
import Utils from '../../../../utils/utils';
// import Config from './animationsConfig';
export default function (){
	return {
	utils: Utils,
		cont: Assets.Container(),
		init: function () {
		},
		addToStage: function () {

		},
		removeFromStage: function () {

		},
		buildGremlin: function (height) {

			let cont = Assets.Container();
			
			let bodyCont = Assets.Container();
			bodyCont.y = -height / 2;
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
			bodyCont.addChild(this.feet);

			let body = Assets.Sprite('transparentRing.png');
			body.scale.set(0.25);
			body.anchor.set(0.5)
			body.y = -30;
			this.body = body;
			cont.body = body;
			bodyCont.addChild(body);


			let leftEye = this.leftEye = this.smileyEye();
			let rightEye = this.rightEye = this.smileyEye();
			leftEye.x = -15;
			leftEye.y = rightEye.y = -45;
			rightEye.x = 15;
			bodyCont.addChild(leftEye);
			bodyCont.addChild(rightEye);

			this.mouth = this.cont.mouth = this.smileyMouth();
			this.mouth.y = -25;
			bodyCont.addChild(this.mouth);

			this.grimaceMouth();

			cont.addChild(bodyCont);
			return cont

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
			this.grimace = this.utils.spritesheet.textures['grimace.png']
			let s = Assets.Sprite(this.grimace);
			this.smile = this.utils.spritesheet.textures['smile.png']
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
		resize: function () {

		},
		animate: function () {

		}
	}
	
}