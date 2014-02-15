prunt-events
============

The browser is flooding your code with events, which could make your page slow.
With this library you only receive the events at 60fps, with requestAnimationFrame.

## How to use
````
var scroll = new PruneEvents(window);
scroll.on("scroll", yourHandler); // bind
scroll.off("scroll", yourHandler); // unbind
````

You can also trigger `preventDefault`, `stopPropagation` and `stopImmediatePropagation`.
Since the events are fired async, these will be triggered on the next DOM event.