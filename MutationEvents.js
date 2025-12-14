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

const observerMap = (function() {
  const getOrNewMap = function(key) {
    if (this.has(key)) {
      return this.get(key);
    }

    const temp = new Map();
    temp.getOrNewMap = getOrNewMap;
    this.set(key, temp);
    return this.get(key);
  };

  const map = new Map();
  map.getOrNewMap = getOrNewMap;

  function get(el, type, listener, options) {
    const optionsJson = JSON.stringify(options || {});
    return map.getOrNewMap(el).getOrNewMap(type).getOrNewMap(listener).get(optionsJson);
  }

  function set(el, type, listener, options, observer) {
    const optionsJson = JSON.stringify(options || {});
    map.getOrNewMap(el).getOrNewMap(type).getOrNewMap(listener).set(optionsJson, observer);
  }

  function remove(el, type, listener, options) {
    const optionsJson = JSON.stringify(options || {});
    map.getOrNewMap(el).getOrNewMap(type).getOrNewMap(listener).delete(optionsJson);
  }

  function getValues() {
    const temp = new Map();

    for (const [elKey, elValue] of map) {
      for (const [typeKey, typeValue] of elValue) {
        for (const [listenerKey, listenerValue] of typeValue) {
          for (const [optionKey, optionsValue] of listenerValue) {
            temp.set({elKey, typeKey, listenerKey, optionKey}, optionsValue);
          }
        }
      }
    }

    return temp;
  }

  return  {
    get: get,
    set: set,
    remove: remove,
    get values() {
      return getValues();
    },
    get size() {
      return getValues().size;
    }
  };
})();

const eventTypes = {
  'added.element': {
    getObserveOptions: o => {
      return Object.assign({}, {childList: true, subtree: true}, o);
    },
    dispatchEvent: (mutation, options) => {
      const els = [...mutation.addedNodes].filter(n => n instanceof Element);
      els.forEach(el => el.dispatchEvent(new MutationEvent('added.element', mutation, options)));
    }
  },
  'removed.element': {
    getObserveOptions: o => {
      return Object.assign({}, {childList: true, subtree: true}, o);
    },
    dispatchEvent: (mutation, options) => {
      const els = [...mutation.removedNodes].filter(n => n instanceof Element);
      els.forEach(el => el.dispatchEvent(new MutationEvent('removed.element', mutation, options)));
    }
  }
}

function addMutationListener(el, type, listener, options) {
  const eventType = eventTypes[type];

  if (!el || !eventType || !listener) {
    return;
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => eventType.dispatchEvent(m, options));
  });

  observer.observe(el, eventType.getObserveOptions(options));
  el.addEventListener(type, listener, options);
  observerMap.get(el, type, listener, options)?.disconnect();
  observerMap.set(el, type, listener, options, observer);
}

function removeMutationListener(el, type, listener, options) {
  observerMap.get(el, type, listener, options)?.disconnect();
  observerMap.remove(el, type, listener, options);
  el.removeEventListener(type, listener, options);
}

export { addMutationListener, removeMutationListener };