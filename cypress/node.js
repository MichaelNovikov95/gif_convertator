const cypress = require("cypress");
// const { exec } = require('child_process');
const usersCount = 10;
const startingNumber = 6000;
const usernamePrefix = "TestUser";

const testMethods = [{ spec: "cypress/e2e/load-test/load-test.cy.ts" }];

async function runTests(username) {
  console.log("Username:", username);
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
      console.log(`${name} tests completed for user ${username}`);
      results[name] = testResults.totalFailed === 0 ? "Pass" : "Fail";
    } catch (error) {
      console.error(`Error running ${name} tests for user ${username}:`, error);
      results[name] = "Error";
    }
  }
}

async function runTestsAsync() {
  for (let i = startingNumber; i < startingNumber + usersCount; i++) {
    console.log(`Running tests for user ${i}`);
    const username = `${usernamePrefix}${i}@wso2.com`;
    runTests(username);
  }
}

runTestsAsync();
