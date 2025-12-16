// noinspection JSUnusedGlobalSymbols

async function runTests(tests) {
  for (const test of tests) {
    try {
      const result = await new Promise(test);
      showSuccess(result);
    }
    catch (err) {
      showFailure(err);
    }
  }

  function showSuccess(resultEl) {
    resultEl.classList.replace('text-warning', 'text-success');
    resultEl.innerHTML = 'Success';
  }

  function showFailure(resultEl) {
    resultEl.classList.replace('text-warning', 'text-danger');
    resultEl.innerHTML = 'Failed';
  }
}

function simulateInput(inputEl, value) {
  if (['radio', 'checkbox'].includes(inputEl.type)) {
    inputEl.checked = value;
  }
  else {
    inputEl.value = value;
  }
  inputEl.dispatchEvent(new Event('input', {bubbles: true}));
}

function preventSubmit() {
  document.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    alert('BOOM!!! TEST FAILED!!! You should not have gotten here!!!');
  });
}

export { runTests, simulateInput, preventSubmit }