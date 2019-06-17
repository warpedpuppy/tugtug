import Utils from './utils/utils';
import Assets from './utils/assetCreation';
import Tweens from './utils/tweens';


export default function(obj) {
    return {
        utils: Utils,
        dots: [],
        colQ: 10,
        rowQ: 5,
        init: function (isMobile, isMobileOnly) {

            var app = this.app = Assets.Application( 
                1000,  
                500, 
                false
            );
            document.getElementById('threeOfAKindCanvas').appendChild(app.view);
            this.stage = app.stage;
        
            
            this.app.ticker.add(this.animate); 

            let spacer = 50,
                cont = Assets.Container(),
                rainbowColors = 
                [
                [0xFF0000, "red"], 
                [0x4B0082, "purple"], 
                [0x0000FF, "blue"]
                // , 
                // [0x00FF00, "green"]
                // , 
                // [0xFFFF00, "yellow"]

                ];//, 0xFF7F00, 0xFF0000];
            for (let i = 0; i < this.rowQ; i ++) {
                for (let j = 0; j < this.colQ; j ++) {
                    let dot = Assets.Graphics();
                let color = this.utils.randomItemFromArray(rainbowColors)
                    dot.beginFill(color[0]).drawCircle(0,0,10).endFill();
                    dot.x = j * spacer;
                    dot.y = i * spacer;
                    dot.color = color[1];
                    dot.interactive = dot.buttonMode = true;
                    dot.on('pointerdown', this.dotClick);
                    cont.addChild(dot);
                    this.dots.push(dot)
                }
            }
            this.stage.addChild(cont);
            cont.x = (1000 - cont.width ) / 2;
            cont.y = (500 - cont.height ) / 2;
            this.dotClick = this.dotClick.bind(this);
            this.lookForThreeOfAKind();
        },
        lookForThreeOfAKind: function () {
            let horiz = [];
            let vert = [];
            let storeColor = undefined;
            let counter = 0;
            let row = 1;
            let testVerts = true;

            for (let i = 0; i < this.dots.length; i ++) {
                let dot = this.dots[i];
                console.log(dot.color);

                let lastHorizItem = horiz[horiz.length - 1];
                if (lastHorizItem && dot.color === lastHorizItem.color) {
                    horiz.push(dot);
                } else {
                    //console.log(horiz);
                    if (horiz.length >= 3) {
                        //console.log('three of a kind');
                        horiz.forEach(item => {
                            item.scale.set(0.5)
                        })
                    }
                    horiz = [dot];
                }

                counter ++;
                if (counter === this.colQ) {
                    testVerts = false;
                    console.log("END COLUMN")
                    counter = 0;
                    horiz = [];
                }

                // console.log(horiz);

              

               
                // if (testVerts) {
                //     //console.log(dot.color)
                //     let loopQ = 0;

                //     while (loopQ < this.rowQ) {

                //         let x = i + (this.colQ * loopQ)
                //         //console.log(x, this.dots[x].color)

                //         let lastVertItem = vert[vert.length - 1];
                //         if (this.dots[x].color === lastVertItem) {
                //             vert.push(this.dots[x].color);
                //         } else {
                //             vert = [this.dots[x].color];
                //         }
                //         console.log(vert);

                //         if(vert.length >= 3){
                //              console.log('three of a kind')
                //         }

                //         loopQ ++;
                //     }
                //     vert = [];
                // }

                counter ++;
                if (counter === this.colQ) {
                    testVerts = false;
                    console.log("END COLUMN")
                    counter = 0;
                    horiz = [];
                }



            }

            // for (let i = 0; i < this.rowQ; i ++) {
            //     console.log('start row', row)


            //     for (let j = 0; j < this.colQ; j ++) {

            //         let dot = this.dots[counter];
                   

            //         let lastItem = horiz[horiz.length - 1];

            //         if (dot.color === lastItem) {
            //             horiz.push(dot.color);
            //         } else {
            //             horiz = [dot.color];
            //         }

            //         console.log(horiz);

            //         if(horiz.length >= 3){
            //             console.log('three of a kind')
            //         }

            //         counter ++;
            //     }
            //     storeColor = undefined;
            //     horiz = [];
            //     row ++;
            //     console.log('end row')
            // }
           
        },
        dotClick: function (e) {
            if(e.target.scale.x === 1){
                e.target.scale.set(2)
            } else {
                e.target.scale.set(1)
            }
            
        },
        animate: function () {

           
        }
    }
}