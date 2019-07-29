export default {
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
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },

  easeOutElastic(t) {
      var p = 0.3;
      return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
  },
  easeOutBounce: function (t) {
    if ((t) < (1/2.75)) {
      return (7.5625*t*t);
    } else if (t < (2/2.75)) {
      return (7.5625*(t-=(1.5/2.75))*t + .75);
    } else if (t < (2.5/2.75)) {
      return (7.5625*(t-=(2.25/2.75))*t + .9375);
    } else {
      return (7.5625*(t-=(2.625/2.75))*t + .984375);
    }
  }
}
