export default function filterAnim(PIXI, app, container, stage) {
    return {
        app: app,
        count: 0,
        enabled: false,
        init: function () {

            var filter = this.filter = new PIXI.filters.ColorMatrixFilter();


            container.x = app.screen.width / 2;
            container.y = app.screen.height / 2;


            var light2 = this.light2 = PIXI.Sprite.fromImage('/bmps/LightRotate2.png');
            light2.visible = false;
            light2.anchor.set(0.5);
            container.addChild(light2);

            var light1 = this.light1 = PIXI.Sprite.fromImage('/bmps/LightRotate1.png');
            light1.visible = false;
            light1.anchor.set(0.5);
            container.addChild(light1);

           // if(!stage){
                app.stage.addChild(container);
                app.stage.filters = [filter];
            // } else {
            //     stage.addChild(container);
            //     stage.filters = [filter];
            // }
          
            
        

        },
        filterToggle: function () {
            this.enabled = !this.enabled;
            app.stage.filters = this.enabled ? [this.filter] : null;
            this.light1.visible = !this.light1.visible;
            this.light2.visible = !this.light2.visible;
        },
        animate: function () {
            if(this.enabled){
                this.light1.rotation += 0.02;
                this.light2.rotation += 0.01;

              
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

