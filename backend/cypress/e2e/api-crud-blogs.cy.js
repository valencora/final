describe('Blog CRUD Operations via API', () => {
  let authToken;
  let blogId;

  before(() => {
    cy.loginViaAPI('admin', 'admin').then((response) => {
      authToken = response.id_token;
      Cypress.env('token', authToken);
    });
  });

  it('should perform full CRUD operations on blogs', () => {
    // CREATE
    const newBlog = {
      name: 'CRUD Test Blog',
      handle: 'crud-test-blog',
      description: 'Initial description',
    };

    cy.authenticatedRequest('POST', '/api/blogs', newBlog).then((createResponse) => {
      expect(createResponse.status).to.eq(201);
      blogId = createResponse.body.id;
      expect(createResponse.body.name).to.eq(newBlog.name);

      // READ
      cy.authenticatedRequest('GET', `/api/blogs/${blogId}`).then((readResponse) => {
        expect(readResponse.status).to.eq(200);
        expect(readResponse.body.id).to.eq(blogId);

        // UPDATE
        const updatedBlog = {
          id: blogId,
          name: 'Updated CRUD Test Blog',
          handle: 'crud-test-blog',
          description: 'Updated description',
        };

        cy.authenticatedRequest('PUT', `/api/blogs/${blogId}`, updatedBlog).then((updateResponse) => {
          expect(updateResponse.status).to.eq(200);
          expect(updateResponse.body.name).to.eq(updatedBlog.name);
          expect(updateResponse.body.description).to.eq(updatedBlog.description);

          // DELETE
          cy.authenticatedRequest('DELETE', `/api/blogs/${blogId}`).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(204);

            // Verify deletion
            cy.request({
              method: 'GET',
              url: `/api/blogs/${blogId}`,
              headers: {
                'Authorization': `Bearer ${authToken}`,
              },
              failOnStatusCode: false,
            }).then((verifyResponse) => {
              expect(verifyResponse.status).to.eq(404);
            });
          });
        });
      });
    });
  });
});

