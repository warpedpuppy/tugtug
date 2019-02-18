import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from './animationsConfig';
export default function () {
	return {
		init: function (parentCont) {
		},
		addToStage: function () {

		},
		spaceHit: function () {
            if(this.activeAction.jump)this.activeAction.jump();
            if(this.activeMode === 'fly')this.activeAction.fire(true);
        },
        upHit: function () {
            this.rotate('up');
            this.hero.heroJump.look('up');
        },
        downHit: function () {
            this.vy = 0;
        },
        leftHit: function () {
            if(this.swimAction)this.swimAction.spinning = true;
            this.rotateLeftBoolean = true;
        },
        rightHit: function (){
            if(this.swimAction)this.swimAction.spinning = true;
            this.rotateRightBoolean = true;
        },
        keyRelease: function () {
            if(this.swimAction)this.swimAction.spinning = false;
            this.rotateLeftBoolean = false;
            this.rotateRightBoolean = false;
            this.idle = true;
            if(this.activeMode === 'fly')this.activeAction.fire(false);
        },
		keyDown: function (e) {
            //e.preventDefault();
            // console.log(e.keyCode)
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
                    this.switchPlayer();
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
		removeFromStage: function () {

		},
		resize: function () {

		},
		animate: function () {

		}
	}
}