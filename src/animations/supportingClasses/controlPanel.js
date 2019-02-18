import Assets from '../utils/assetCreation';
import Utils from '../utils/utils';
export default function () {
	return {
		utils: Utils,
		init: function (parent) {
			this.parentCont = parent.stage;

			this.uiCont = Assets.Container();
            
            this.upButton = Assets.Sprite('redTile.png');
            let spacer = this.spacer = 10;
            let spacerPlusHeight = this.spacerPlusHeight = this.upButton.height + spacer;

            //
            this.upButton.interactive = true;
            this.upButton.buttonMode = true;
            this.upButton.x = 10;
            this.upButton.pointerdown = parent.switchPlayer;
            this.upButton.pointerup = parent.keyRelease;
            this.uiCont.addChild(this.upButton);

            this.leftButton = Assets.Sprite('redTile.png');
            this.leftButton.interactive = true;
            this.leftButton.buttonMode = true;
            this.leftButton.x = 10;
            this.leftButton.y = this.upButton.y + spacerPlusHeight;
            this.leftButton.pointerdown = parent.leftHit;
            this.leftButton.pointerup = parent.keyRelease;
            this.uiCont.addChild(this.leftButton);

            this.downButton = Assets.Sprite('redTile.png');
            this.downButton.interactive = true;
            this.downButton.buttonMode = true;
            this.downButton.x = 10;
            this.downButton.y = this.leftButton.y + spacerPlusHeight;
            this.downButton.pointerdown = parent.downHit;
            this.downButton.pointerup = parent.keyRelease;
            this.uiCont.addChild(this.downButton);

            this.spaceButton = Assets.Sprite('redTile.png');
            this.spaceButton.interactive = true;
            this.spaceButton.buttonMode = true;
            this.spaceButton.width = this.utils.canvasWidth - (this.spacerPlusHeight * 3);
            this.spaceButton.x = this.leftButton.x + 67 + 10;
            this.spaceButton.y = this.downButton.y;
            this.spaceButton.pointerdown = parent.spaceHit;
            this.spaceButton.pointerup = parent.keyRelease;
            this.uiCont.addChild(this.spaceButton);

            this.upButton2 = Assets.Sprite('redTile.png');
            this.upButton2.interactive = true;
            this.upButton2.buttonMode = true;
            this.upButton2.x = this.spaceButton.x + this.spaceButton.width + this.spacer;
            this.upButton2.pointerdown = parent.switchPlayer;
            this.upButton2.pointerup = parent.keyRelease;
            this.uiCont.addChild(this.upButton2);

            this.rightButton = Assets.Sprite('redTile.png');
            this.rightButton.interactive = true;
            this.rightButton.buttonMode = true;
            this.rightButton.x = this.upButton2.x;
            this.rightButton.y = this.upButton2.y + spacerPlusHeight;
            this.rightButton.pointerdown = parent.rightHit;
            this.rightButton.pointerup = parent.keyRelease;
            this.uiCont.addChild(this.rightButton);

            this.downButton2 = Assets.Sprite('redTile.png');
            this.downButton2.interactive = true;
            this.downButton2.buttonMode = true;
            this.downButton2.x = this.upButton2.x;
            this.downButton2.y = this.spaceButton.y;
            this.downButton2.pointerdown = parent.downHit;
            this.downButton2.pointerup = parent.keyRelease;
            this.uiCont.addChild(this.downButton2);
            
          	this.place();
            
		},
		place: function () {
			this.spaceButton.width = this.utils.canvasWidth - (this.spacerPlusHeight * 3);
			this.upButton2.x = this.spaceButton.x + this.spaceButton.width + this.spacer;
			this.rightButton.x = this.upButton2.x;
			this.downButton2.x = this.upButton2.x;
			this.uiCont.y = this.utils.canvasHeight - this.uiCont.height - 10;
            this.uiCont.x = (this.utils.canvasWidth - this.uiCont.width) / 2;
		},
		addToStage: function () {
			this.parentCont.addChild(this.uiCont);
		},
		removeFromStage: function () {
		 	this.parentCont.removeChild(this.uiCont);
		},
		resize: function () {
			this.place();
		},
		animate: function () {

		}
	}
}