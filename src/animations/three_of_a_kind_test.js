import Utils from './utils/utils';
import Assets from './utils/assetCreation';
import Tweens from './utils/tweens';


export default function(obj) {
    return {
        utils: Utils,
        dots: [],
        colQ: 10,
        rowQ: 5,
        spacer: 70,
        temp: [],
        tempCounter: 0,
        init: function (isMobile, isMobileOnly) {

            var app = this.app = Assets.Application( 
                1000,  
                500, 
                false
            );
            document.getElementById('threeOfAKindCanvas').appendChild(app.view);
            this.stage = app.stage;
        
            
            this.app.ticker.add(this.animate); 

            let cont = Assets.Container();

               this.rainbowColors = 
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
                    let dot = Assets.Sprite("pellet.png");
                    dot.anchor.set(0.5)
                    let color = this.utils.randomItemFromArray(this.rainbowColors)
                    //dot.beginFill(color[0]).drawCircle(0,0,10).endFill();
                    dot.x = j * this.spacer;
                    dot.y = i * this.spacer;
                    dot.tint = color[0];
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
            // let arr = this.lookForThreeOfAKind();
            // arr.forEach(item => {
            //     Tweens.tween(item, 1, {y: [item.y, item.y + this.spacer]}, this.completeHandler, 'linear')
            // })
            this.completeHandler = this.completeHandler.bind(this);
            this.done = this.done.bind(this)
            setTimeout(this.completeHandler, 2000);
        },
        completeHandler: function () {
            let arr = this.lookForThreeOfAKind();
            // let arr = [];
            // this.lookForThreeOfAKind(true);
            // remove those three
            this.temp = [];
            this.tempCounter = 0;
            arr.forEach(item => {

               // item.y -= this.spacer * 0.75;

                let index = this.dots.indexOf(item);

                while (this.dots[index]) {

                    let dot = this.dots[index];
                    this.temp.push(dot)

                    let targetIndex = index - this.colQ;

                    if (targetIndex >= 0) {
                        dot.tint = this.dots[targetIndex].tint;
                        dot.color = this.dots[targetIndex].color;
                    } else {
                        let item = this.utils.randomItemFromArray(this.rainbowColors);
                        dot.tint = item[0];//0xFFFFFF;
                        dot.color = item[1];
                    }

                    this.dots[index].startY = this.dots[index].y;
                    this.dots[index].y -= this.spacer * 0.75;
                    index = targetIndex;
                }
            })


            this.temp.forEach(item => {
                Tweens.tween(item, 1, {y: [item.y, item.startY]}, this.done, 'easeOutBounce')
            })
        },
        done: function () {
           
            this.tempCounter ++;
           // console.log(this.tempCounter, this.temp.length)
            if(this.tempCounter === this.temp.length){
                 //alert ('done');
                 this.completeHandler();
                 this.tempCounter = 0;
                 this.temp = [];
            }
        },
        lookForThreeOfAKind: function (testing) {
            let horiz = [];
            let vert = [];
            let storeColor = undefined;
            let counter = 0;
            let row = 1;
            let testVerts = true;
            console.log('NEW')
            for (let i = 0; i < this.dots.length; i ++) {

                let dot = this.dots[i];
                let lastHorizItem = horiz[horiz.length - 1];

                console.log(dot.color)

                if (lastHorizItem && dot.color === lastHorizItem.color) {
                    //console.log(dot.color)
                    horiz.push(dot);
                } else {

                     if (horiz.length >= 3) {
                        console.log('three of a kind');
                        if (testing) {
                             horiz.forEach(item => {
                                item.scale.set(0.5)
                            })
                             break;
                         } else {
                            return horiz;
                         }
                       
                    }

                    horiz = [dot];
                  //  console.log(dot.color)
                }

                //this should only be triggered after a different color has been found
                // if (horiz.length >= 3) {
                //     //console.log('three of a kind');
                //     if (testing) {
                //          horiz.forEach(item => {
                //             item.scale.set(0.5)
                //         })
                //          break;
                //      } else {

                //         //return horiz;
                //      }
                   
                // }
               
                // if (testVerts) {
                //     //console.log(dot.color)
                //     let loopQ = 0;

                //     while (loopQ < this.rowQ) {

                //         let x = i + (this.colQ * loopQ)

                //         //console.log(x, this.dots[x].color)

                //         let lastVertItem = vert[vert.length - 1];
                //         if (lastVertItem && this.dots[x].color === lastVertItem.color) {
                //             vert.push(this.dots[x]);
                //         } else {
                //             vert = [this.dots[x]];
                //         }
                //         //console.log(vert.color);

                //         if(vert.length >= 3){
                //             console.log('three of a kind verticals');
                //             if(testing){
                //                 vert.forEach(item => {
                //                   item.scale.set(1.5)
                //                 })
                //             } else {
                //                 return vert;
                //             }
                           
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
        },
        dotClick: function (e) {
            if(e.target.scale.x === 1){
                e.target.scale.set(2)
            } else {
                e.target.scale.set(1)
            }
            
        },
        animate: function () {
            Tweens.animate();
           
        }
    }
}