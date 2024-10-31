/// <reference types="cypress" />

describe("Load testing", () => {
  it("should load 100 times and delete each GIF", () => {
    const videoFilePath = "demo.mp4";
    const numberOfRepetitions = 100;
    const requests: Cypress.Chainable[] = [];

    for (let i = 0; i < numberOfRepetitions; i++) {
      requests.push(
        cy.fixture(videoFilePath, "base64").then((fileContent) => {
          const blob = Cypress.Blob.base64StringToBlob(
            fileContent,
            "video/mp4"
          );
          const formData = new FormData();
          formData.append("video", blob);

          return cy.request({
            method: "POST",
            url: "/api/videos/convert",
            headers: {
              "Content-Type": "multipart/form-data",
            },
            body: formData,
            failOnStatusCode: false,
            timeout: 600000,
          });
        })
      );
    }

    Cypress.Promise.all(requests).then((responses) => {
      console.log("All requests are completed successfully.");
    });
  });
});
