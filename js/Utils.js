// noinspection JSUnusedGlobalSymbols

import { Modal } from "bootstrap";

function getContext() {
  return window.location.pathname.substring(0, window.location.pathname.indexOf('/', 1));
}

let isInitModalAutofocusInitialized = false;

function initModalAutofocus() {
  if (!isInitModalAutofocusInitialized) {
    document.addEventListener('shown.bs.modal', function(e) {
      const els = e.target.querySelectorAll('[autofocus]');
      [...els].filter(el => el.checkVisibility())?.[0]?.focus();
    });
    isInitModalAutofocusInitialized = true;
  }
}

function initCollapseAutoFocus() {
  document.addEventListener('shown.bs.collapse', function(e) {
    const inputs = e.target.querySelectorAll('[name]:not(.no-focus)');
    [...inputs].filter(e => e.checkVisibility())?.[0]?.focus();
  });
}

function initModalShowOnError() {
  for (const modalEl of document.querySelectorAll('.modal')) {
    const invalidEl = modalEl.querySelector('.is-invalid, .alert.alert-danger');

    if (invalidEl && modalEl.parentElement.checkVisibility()) {
      modalEl.addEventListener('shown.bs.modal', scrollToInvalidEl);
      Modal.getOrCreateInstance(modalEl).show();
    }

    function scrollToInvalidEl() {
      invalidEl.scrollIntoView({behavior: 'smooth', block: 'center'});
      modalEl.removeEventListener('shown.bs.modal', scrollToInvalidEl);
    }
  }
}

export { getContext, initModalAutofocus, initCollapseAutoFocus, initModalShowOnError };