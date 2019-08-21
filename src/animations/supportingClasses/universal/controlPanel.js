import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import {isMobile, isMobileOnly} from 'react-device-detect';
export default function () {
      return {
            utils: Utils,
            height: 35,
            init: function (parent) {

                  this.height = (!isMobileOnly)?this.height:30;
                  this.leftRightWidth = this.height * 2;
                  this.halfLeftRightWidth = this.leftRightWidth / 2;


                  this.halfHeight = this.height / 2;
                  this.parent = parent;
                  this.parentCont = parent.stage;
                  this.uiCont = Assets.Container();
                  
                  this.leftButton = Assets.Graphics();
                  this.leftButton.lineStyle(1, 0x000000, 1).beginFill(0xFFFF00).drawRoundedRect(
                        -this.halfLeftRightWidth, 
                        -this.halfHeight, 
                        this.leftRightWidth, 
                        this.height, 10).endFill();
                  this.leftButton.interactive = true;
                  this.leftButton.buttonMode = true;
                  //dthis.leftButton.x = 10;
                  this.leftButton.pointerdown = parent.keyHandler.leftHit;
                  this.leftButton.pointerup = parent.keyHandler.keyRelease;
                  this.uiCont.addChild(this.leftButton);

                  this.rightButton = Assets.Graphics();
                  this.rightButton.lineStyle(1, 0x000000, 1).beginFill(0xFFFF00).drawRoundedRect(
                        -this.halfLeftRightWidth, 
                        -this.halfHeight, 
                        this.leftRightWidth, 
                        this.height, 10).endFill();
                  this.rightButton.interactive = true;
                  this.rightButton.buttonMode = true;
                  this.rightButton.pointerdown = parent.keyHandler.rightHit;
                  this.rightButton.pointerup = parent.keyHandler.keyRelease;
                  this.uiCont.addChild(this.rightButton);



                  this.spaceButton = Assets.Graphics();
                  let width = this.utils.canvasWidth - (this.leftRightWidth * 4);
                  let halfWidth = width / 2;
                  
                  this.spaceButton.lineStyle(1, 0x000000, 1).beginFill(0xFF0000).drawRoundedRect(
                        -halfWidth, 
                        -this.halfHeight, 
                        width,
                        this.height, 
                        10).endFill();
                  this.spaceButton.interactive = true;
                  this.spaceButton.buttonMode = true;
                  this.spaceButton.pointerdown = parent.keyHandler.spaceHit;
                  this.spaceButton.pointerup = parent.keyHandler.keyRelease;

                 this.leftButton.x = -halfWidth - this.halfHeight - 30;
                 this.rightButton.x = halfWidth + this.halfHeight + 30;

                 this.uiCont.addChild(this.spaceButton);
                this.place();


            
            },
            place: function () {
                  this.uiCont.x = this.utils.canvasWidth / 2;

                  if (isMobileOnly) {


                        this.uiCont.y = this.utils.canvasHeight - (this.height / 2);

                        let width = this.utils.canvasWidth - (this.leftRightWidth * 4);
                        let halfWidth = width / 2;

                        this.spaceButton.clear();
                        this.spaceButton.lineStyle(1, 0x000000, 1).beginFill(0xFF0000).drawRoundedRect(
                              -halfWidth, 
                              -this.halfHeight, 
                              width,
                              this.height, 
                        10).endFill();

                        this.leftButton.x = -halfWidth - this.halfHeight - 30;
                        this.rightButton.x = halfWidth + this.halfHeight + 30;









                  } else {
                        this.uiCont.y = this.utils.canvasHeight- (this.height / 2);
                        console.log(this.uiCont.y)

                        let width = this.utils.canvasWidth - (this.height * 3);
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
                  }
                
                  
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