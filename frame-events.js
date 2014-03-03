/*! Frame Events
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

(function(window){   
  function FrameEvent(element, type, handler, domHandler) {
    this.el = element;
    this.type = type;
    this.handler = handler;
    this.domHandler = domHandler;
    
    this.el.addEventListener(type, this.frameEvent.bind(this), false);
  }
  
  // request tick and execute the preventDefault methods
  FrameEvent.prototype.frameEvent = function(ev) {
    // collect data if there is a handler
    if(this.domHandler) {
      this._data = this.domHandler.call(this.element, ev);
    }
    
    this._ev = ev;
    Manager.requestTick();
  };
  
  // trigger handles of this type
  FrameEvent.prototype.trigger = function() {
    // event was captured, now trigger the handler
    if(this._ev) {
      this.handler.call(this.el, this._ev, this._data);
      
      // reset
      this._ev = this._data = null;
    }
  };
  
  // unbind
  FrameEvent.prototype.destroy = function() {
    this.el.removeEventListener(this.type, this.frameEvent);
  };
  
  
  // raf state
  var ticking = false;
  
  // manages the event handlers and ticking
  var Manager = { 
    // holds all events
    events: [],
  
    // overwrite this to use or embed it in your own ticker
    raf: window.requestAnimationFrame,
    
    // bind event
    on: function(el, type, handler, domHandler) {
      this.events.push(
        new FrameEvent(el, type, handler, domHandler)
      );
    },  
    
    // unbind
    off: function(el, type, handler) {
      this.events.forEach(function(fe, index) {
        if(el == fe.el && 
           type == fe.type && 
           handler == fe.handler) {
          fe.destroy();
          this.events.splice(index, 1)
        }
      }.bind(this));      
    },
    
    // trigger events, called by raf
    // the FrameEvent determines if it really should trigger
    trigger: function() {
      this.events.forEach(function(fe) {
        fe.trigger();
      });
      ticking = false;
    },    
    
    requestTick: function() {
      if(!ticking) {
        ticking = true;
        this.raf.call(window, this.trigger.bind(this));
      }
    }
  };  
  
  // commonjs export
  if(typeof(module) !== 'undefined' && module.exports) {
    module.exports = Manager;
  }
  else {
    window.FrameEvents = Manager;
  }
})(window);
