/// <reference types="cypress" />

describe("Load Test for Video Upload", () => {
  Cypress._.times(100, (index) => {
    it(`should upload video and save GIF response - run #${index + 1}`, () => {
      const videoFilePath = "demo.mp4";
      const outputDir = "cypress/downloads";

      cy.fixture(videoFilePath, "binary").then((fileContent) => {
        cy.task("uploadVideo", { fileContent, videoFilePath, outputDir }).then(
          (result: any) => {
            if (result.success) {
              cy.log("GIF saved at:", result.path);
              cy.readFile(result.path, "binary").should("exist");
            } else {
              throw new Error(`Upload failed: ${result.error}`);
            }
          }
        );
      });
    });
  });
});
