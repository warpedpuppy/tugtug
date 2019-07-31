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
                	this.place();
            
		},
		place: function () {
			

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