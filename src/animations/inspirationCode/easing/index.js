

const app = new PIXI.Application({
    width: 1000, height: 100, backgroundColor: 0x1099bb, resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const container = new PIXI.Container();

app.stage.addChild(container);

let dot = new PIXI.Graphics();
dot.y = 50;
dot.x = 10;
dot.beginFill(0x000000).drawCircle(0,0,10).endFill();
app.stage.addChild(dot)
let tweenArray = [];


     
function move(item, seconds, obj) {

      let changeIncrement =  60 * seconds;
			item.obj = obj;
      item.changeIncrement = changeIncrement;
		  item.seconds = seconds;
      item.startTime = new Date().getTime();
			tweenArray.push(item);
}

app.ticker.add(animate);

/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
EasingFunctions = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity 
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity 
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity 
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity 
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}


//below works
function easeInQuad(t, b, c, d) {
  return c*(t/=d)*t + b;
}
function easeInSine(t, b, c, d) {
    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
  }
function easeOutBounce(t, b, c, d) {
  if ((t/=d) < (1/2.75)) {
    return c*(7.5625*t*t) + b;
  } else if (t < (2/2.75)) {
    return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
  } else if (t < (2.5/2.75)) {
    return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
  } else {
    return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
  }
}

function easeOutElastic(t) {
    var p = 0.3;
    return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
}


move(dot,0.5, {x: [10, 50]});
function animate(delta) {



   if (tweenArray.length) {
     tweenArray.forEach(item => {
    
      let t = new Date().getTime() - item.startTime;
      let b = 10;
      let c = 500;
      let d = 3000;
      let e = c - b;
      let percentage = t / d;
     // console.log(percentage)
      let inc = easeOutElastic(percentage);
      var val = b + inc*(c-b);

      let inc2 = easeOutBounce(t, b, c, d)

      if (percentage <  1) {
          item.x = val;
       } else {
        console.log("done")
        tweenArray.splice(item, 1);
       }
       
     })
    }
     
                    
};

 //let startValue = item.obj.x[0];
     //  let endValue = item.obj.x[1]
     //  let changeIncrement = (endValue - startValue) / item.changeIncrement;

     //  let currentMilliseconds = new Date().getTime()
     //  let t = currentMilliseconds -  item.currentTime;
     

     //  let b = startValue;
     //  let c = item.x - startValue;
     //  let d = item.seconds * 1000;
     
     //  //console.log(t, startValue, c, s)
     // // let newChangeIncrement = BackCubic(t, b, c, d)
     //  //console.log(t, d)
     //  let percentage = t/d;
     //  console.log('percentage done = ', percentage)
     //  t = easeInCubic(percentage);
     //  newChangeIncrement = b + t * (c - b);
     //  console.log(newChangeIncrement)
