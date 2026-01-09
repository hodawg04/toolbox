import { runTests } from "/test/assets/TestUtils.js";

function initTests(selector) {
  // import then init lib here

  runTests([
    test
  ], selector);
}

function test(resolve, reject) {
  const resultEl = document.querySelector('#exampleResult');
  let success;

  // report success or failure with the following example
  success ? resolve(resultEl) : reject(resultEl);
}

export { initTests }