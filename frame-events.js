/*! Frame Events
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

 (function(window){
   
  function FrameEvent(element, eventType, eventHandler, dataHandler) {
    this.element = element;
    this.eventType = eventType;
    this.eventHandler = eventHandler;
    this.dataHandler = dataHandler;
    
    this.extraData = null;
    
    this.element.addEventListener(eventType, this.frameEvent.bind(this), false);
  }
  
  // request tick and execute the preventDefault methods
  FrameEvent.prototype.frameEvent = function(ev) {
    // collect data if there is a handler
    if(this.dataHandler) {
      this.extraData = this.dataHandler.call(this.element, ev);
    }
    
    this.eventData = ev;
    Manager.requestTick();
  };
  
  // trigger handles of this type
  FrameEvent.prototype.trigger = function() {
    // event was captured, now trigger the handler
    if(this.eventData) {
      this.eventHandler.call(this.element, this.eventData, this.extraData);
      
      // reset
      this.eventData = this.extraData = null;
    }
  };
  
  // unbind
  FrameEvent.prototype.destroy = function() {
    this.element.removeEventListener(this.eventType, this.frameEvent)
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
    on: function(element, eventType, eventHandler, dataHandler) {
      this.events.push(
        new FrameEvent(element, eventType, eventHandler, dataHandler)
      );
    },  
    
    // unbind
    off: function(element, eventType, eventHandler) {
      this.events.forEach(function(fe, index) {
        if(element === fe.element && 
           eventType === fe.eventType && 
           eventHandler === fe.eventHandler) {
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
