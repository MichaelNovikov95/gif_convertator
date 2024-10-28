const cypress = require("cypress");

const usersCount = 100;
const startingNumber = 10;
const usernamePrefix = "TestUser";

const testMethods = [{ spec: "cypress/e2e/load-test/load-test.cy.ts" }];

async function runTests(username) {
  const results = {};

  for (const { name, spec } of testMethods) {
    try {
      const testResults = await cypress.run({
        headless: true,
        parallel: false,
        spec: [spec],
        env: {
          perfUsername: username,
        },
        exit: true,
        name: name,
      });
      results[name] = testResults.totalFailed === 0 ? "Pass" : "Fail";
    } catch (error) {
      console.error(`Error running ${name} tests for user ${username}:`, error);
      results[name] = "Error";
    }
  }
}

async function runTestsAsync() {
  for (let i = startingNumber; i < startingNumber + usersCount; i++) {
    const username = `${usernamePrefix}${i}@gmail.com`;
    runTests(username);
  }
}

runTestsAsync();
