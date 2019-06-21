export default {
	   lookForThreeOfAKind: function (arr) {
            let horiz = [],
                vert = [],
                counter = 0,
                testVerts = true;

            // there are two events that prompt the returning of the array:
            // 1) the end of a row if it found three of a kind
            // 2) the introduction of a new color after three or more had been put into an array
            for (let i = 0; i < arr.length; i ++) {

                let dot = arr[i];
                let lastHorizItem = horiz[horiz.length - 1];

                if (lastHorizItem && dot.color === lastHorizItem.color) {
                    horiz.push(dot);
                    if (counter === this.colQ - 1 && horiz.length >= 3) {
                             return [horiz, "horiz"];
                    }
                } else {
                     if (horiz.length >= 3) {
                        return [horiz, "horiz"];
                    }

                    horiz = [dot];
                }

                if (testVerts) {
                    let loopQ = 0;
                    while (loopQ < this.rowQ) {

                        let x = i + (this.colQ * loopQ)

                        let lastVertItem = vert[vert.length - 1];
                        if (lastVertItem && arr[x].color === lastVertItem.color) {
                            vert.push(arr[x]);
                            if(loopQ === (this.rowQ -1 ) && vert.length >= 3){
                                    return [vert, "vert"];
                            }
                        } else {
                            if(vert.length >= 3){
                                    return [vert, "vert"];
                            }
                            vert = [arr[x]];
                        }
                        loopQ ++;
                    }
                    vert = [];
                }

                counter ++;
                if (counter === this.colQ) {
                    testVerts = false;
                    counter = 0;
                    horiz = [];
                }
            }
        }



}