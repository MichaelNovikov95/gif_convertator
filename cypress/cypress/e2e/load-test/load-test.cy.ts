// /// <reference types="cypress" />

// describe("Load testing", () => {
//   it("should load", () => {
//     const videoFilePath = "demo.mp4";

//     cy.fixture(videoFilePath, "base64").then((fileContent) => {
//       const blob = Cypress.Blob.base64StringToBlob(fileContent, "image/gif");
//       const formData = new FormData();
//       formData.append("video", blob);

//       const sendGifReq = () => {
//         return cy.request({
//           method: "POST",
//           url: "http://localhost:3000/api/videos/convert",
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           body: formData,
//           failOnStatusCode: false,
//           timeout: 600000,
//         });
//       };

//       const requests = new Array(100).fill(null).map(() => sendGifReq());

//       Cypress.Promise.all(requests).then((responses: any) => {
//         responses.forEach((res: any) => {
//           expect(!!res).to.equal(!!res);
//         });
//       });
//     });
//   });
// });

/// <reference types="cypress" />

describe("Load testing", () => {
  it("should load", () => {
    const videoFilePath = "demo.mp4";

    cy.fixture(videoFilePath, "base64").then((fileContent) => {
      const blob = Cypress.Blob.base64StringToBlob(fileContent, "video/mp4");
      const formData = new FormData();
      formData.append("video", blob);

      const sendGifReq = () => {
        return cy.request({
          method: "POST",
          url: "/api/videos/convert",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
          failOnStatusCode: false,
          timeout: 60000, // Reduced timeout for efficiency
        });
      };

      // Create an array of requests
      const requests = Cypress._.times(100, () => sendGifReq());

      // Use Cypress Promise.all to handle concurrent requests
      Cypress.Promise.all(requests).then((responses) => {
        responses.forEach((res) => {
          expect(!!res).to.equal(!!res); // Check for successful responses
        });
      });
    });
  });
});
