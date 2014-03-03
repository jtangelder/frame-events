/*! Frame Events
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

(function(window){   
  
  function FrameEvent(el, type, handler, domHandler) {
    var _data, _ev;
    
    // setup
    el.addEventListener(type, frameEvent, false); 
        
    // request tick for the event 
    function frameEvent(ev) {
      // collect data if there is a handler
      _data = domHandler && domHandler.call(el, ev);      
      _ev = ev;
      
      Manager.requestTick();
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
      el.removeEventListener(type, frameEvent);
    };
    
    // test if the arguments are matching, this is used for removing the event
    this.match = function(m_el, m_type, m_handler) {
      return el == m_el && type == m_type && handler == m_handler
    }
  }
  
  
  // raf state
  var ticking = false;
  
  // holds all frame event instances
  var events = [];
  
  // manages the event handlers and ticking
  var Manager = {  
    // overwrite this to use or embed it in your own ticker
    raf: window.requestAnimationFrame,
    
    // bind event
    on: function(el, type, handler, domHandler) {
      events.push(new FrameEvent(el, type, handler, domHandler));
    },  
    
    // unbind
    off: function(el, type, handler) {      
      for(var i= 0, len=events.length; i<len; i++) {
        if(events[i].match(el, type, handler)) {
          events[i].destroy();
          events.splice(i, 1);
          return;
        }
      }
    },
    
    // trigger events, called by raf
    // the FrameEvent determines if it really should trigger
    trigger: function() {
      for(var i= 0, len=events.length; i<len; i++) {
        events[i].trigger();
      }
      ticking = false;
    },    
    
    requestTick: function() {
      if(!ticking) {
        ticking = true;
        this.raf.call(window, this.trigger);
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
