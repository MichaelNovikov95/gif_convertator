import cypress from "cypress";
import path from "path";
import { fileURLToPath } from "url";

import { deleteTempFiles } from "./services/cypress.service.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spec = "cypress/e2e/load-test/load-test.cy.ts";
const tempStorageDir = path.resolve(__dirname, "../shared-temp-storage");

cypress
  .run({
    spec: spec,
    headless: true,
  })
  .then((results) => {
    console.log("Tests completed:", results);

    deleteTempFiles(tempStorageDir);
  })
  .catch((error) => {
    console.error("Error running tests:", error);
  });
