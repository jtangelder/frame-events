frame-events
============

The browser is flooding your code with events, which could make your page slow.
With this library you only receive the events at 60fps, with requestAnimationFrame.

Useful events would be `scroll`, `resize`, `touchmove`, `mousemove` and `mousewheel`.

## How to use
````js
FrameEvents.on(window, "scroll", yourHandler);
FrameEvents.off(window, "scroll", yourHandler);
````

````js
// collect the layout properties...
function dataHandler(ev) {
  return { lastScrollY: window.scrollY }
}

// ...and you will receive them as the second property in your handler
function scrollHandler(ev, data) {
  console.log(data.lastScrollY)
}

FrameEvents.on(window, "scroll", scrollHandler, dataHandler);
````

For support of [older browsers](http://caniuse.com/#feat=requestanimationframe) you should include a 
[`requestAnimationFrame`](https://gist.github.com/paulirish/1579671) polyfill.

Available on bower, named `frame-events`.

### Related articles
- [Leaner, Meaner, Faster Animations with requestAnimationFrame](http://www.html5rocks.com/en/tutorials/speed/animations/)
- [Scrolling Performance](http://www.html5rocks.com/en/tutorials/speed/scrolling/)
- [JankFree.org](http://jankfree.org/)
- [How (not) to trigger a layout in WebKit](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html)

## Changelog

- 0.0.1: removed es5 dependency and refactored
- 0.0.0: initial
