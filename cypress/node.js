const cypress = require("cypress");

const username = "TestUser6000@wso2.com";
const testMethods = [{ spec: "cypress/e2e/load-test/load-test.cy.ts" }];

async function runTests(username) {
  console.log("Running tests for:", username);
  const results = {};

  for (const { spec } of testMethods) {
    try {
      const testResults = await cypress.run({
        headless: true,
        parallel: false,
        spec: [spec],
        env: {
          perfUsername: username,
        },
        exit: true,
      });
      console.log(`Tests completed for user ${username}`);
      results[spec] = testResults.totalFailed === 0 ? "Pass" : "Fail";
    } catch (error) {
      console.error(`Error running tests for user ${username}:`, error);
      results[spec] = "Error";
    }
  }

  return results;
}

async function runTestsAsync() {
  console.log(`Running test for a single user: ${username}`);
  await runTests(username);
}

runTestsAsync();
