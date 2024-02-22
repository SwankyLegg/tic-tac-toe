// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]
        + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
        || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());


// https://gist.github.com/joelambert/1002116
var DelayedCall = DelayedCall || (function() {

  var _reqHandleArr = [];

  function delay(delay, fn, vars) {
    var start = new Date().getTime(),
      my_delay = delay * 1000,
      handle = new Object(),
      current, delta;

    function loop() {
      current = new Date().getTime();
      delta = current - start;
      delta >= my_delay ? callfn(fn, vars) : handle.value = requestAnimationFrame(loop);
    };

    handle.value = requestAnimationFrame(loop);
    handle.fn = fn;
    _reqHandleArr.push(handle);
    return handle;
  }

  function kill(fn) {
    var index = arrayObjectIndexOf(_reqHandleArr, fn, 'fn'),
      handle = _reqHandleArr[index];
    if (index < 0) return;
    _reqHandleArr.splice(index, 1);
    window.cancelAnimationFrame ? window.cancelAnimationFrame(handle.value) :
      window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(handle.value) :
      window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(handle.value) : /* Support for legacy API */
      window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(handle.value) :
      window.oCancelRequestAnimationFrame ? window.oCancelRequestAnimationFrame(handle.value) :
      window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(handle.value) :
      clearTimeout(handle);
  }

  function callfn(fn, vars) {
    fn.apply(this, vars);
    var index = arrayObjectIndexOf(_reqHandleArr, fn, 'fn');
    if (index < 0) return;
    _reqHandleArr.splice(index, 1);
  }

  function arrayObjectIndexOf(myArray, searchTerm, property) {
    var i, total = myArray.length;
    for (i = 0; i < total; i++) {
      if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  }

  return {
    delay: delay,
    kill: kill
  }

})();

