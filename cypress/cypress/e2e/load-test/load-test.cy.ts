/// <reference types="cypress" />

describe("Load testing", () => {
  it("should load", () => {
    const videoFilePath = "demo.mp4";

    cy.fixture(videoFilePath, "base64").then((fileContent) => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, "image/gif");
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
    });
  });
});
