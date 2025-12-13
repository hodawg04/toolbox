// noinspection JSUnusedGlobalSymbols

class MutationEvent extends Event {
  constructor(type, mutation, options) {
    super(type, Object.assign({}, {bubbles: true, cancelable: true}, options));
    Object.defineProperty(this, 'attributeName', {value: mutation.attributeName});
    Object.defineProperty(this, 'attributeNamespace', {value: mutation.attributeNamespace});
    Object.defineProperty(this, 'nextSibling', {value: mutation.nextSibling});
    Object.defineProperty(this, 'oldValue', {value: mutation.oldValue});
    Object.defineProperty(this, 'previousSibling', {value: mutation.previousSibling});
    Object.defineProperty(this, 'relatedTarget', {value: mutation.target});
    Object.defineProperty(this, 'mutationType', {value: mutation.type});
  }
}

function initShim() {
  const superAddEventListener = EventTarget.prototype.addEventListener;
  const superRemoveEventListener = EventTarget.prototype.removeEventListener;
  const typeSettings = {
    'element-added': {
      config: {childList: true, subtree: true},
      dispatchEvent: m => {
        const els = [...m.addedNodes].filter(n => n instanceof Element);
        els.forEach(el => el.dispatchEvent(new MutationEvent('element-added', m)));
      },
      listeners: {'true' : new Map(), 'false' : new Map()}
    },
    'element-removed': {
      config: {childList: true, subtree: true},
      dispatchEvent: m => {
        const els = [...m.removedNodes].filter(n => n instanceof Element);
        els.forEach(el => el.dispatchEvent(new MutationEvent('element-removed', m)));
      },
      listeners: {'true' : new Map(), 'false' : new Map()}
    },
  }

  EventTarget.prototype.addEventListener = function(type, listener, options) {
    const settings = typeSettings[type];

    if (settings) {
      const observer = new MutationObserver(m => m.forEach(settings.dispatchEvent));
      observer.observe(this, Object.assign({}, settings.config, options));
      settings.listeners[getCaptureFlag(options)].set(listener, observer);
    }

    superAddEventListener.call(this, type, listener, options);
  }

  EventTarget.prototype.removeEventListener = function(type, listener, options) {
    const settings = typeSettings[type];

    if (settings) {
      const map = settings.listeners[getCaptureFlag(options)];
      const observer = map.get(listener);

      if (observer) {
        observer.disconnect();
        map.delete(listener);
      }
    }

    superRemoveEventListener.call(this, type, listener, options);
  }

  function getCaptureFlag(options) {
    if (typeof options === 'object' && typeof options.capture === 'boolean') {
      return options.capture;
    }
    if (typeof options === 'boolean') {
      return options;
    }
    return false;
  }
}

export { initShim };