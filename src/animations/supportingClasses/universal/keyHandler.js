import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
// import Config from './animationsConfig';
export default function () {
	return {
        utils: Utils,
		init: function (parent) {
			this.parent = parent;
			this.upHit = this.upHit.bind(this);
            this.downHit = this.downHit.bind(this);
            this.rightHit = this.rightHit.bind(this);
            this.leftHit = this.leftHit.bind(this);
            this.spaceHit = this.spaceHit.bind(this);
            this.keyRelease = this.keyRelease.bind(this);
            this.keyDown = this.keyDown.bind(this);
            this.keyUp = this.keyUp.bind(this);
		},
		addToStage: function () {
			window.addEventListener('keydown', this.keyDown);
            window.addEventListener('keyup', this.keyUp);
		},
		removeFromStage: function () {
			window.removeEventListener('keydown', this.keyDown);
            window.removeEventListener('keyup', this.keyUp);
		},
		spaceHit: function () {
            if(this.parent.activeAction.jump){
            	this.parent.activeAction.jump();
            }
            if(this.parent.activeMode === 'fly' && this.parent.activeAction.fire){
            	this.parent.activeAction.fire(true);
            }
        },
        upHit: function () {
            //this.parent.hero.heroJump.look('up');
        },
        downHit: function () {
            //this.vy = 0;
        },
        leftHit: function () {
            this.parent.activeAction.spinning = true;
            this.parent.rotateLeftBoolean = true;
        },
        rightHit: function (){
            this.parent.activeAction.spinning = true;
            this.parent.rotateRightBoolean = true;
        },
        keyRelease: function () {
            this.parent.activeAction.spinning = false;
            this.parent.rotateLeftBoolean = false;
            this.parent.rotateRightBoolean = false;
            this.parent.idle = true;
            if (this.parent.activeMode === 'fly' && this.parent.activeAction.fire) {
            	this.parent.activeAction.fire(false);
            }
        },
		keyDown: function (e) {
            //e.preventDefault();
            //console.log(e.keyCode)
            switch (e.keyCode) {
                case 32:
                // space
                    this.spaceHit();
                    break;
                case 37:
                    // left
                    this.leftHit();
                    break;
                case 38:
                    // up
                    this.upHit();
                    break;
                case 39:
                    // right
                    this.rightHit();
                    break;
                case 67:
                    // the letter c for switch player
                    if(Utils.root.activeMode !== 'jump')this.parent.switchPlayerWithAnimation();
                    break;
                case 83:
                    this.utils.root.grid.gridBuild.spaceShip.classRef.blastOff();
                    break;
                case 40:
                    break;
                default:
                    this.downHit();
            }
        },
        keyUp: function (e) {
            e.preventDefault();
            this.keyRelease();
        },
		resize: function () {

		},
		animate: function () {

		}
	}
}