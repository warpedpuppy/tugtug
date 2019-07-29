import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
export default function () {
	return {
		utils: Utils,
            height: 70,
		init: function (parent) {

                  this.halfHeight = this.height / 2;

      		this.parentCont = parent.stage;
                  this.uiCont = Assets.Container();
                  
                  this.upButton = Assets.Sprite('redTile.png');
                  let spacer = this.spacer = 10;
                  let spacerPlusHeight = this.spacerPlusHeight = this.upButton.height + spacer;

                  //
                  // this.upButton.interactive = true;
                  // this.upButton.buttonMode = true;
                  // this.upButton.x = 10;
                  // this.upButton.pointerdown = parent.keyHandler.upHit;
                  // this.upButton.pointerup = parent.keyHandler.keyRelease;
                  // this.uiCont.addChild(this.upButton);

                  //this.leftButton = Assets.Sprite('redTile.png');
                  this.leftButton = Assets.Graphics();
                  this.leftButton.lineStyle(5, 0x000000, 1).beginFill(0xFFFF00).drawRoundedRect(
                        -this.halfHeight, 
                        -this.halfHeight, 
                        this.height, 
                        this.height, 10).endFill();
                  this.leftButton.interactive = true;
                  this.leftButton.buttonMode = true;
                  this.leftButton.x = 10;// + this.halfHeight;
                  //this.leftButton.y = this.upButton.y;
                  this.leftButton.pointerdown = parent.keyHandler.leftHit;
                  this.leftButton.pointerup = parent.keyHandler.keyRelease;
                  this.uiCont.addChild(this.leftButton);

                  // this.downButton = Assets.Sprite('redTile.png');
                  // this.downButton.interactive = true;
                  // this.downButton.buttonMode = true;
                  // this.downButton.x = 10;
                  // this.downButton.y = this.leftButton.y + spacerPlusHeight;
                  // this.downButton.pointerdown = parent.keyHandler.downHit;
                  // this.downButton.pointerup = parent.keyHandler.keyRelease;
                  // this.uiCont.addChild(this.downButton);

                 // this.spaceButton = Assets.Sprite('redTile.png');


                  this.rightButton = Assets.Graphics();
                  this.rightButton.lineStyle(5, 0x000000, 1).beginFill(0xFFFF00).drawRoundedRect(
                        -this.halfHeight, 
                        -this.halfHeight, 
                        this.height, 
                        this.height, 10).endFill();
                  this.rightButton.interactive = true;
                  this.rightButton.buttonMode = true;
                  
                  //this.rightButton.y = this.upButton2.y + spacerPlusHeight;
                  this.rightButton.pointerdown = parent.keyHandler.rightHit;
                  this.rightButton.pointerup = parent.keyHandler.keyRelease;
                  this.uiCont.addChild(this.rightButton);


                  this.spaceButton = Assets.Graphics();
                  let width = this.utils.canvasWidth - (this.spacerPlusHeight * 3);
                  let halfWidth = width / 2;
                  
                  this.spaceButton.lineStyle(5, 0x000000, 1).beginFill(0xFF0000).drawRoundedRect(
                        -halfWidth, 
                        -this.halfHeight, 
                        width,
                        this.height, 
                        10).endFill();
                  this.spaceButton.interactive = true;
                  this.spaceButton.buttonMode = true;
                 // this.spaceButton.width = this.utils.canvasWidth - (this.spacerPlusHeight * 3);
                 // this.spaceButton.x = this.leftButton.x + 67 + 10;
                  //this.spaceButton.y = this.leftButton.y + spacerPlusHeight;
                  this.spaceButton.pointerdown = parent.keyHandler.spaceHit;
                  this.spaceButton.pointerup = parent.keyHandler.keyRelease;

                 this.leftButton.x = -halfWidth - this.halfHeight - 10;
                 this.rightButton.x = halfWidth + this.halfHeight + 10;

                 this.uiCont.addChild(this.spaceButton);

                  // this.upButton2 = Assets.Sprite('redTile.png');
                  // this.upButton2.interactive = true;
                  // this.upButton2.buttonMode = true;
                  // this.upButton2.x = this.spaceButton.x + this.spaceButton.width + this.spacer;
                  // this.upButton2.pointerdown = parent.keyHandler.upHit;
                  // this.upButton2.pointerup = parent.keyHandler.keyRelease;
                  // this.uiCont.addChild(this.upButton2);


                  // this.downButton2 = Assets.Sprite('redTile.png');
                  // this.downButton2.interactive = true;
                  // this.downButton2.buttonMode = true;
                  // this.downButton2.x = this.upButton2.x;
                  // this.downButton2.y = this.spaceButton.y;
                  // this.downButton2.pointerdown = parent.keyHandler.downHit;
                  // this.downButton2.pointerup = parent.keyHandler.keyRelease;
                  // this.uiCont.addChild(this.downButton2);
                  
                	this.place();
            
		},
		place: function () {
			//this.spaceButton.width = this.utils.canvasWidth - (this.spacerPlusHeight * 3);
			//this.upButton2.x = this.spaceButton.x + this.spaceButton.width + this.spacer;
			//this.rightButton.x = this.upButton2.x;
			//this.downButton2.x = this.upButton2.x;

                  let width = this.utils.canvasWidth - (this.spacerPlusHeight * 3);
                  let halfWidth = width / 2;
                  this.spaceButton.clear();
                  this.spaceButton.lineStyle(5, 0x000000, 1).beginFill(0xFF0000).drawRoundedRect(
                        -halfWidth, 
                        -this.halfHeight, 
                        width,
                        this.height, 
                        10).endFill();

                  this.leftButton.x = -halfWidth - this.halfHeight - 10;
                  this.rightButton.x = halfWidth + this.halfHeight + 10;
			this.uiCont.y = this.utils.canvasHeight - this.uiCont.height - 10;
                  this.uiCont.x = this.utils.canvasWidth / 2;//(this.utils.canvasWidth - this.uiCont.width) / 2;
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