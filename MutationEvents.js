// noinspection JSUnusedGlobalSymbols

class MutationEvent {
  constructor(type, target, mutation) {
    Object.defineProperty(this, 'attributeName', {value: mutation.attributeName});
    Object.defineProperty(this, 'attributeNamespace', {value: mutation.attributeNamespace});
    Object.defineProperty(this, 'nextSibling', {value: mutation.nextSibling});
    Object.defineProperty(this, 'oldValue', {value: mutation.oldValue});
    Object.defineProperty(this, 'previousSibling', {value: mutation.previousSibling});
    Object.defineProperty(this, 'relatedTarget', {value: mutation.target});
    Object.defineProperty(this, 'target', {value: target});
    Object.defineProperty(this, 'mutationType', {value: mutation.type});
    Object.defineProperty(this, 'type', {value: type});
  }
}

function initMutationListeners() {
  function dispatchAddListener(mutation, listener) {
    const els = [...mutation.addedNodes].filter(n => n instanceof Element);
    els.forEach(el => listener.call(el, new MutationEvent('element-added', el, mutation)));
  }

  function dispatchRemoveListener(mutation, listener) {
    const els = [...mutation.removedNodes].filter(n => n instanceof Element);
    els.forEach(el => listener.call(el, new MutationEvent('element-removed', el, mutation)));
  }

  const typeSettings = {
    'element-added': {
      config: {childList: true, subtree: true},
      dispatchEvent: dispatchAddListener,
      listeners: new Map()
    },
    'element-removed': {
      config: {childList: true, subtree: true},
      dispatchEvent: dispatchRemoveListener,
      listeners: new Map()
    },
  }

  initAddMutationListener(typeSettings);
  initRemoveMutationListener(typeSettings);
}

function initAddMutationListener(typeSettings) {
  if (EventTarget.prototype.addMutationListener) {
    return;
  }

  EventTarget.prototype.addMutationListener = function(type, listener, options) {
    const settings = typeSettings[type];

    if (settings) {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(m => settings.dispatchEvent(m, listener));
      });

      observer.observe(this, Object.assign({}, settings.config, options));
      settings.listeners.set(listener, observer);
    }
  }
}

function initRemoveMutationListener(typeSettings) {
  if (EventTarget.prototype.removeMutationListener) {
    return;
  }

  EventTarget.prototype.removeMutationListener = function(type, listener) {
    const settings = typeSettings[type];

    if (settings) {
      const observer = settings.listeners.get(listener);

      if (observer) {
        observer.disconnect();
        settings.listeners.delete(listener);
      }
    }
  }
}

export { initMutationListeners };