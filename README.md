prune-events
============

The browser is flooding your code with events, which could make your page slow.
With this library you only receive the events at 60fps, with requestAnimationFrame.

Useful events would be `scroll`, `resize`, `touchmove`, `mousemove` and `mousewheel`.

## How to use
````js
PruneEvents.on(window, "scroll", yourHandler);
PruneEvents.off(window, "scroll", yourHandler);
````

````js
// collect the paint properties
function dataHandler() {
  return { lastScrollY: window.scrollY }
}

// and you will receive them as the second property in your handler
function scrollHandler(ev, data) {
  console.log(data.lastScrollY)
}

PruneEvents.on(window, "scroll", scrollHandler, dataHandler);
````

You can also trigger `preventDefault`, `stopPropagation` and `stopImmediatePropagation`.
Since the events are fired async, these will be triggered on the next DOM event.

For support of [older browsers](http://caniuse.com/#feat=requestanimationframe) you should include a 
[`requestAnimationFrame`](https://gist.github.com/paulirish/1579671) polyfill.

Also, the lib makes use of 
[`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
A polyfill is available on this page.


## Related articles
- [Leaner, Meaner, Faster Animations with requestAnimationFrame](http://www.html5rocks.com/en/tutorials/speed/animations/)
- [Scrolling Performance](http://www.html5rocks.com/en/tutorials/speed/scrolling/)
- [JankFree.org](http://jankfree.org/)
