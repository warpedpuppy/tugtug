import Assets from '../../utils/assetCreation';
import Utils from '../../utils/utils';
import Config from '../../animationsConfig';

export default {
	interval: undefined,
	shapes: [],
	testInterval: function (stage) {
        this.counter ++;
        let testShape = Assets.Graphics();
        let color = Utils.randomItemFromArray(Config.rainbowColors)
        let size = Utils.randomNumberBetween(10, 30);
        let alpha = Utils.randomNumberBetween(0.1, 1);
        testShape.beginFill(color).drawCircle(0,0,size).endFill();
        testShape.x = Utils.randomNumberBetween(0, Utils.canvasWidth);
        testShape.y = Utils.randomNumberBetween(0, Utils.canvasHeight);
        testShape.alpha = alpha;
        this.shapes.push(testShape);
        stage.addChild(testShape);
    },
	start: function (stage) {
        this.interval = setInterval(this.testInterval.bind(this, stage), 1);
	},
	stop: function (stage) {
		this.shapes.forEach(item => {
			stage.removeChild(item);
		})
		this.shapes = [];
		clearInterval(this.interval);
	}
}