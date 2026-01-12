// noinspection JSUnusedGlobalSymbols
import hljs from 'https://cdn.jsdelivr.net/npm/highlight.js@11.11/+esm';
import { Collapse, Toast } from "https://cdn.jsdelivr.net/npm/bootstrap@5.3/+esm";

function runTests(tests, selector) {
  const collapseEl = document.querySelector(selector);
  collapseEl.addEventListener('shown.bs.collapse', startTestsAfterShow);
  Collapse.getOrCreateInstance(collapseEl).show();

  async function startTestsAfterShow() {
    for (const test of tests) {
      await runTest(test);
    }
  }

  async function runTest(test) {
    try {
      const resultEl = await new Promise(test);
      resultEl.classList.replace('text-warning', 'text-success');
      resultEl.innerHTML = 'Success';
    }
    catch (resultEl) {
      resultEl.classList.replace('text-warning', 'text-danger');
      resultEl.innerHTML = 'Failed';
    }
  }
}

function simulateInputEvent(inputEl, value) {
  if (['radio', 'checkbox'].includes(inputEl.type)) {
    inputEl.checked = value;
  }
  else {
    inputEl.value = value;
  }
  inputEl.dispatchEvent(new Event('input', {bubbles: true}));
}

function initExamples() {
  for (const el of document.querySelectorAll('[data-code-target]')) {
    const template = getTemplateText(el.dataset.codeTarget);
    // noinspection JSUnresolvedReference
    const html = hljs.highlight(template, {language: 'xml'}).value;
    el.innerHTML = html.replaceAll('=<span class="hljs-string">', '<span class="hljs-string">=');
  }

  document.body.insertAdjacentHTML('beforeend', `
    <div class="position-relative">
      <div class="toast-container position-fixed bottom-0 end-0 m-3">
        <div id="copyToast" class="toast border-success" role="alert">
          <div class="toast-body">Code Copied!</div>
        </div>
      </div>
    </div>
  `);

  const toastEl = document.querySelector('#copyToast');
  const toast = new Toast(toastEl, {delay: 2000});
  document.addEventListener('click', async function(e) {
    const clipboardEl = e.target.closest('[data-clipboard]');
    if (clipboardEl) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const template = getTemplateText(clipboardEl.dataset.clipboard);
      await navigator.clipboard.writeText(template);
      toast.show();
    }
  });

  function getTemplateText(selector) {
    const template = document.querySelector(selector).innerHTML;
    const whitespace = template.match(/^\n(\s*)/)[1];
    const html = template.replaceAll('\n' + whitespace, '\n').trim();
    return html.replaceAll('=""', '');
  }
}

export { runTests, simulateInputEvent, initExamples }