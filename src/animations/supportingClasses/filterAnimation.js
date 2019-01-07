import * as PIXI from 'pixi.js';
export default function filterAnim(app, container, wh) {
    return {
        app: app,
        count: 0,
        enabled: false,
        init: function () {

            var filter = this.filter = new PIXI.filters.ColorMatrixFilter();
            this.wh = wh;

            container.x = this.wh.canvasWidth / 2;
            container.y = this.wh.canvasHeight / 2;


            var light2 = this.light2 = PIXI.Sprite.fromImage('/bmps/radial_1.png');
            light2.visible = false;
            light2.anchor.set(0.5);
            container.addChild(light2);

            var light1 = this.light1 = PIXI.Sprite.fromImage('/bmps/radial_2.png');
            light1.visible = false;
            light1.anchor.set(0.5);
            container.addChild(light1);

             var light3 = this.light3 = PIXI.Sprite.fromImage('/bmps/radial_3.png');
            light3.visible = false;
            light3.anchor.set(0.5);
            container.addChild(light3);


            app.stage.addChild(container);
            app.stage.filters = [filter];

            this.container = container;
        },
        resize: function (wh) {
            this.wh = wh;
            this.container.x = this.wh.canvasWidth / 2;
            this.container.y = this.wh.canvasHeight / 2;
        },
        filterToggle: function () {
            this.enabled = !this.enabled;
            app.stage.filters = this.enabled ? [this.filter] : null;
            this.light1.visible = !this.light1.visible;
            this.light2.visible = !this.light2.visible;
            this.light3.visible = !this.light3.visible;
        },
        shutOff: function () {
            this.enabled = false;
            app.stage.filters = null;
            this.light1.visible = false;
            this.light2.visible = false;
            this.light3.visible = false;
        },
        animate: function () {
            if(this.enabled){
                this.light1.rotation += 0.02;
                this.light2.rotation += 0.01;
                this.light3.rotation += 0.03;
              
                this.count += 0.1;

                var matrix = this.filter.matrix;

                matrix[1] = Math.sin(this.count) * 3;
                matrix[2] = Math.cos(this.count);
                matrix[3] = Math.cos(this.count) * 1.5;
                matrix[4] = Math.sin(this.count / 3) * 2;
                matrix[5] = Math.sin(this.count / 2);
                matrix[6] = Math.sin(this.count / 4);
            }
           

        }
    }
}

