/*! Frame Events
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

(function(window){   
  function FrameEvent(element, type, eventHandler, dataHandler) {
    this.element = element;
    this.type = type;
    this.eventHandler = eventHandler;
    this.dataHandler = dataHandler;
    
    this.element.addEventListener(type, this.frameEvent.bind(this), false);
  }
  
  // request tick and execute the preventDefault methods
  FrameEvent.prototype.frameEvent = function(ev) {
    // collect data if there is a handler
    if(this.dataHandler) {
      this._data = this.dataHandler.call(this.element, ev);
    }
    
    this._evData = ev;
    Manager.requestTick();
  };
  
  // trigger handles of this type
  FrameEvent.prototype.trigger = function() {
    // event was captured, now trigger the handler
    if(this._evData) {
      this.eventHandler.call(this.element, this._evData, this._data);
      
      // reset
      this._evData = this._data = null;
    }
  };
  
  // unbind
  FrameEvent.prototype.destroy = function() {
    this.element.removeEventListener(this.type, this.frameEvent)
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
    on: function(element, type, eventHandler, dataHandler) {
      this.events.push(
        new FrameEvent(element, type, eventHandler, dataHandler)
      );
    },  
    
    // unbind
    off: function(element, type, eventHandler) {
      this.events.forEach(function(fe, index) {
        if(element === fe.element && 
           type === fe.type && 
           eventHandler === fe.eventHandler) {
          fe.destroy();
          this.events.splice(index, 1)
        }
      }.bind(this));      
    },
    
    // trigger events, called by raf
    // the FrameEvent determines if it really should trigger
    triggerEvents: function() {
      this.events.forEach(function(fe) {
        fe.trigger();
      });
      ticking = false;
    },    
    
    requestTick: function() {
      if(!ticking) {
        ticking = true;
        this.raf.call(window, this.triggerEvents.bind(this));
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
