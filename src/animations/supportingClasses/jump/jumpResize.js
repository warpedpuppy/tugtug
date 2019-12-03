 import Utils from '../../utils/utils';

export default function () {
    return {
        utils: Utils,
        timeOut: undefined,
        resizeBundle: function () {
            let root = this.utils.root;
            root.clock.resize();
            root.gears.resize();
            root.hero.resize();
            root.jump.resize();
            // root.fpsCounter.x = root.utils.canvasWidth - 75;
            if (root.isMobile) {
                root.controlPanel.resize();
            }    
        },
        resizeHandler: function () {
            let root = this.utils.root;

            this.canvasWidth =  this.utils.returnCanvasWidth();
            this.canvasHeight = this.utils.returnCanvasHeight();

            this.utils.resize(this.canvasWidth, this.canvasHeight);

            this.resizeBundle();
           
            root.app.renderer.resize(this.canvasWidth, this.canvasHeight);

            root.action = false;

            if (this.timeOut) {
                clearTimeout(this.timeOut);
            }
            this.timeOut = setTimeout(this.resized.bind(this), 200)

        },
        resized: function () {
            let root = this.utils.root;
            root.action = true;
            clearTimeout(this.timeOut);
        }
    }
}
