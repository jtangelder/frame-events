/*! Frame Events
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */
(function(window){
  
  // instance per event
  function FrameEvent(manager, element, eventType) {
    this.manager = manager;
    this.element = element;
    this.eventType = eventType;
    this.handlers = [];
    
    this.element.addEventListener(eventType, this.frameEvent.bind(this), false);
  }
  
  // request tick and execute the preventDefault methods
  FrameEvent.prototype.frameEvent = function(ev) {
    this.handlers.forEach(function(handler) {
      if(handler.dataHandler) {
        handler.data = handler.dataHandler(ev);
      }
    });
    
    this.eventData = ev;
    this.manager.requestTick(this);
  };
  
  // trigger handles of this type
  FrameEvent.prototype.triggerHandlers = function() {
    if(this.eventData) {
      this.handlers.forEach(function(handler) {
        handler.eventHandler(this.eventData, handler.data);
      }.bind(this));
      this.eventData = null;
    }
  };
  
  // unbind
  FrameEvent.prototype.destroy = function() {
    this.element.removeEventListener(this.eventType, this.frameEvent)
  };
  
  
  
  // manages the event handlers and ticking
  function Manager() { 
    this.events = {};
    
    // overwrite this to use or embed it in your own ticker
    this.raf = window.requestAnimationFrame;
    this.uidp = '__feuid'
    
    this.ticking = false;
    this.uid = 1;
  } 
  
  // bind handlers
  Manager.prototype.on = function(element, type, eventHandler, dataHandler) {
    var uid = element[this.uidp] || (element[this.uidp] = this.uid++);    
    if(!this.events[uid]) {
      this.events[uid] = {}
    }
    if(!this.events[uid][type]) {
      this.events[uid][type] = new FrameEvent(this, element, type)
    }
    
    this.events[uid][type].handlers.push({ 
      eventHandler: eventHandler, 
      dataHandler: dataHandler
    });
  };    
  
  // unbind handlers
  Manager.prototype.off = function(element, type, eventHandler) {
    var uid = element[this.uidp], 
      handlers;    
    
    if(uid && this.events[uid] && this.events[uid][type]) {
      handlers = this.events[uid][type].handlers;
      handlers.forEach(function(handler, index) {
        if(eventHandler === handler.eventHandler) {
          handlers.splice(index, 1)
        }
      });
      
      // no handlers left, remove the FrameEvent instance
      if(!handlers.length) {
        this.events[uid][type].destroy();
        delete this.events[uid][type];
      }
    }
  };
  
  // trigger events, can be used to force updates
  Manager.prototype.triggerEvents = function() {
    var uid, type;
    for(uid in this.events) {
      for(type in this.events[uid]) {
        this.events[uid][type].triggerHandlers();
      }
    }
    
    this.ticking = false;
  };      
    
  // requestanimationframe
  Manager.prototype.requestTick = function() {
    if(!this.ticking) {
      this.ticking = true;
      this.raf.call(window, this.triggerEvents.bind(this));
    }
  };
  
  
  // commonjs export
  if(typeof(module) !== 'undefined' && module.exports) {
    module.exports = new Manager();
  }
  else {
    window.FrameEvents = new Manager();
  }
})(window);
