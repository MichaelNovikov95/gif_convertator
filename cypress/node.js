const cypress = require("cypress");
const fs = require("fs");
const path = require("path");

const spec = "cypress/e2e/load-test/load-test.cy.ts";
const tempStorageDir = path.resolve(__dirname, "../shared-temp-storage");

function deleteTempFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      return console.error("Error reading directory:", err);
    }

    files.forEach((file) => {
      if (path.extname(file) === ".gif") {
        const filePath = path.join(directory, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", filePath, err);
          } else {
            console.log("Deleted file:", filePath);
          }
        });
      }
    });
  });
}

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
