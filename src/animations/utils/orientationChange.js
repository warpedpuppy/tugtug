import Utils from './utils';
export default {
		utils: Utils,
		testForHeight: false,
		init: function (parent) {
			this.parent = parent;
			this.orientationChangeHandler = this.orientationChangeHandler.bind(this);
			window.addEventListener("orientationchange", this.orientationChangeHandler);
		},
		makeLandscape: function () {
           
            let scale = window.devicePixelRatio;
            let val1 = window.screen.height * scale,
                val2 = window.screen.width * scale;
            this.canvasWidth = Math.max(val1, val2);
            this.canvasHeight = Math.min(val1, val2) - 60;
            this.utils.setWidthAndHeight(this.canvasWidth, this.canvasHeight)
           // document.getElementById('testOrientation').innerHTML = "landscape";
        },
        makePortrait: function () {
           
            let val1 =  this.utils.returnCanvasWidth(),
                val2 =  this.utils.returnCanvasHeight();

            this.canvasWidth = Math.min(val1, val2);
            this.canvasHeight = Math.max(val1, val2) - 60;
            this.utils.setWidthAndHeight(this.canvasWidth, this.canvasHeight)
            //document.getElementById('testOrientation').innerHTML = "portrait";
        },
         determinePortraitOrLandscape: function () {
            // console.log('determine h', this.utils.returnCanvasHeight());
            // console.log('determine w', this.utils.returnCanvasWidth());

            this.testWidth = this.utils.returnCanvasWidth();
            this.testHeight = this.utils.returnCanvasHeight();

            if (this.testHeight < this.testWidth){
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

             // console.log('orientation h', this.utils.returnCanvasHeight())
             // console.log('orientation w', this.utils.returnCanvasWidth())

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