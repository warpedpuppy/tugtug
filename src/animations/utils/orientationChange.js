import Utils from './utils';
import Assets from './assetCreation';
import Config from '../animationsConfig';

export default {
		utils: Utils,
		testForHeight: false,
		init: function (parent) {
			this.parent = parent;
			this.orientationChangeHandler = this.orientationChangeHandler.bind(this);
			window.addEventListener("orientationchange", this.orientationChangeHandler);
		},
		makeLandscape: function () {

          let val1 = Config.mobileOnlyDimensionsLandscape[0],
              val2 = Config.mobileOnlyDimensionsLandscape[1];
          this.canvasWidth = Math.max(val1, val2);
          this.canvasHeight = Math.min(val1, val2);
          this.utils.setWidthAndHeight(this.canvasWidth, this.canvasHeight)

           if (this.utils.isMobileOnly) {
                this.utils.root.setMask();
              
            }
      },
      makePortrait: function () {

          let val1 =  Config.mobileOnlyDimensionsPortrait[0],
              val2 =  Config.mobileOnlyDimensionsPortrait[1];

          this.canvasWidth = Math.min(val1, val2);
          this.canvasHeight = Math.max(val1, val2);
          this.utils.setWidthAndHeight(this.canvasWidth, this.canvasHeight)
          //document.getElementById('testOrientation').innerHTML = "portrait";

           if (this.utils.isMobileOnly) {
                this.utils.root.setMask();
              
            }
      },
       determinePortraitOrLandscape: function () {

          this.testWidth = this.utils.returnCanvasWidth();
          this.testHeight = this.utils.returnCanvasHeight();

          if (this.testHeight < this.testWidth) {
              //landscape
              this.makeLandscape();
          } else {
              // portrait
              this.makePortrait();
          }
          this.utils.setWidthAndHeight(this.canvasWidth, this.canvasHeight)
          this.parent.resizeBundle();
          this.parent.app.renderer.resize(this.canvasWidth, this.canvasHeight);
          this.parent.action = true;
      },
      orientationChangeHandler: function (e) {

         
          this.testForHeight = true;

      },
		animate: function () {
			 if (this.testForHeight) {
               this.action = false;
              // console.log('animate h', this.utils.returnCanvasHeight());
              // console.log('animate w', this.utils.returnCanvasWidth());
              this.determinePortraitOrLandscape();
              this.testForHeight = false;
            }
		}
	
}