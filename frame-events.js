/*! Frame Events
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

(function(window){   
  
  // frame event instances
  function FrameEvent(el, type, handler, domHandler) {
    var _data, _ev;
    
    // setup
    el.addEventListener(type, frame, false); 
        
    // request tick for the event 
    function frame(ev) {
      // collect data if there is a handler
      _data = domHandler && domHandler.call(el, ev);      
      _ev = ev;
      
      requestTick();
    }
    
    // trigger handlers
    this.trigger = function() {
      // event was captured, now trigger the handler
      if(_ev) {
        handler.call(el, _ev, _data);
        _ev = _data = null; // reset for the next tick
      }
    };

    // remove the frameEvent 
    this.destroy = function() {
      el.removeEventListener(type, frame);
    };
    
    // test if the arguments are matching, this is used for removing the event
    this.match = function(m_el, m_type, m_handler) {
      return el == m_el && type == m_type && handler == m_handler;
    };
  }
  
  
  // raf state
  var ticking = false,    
    
  // holds all frame event instances
  events = [],
    
  // trigger events, called by raf
  // the FrameEvent determines if it really should trigger
  triggerEvents = function() {
    for(var i=-1; events[++i];){
      events[i].trigger();
    }
    ticking = false;
  },    
  
  // raf trick
  requestTick = function() {
    if(!ticking) {
      ticking = true;
      Manager.raf.call(window, triggerEvents);
    }
  },
  
  // manages the event handlers and ticking
  Manager = {  
    // overwrite this to use or embed it in your own ticker
    raf: window.requestAnimationFrame,
    
    // bind event
    on: function(el, type, handler, domHandler) {
      events.push(new FrameEvent(el, type, handler, domHandler));
    },  
    
    // unbind
    off: function(el, type, handler) {      
      for(var i=-1; events[++i];){
        if(events[i].match(el, type, handler)) {
          events[i].destroy();
          events.splice(i, 1);
          return;
        }
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
