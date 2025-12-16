// noinspection JSUnusedGlobalSymbols

//https://robinherbots.github.io/Inputmask/
import Inputmask from 'https://cdn.jsdelivr.net/npm/inputmask@5.0.9/+esm';

function yearMask(selector = '[data-isp-toggle="year-mask"]') {
  const options = {alias: 'datetime', inputFormat: 'yyyy', inputmode: 'numeric'};

  Inputmask.default(options).mask(selector);
  observe(selector, el => Inputmask.default(options).mask(el));
}

function monthYearMask(selector = '[data-isp-toggle="month-year-mask"]') {
  const options = {alias: 'datetime', inputFormat: 'mm/yyyy', inputmode: 'numeric'};

  Inputmask.default(options).mask(selector);
  observe(selector, el => Inputmask.default(options).mask(el));
}

function dateMask(selector = '[data-isp-toggle="date-mask"]') {
  const options = {alias: 'datetime', inputFormat: 'mm/dd/yyyy', inputmode: 'numeric'};

  Inputmask.default(options).mask(selector);
  observe(selector, el => Inputmask.default(options).mask(el));
}

function dateTimeMask(selector = '[data-isp-toggle="date-time-mask"]') {
  const options = {alias: 'datetime', inputFormat: 'mm/dd/yyyy HH:MM', inputmode: 'numeric'};

  Inputmask.default(options).mask(selector);
  observe(selector, el => Inputmask.default(options).mask(el));
}

function phoneMask(selector = '[data-isp-toggle="phone-mask"]') {
  const options = {mask: '999-999-9999', placeholder: '#', inputmode: 'numeric'};

  Inputmask.default(options).mask(selector);
  observe(selector, el => Inputmask.default(options).mask(el));
}

function zipMask(selector = '[data-isp-toggle="zip-mask"]') {
  const options = {mask: '99999[-9999]', placeholder: '#', inputmode: 'numeric'};

  Inputmask.default(options).mask(selector);
  observe(selector, el => Inputmask.default(options).mask(el));
}

function ssnMask(selector = '[data-isp-toggle="ssn-mask"]') {
  const options = {mask: '999-99-9999', placeholder: '#', inputmode: 'numeric'};

  Inputmask.default(options).mask(selector);
  observe(selector, el => Inputmask.default(options).mask(el));
}

function decimalMask(selector = '[data-isp-toggle="decimal-mask"]') {
  const options = {alias: 'decimal', groupSeparator: ',', digits: 2, digitsOptional: false, inputmode: 'numeric'};

  Inputmask.default(options).mask(selector);
  observe(selector, el => Inputmask.default(options).mask(el));
}

function observe(selector, onAdd) {
  const callback = records => [...records].flatMap(r => find([...r.addedNodes])).forEach(onAdd);
  new MutationObserver(callback).observe(document.body, {subtree: true, childList: true});

  function find(node) {
    if (!(node instanceof Element)) {
      return []
    }
    if (node.matches(selector)) {
      return [node];
    }
    return [...node.querySelectorAll(selector)];
  }
}

export { yearMask, monthYearMask, dateMask, dateTimeMask, phoneMask, zipMask, ssnMask, decimalMask };