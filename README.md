prunt-events
============

The browser is flooding your code with events, which could make your page slow.
With this library you only receive the events at 60fps, with requestAnimationFrame.

## How to use
````
PruneEvents.on(window, "scroll", yourHandler);
PruneEvents.off(window, "scroll", yourHandler);
````

You can also trigger `preventDefault`, `stopPropagation` and `stopImmediatePropagation`.
Since the events are fired async, these will be triggered on the next DOM event.

For support of [older browsers](http://caniuse.com/#feat=requestanimationframe) you should include a 
[`requestAnimationFrame`](https://gist.github.com/paulirish/1579671) polyfill.

Also, the lib makes use of 
[`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
A polyfill is available on this page.