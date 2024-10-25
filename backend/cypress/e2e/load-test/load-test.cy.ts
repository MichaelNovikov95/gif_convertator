/// <reference types="cypress" />

describe("Load Test for Video Upload", () => {
  it("should handle 100 requests in one minute", () => {
    const requests = 100;
    const videoFilePath = "demo.mp4";

    cy.fixture(videoFilePath, "binary").then((fileContent) => {
      const blob = Cypress.Blob.binaryStringToBlob(fileContent);
      const formData = new FormData();
      formData.append("video", blob, videoFilePath);

      const startTime = Date.now();

      const requestsPromises: Cypress.Chainable<Cypress.Response<any>>[] = [];

      for (let i = 0; i < requests; i++) {
        const requestPromise = cy
          .request({
            method: "POST",
            url: "http://localhost:3000/test",
            body: formData,
            headers: {
              "Accept": "application/json",
            },
            failOnStatusCode: false,
          })
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.headers["content-type"]).to.include("image/gif");

            const gifFileName = `output-${Date.now()}.gif`;
            cy.writeFile(
              `cypress/downloads/${gifFileName}`,
              response.body,
              "binary"
            );
          });

        requestsPromises.push(requestPromise);
      }

      Cypress.Promise.all(requestsPromises).then(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        expect(duration).to.be.lessThan(60001);
      });
    });
  });
});
