const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "9zohkt",
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://localhost:3000",
    supportFile: false,
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
});

// module.exports = defineConfig({
//   projectId: "9zohkt",
//   video: true, // Optional: Enable video recording
//   reporter: "spec", // Optional: Specify the reporter
//   env: {
//     CYPRESS_RECORD_KEY: "90c5b836-69dc-48bd-ba0e-895f32ee58d6",
//   },
//   e2e: {
//     setupNodeEvents(on, config) {},
//     supportFile: false,
//     baseUrl: "http://localhost:3000", // Replace with your base URL
//   },
// });
