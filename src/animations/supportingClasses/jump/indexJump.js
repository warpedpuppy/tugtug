import * as PIXI from 'pixi.js';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';
import JumpAction from '../actions/jumpAction';
import JumpBackground from './jumpBackground';

export default function () {
	return {
		jumpAction: JumpAction(),
		jumpBackground: JumpBackground(),
		init: function (stage) {
            this.jumpAction.init(stage);
            this.jumpBackground.init(stage, this.jumpAction);
		},
		addToStage: function () {
			this.jumpBackground.addToStage();
			return this.jumpAction;
		},
		removeFromStage: function () {
			this.jumpBackground.removeFromStage();
		},
		resize: function () {

		},
		animate: function () {
			this.jumpBackground.animate();
		}
			
	}
}