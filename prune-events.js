var PruneEvents = (function(window){
  
  // instance per event
  function FPSEvent(manager, eventType) {
    this.manager = manager;
    this.eventType = eventType;
    
    // initial values
    this.reset();
    
    this.manager.element.addEventListener(eventType, this.frameEvent.bind(this), false);
  }
  
  // request tick and execute the preventDefault methods
  FPSEvent.prototype.frameEvent = function(ev) {
    if(this.shouldPreventDefault) { ev.preventDefault(); }
    if(this.shouldStopPropagation) { ev.stopPropagation(); }
    if(this.shouldStopImmediatePropagation) { ev.stopImmediatePropagation(); }
    
    this.eventData = ev;
    this.manager.requestTick(this);
  };
  
  // set new preventDefault methods
  // they will get executed when the next dom event occurs
  // useful for the 'touchmove' event
  FPSEvent.prototype.prepareEventData = function() {
    this.shouldPreventDefault = false;
    this.shouldStopPropagation = false;
    this.shouldStopImmediatePropagation = false;
    
    this.eventData.preventDefault = function(){ this.shouldPreventDefault = true;}.bind(this);
    this.eventData.stopPropagation = function(){ this.shouldStopPropagation = true;}.bind(this);
    this.eventData.stopImmediatePropagation = function(){ this.shouldStopImmediatePropagation = true;}.bind(this);
    
    return this.eventData;
  };
  
  // reset
  FPSEvent.prototype.reset = function() {
    this.eventData = null;
  };
  
  // unbind
  FPSEvent.prototype.destroy = function() {
    this.manager.element.removeEventListener(this.eventType, this.frameEvent)
  };
  
  
  
  // manages the event handlers and ticking
  function Manager(element) { 
    this.element = element;
    
    this.handlers = {};
    this.ev_instances = {};
    
    // overwrite this to use or embed it in your own ticker
    this.raf = window.requestAnimationFrame;
    
    this.ticking = false;
  }    
  
  // bind new handlers
  Manager.prototype.on = function(type, handler) {
    if(!this.ev_instances[type]) {
      this.ev_instances[type] = new FPSEvent(this, type)
    }
    
    this.handlers[type] = this.handlers[type] || [];
    this.handlers[type].push(handler);
  };    
  
  Manager.prototype.off = function(type, handler) {
    if(this.handlers[type]) {
      // remove the handler
      while(this.handlers[type].splice(this.handlers[type].indexOf(handler), 1).length);
      
      // no handlers left, remove the FPSEvent instance
      if(!this.handlers[type].length) {
        this.ev_instances[type].destroy();
        delete this.ev_instances[type];
      }
    }
  };
  
  // trigger handles
  Manager.prototype.triggerHandlers = function(type, ev) {
    if(this.handlers[type]) {
      this.handlers[type].forEach(function(handler) {
        handler(ev);
      });
    }
  };   
    
  // trigger events, can be used to force updates
  Manager.prototype.triggerEvent = function() {
    var type, inst;
    for(type in this.ev_instances) {
      inst = this.ev_instances[type];        
      if(inst && inst.eventData) {
        this.triggerHandlers(type, inst.prepareEventData());
        inst.reset();
      }
    }
    
    this.ticking = false;
  };      
    
  // requestanimationframe
  Manager.prototype.requestTick = function(inst) {
    if(!this.ticking) {
      this.ticking = true;
      this.raf.call(window, this.triggerEvent.bind(this));
    }
  };
  
  return Manager;
})(window || global);