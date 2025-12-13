describe('Blog API - Handle Search Tests', () => {
  let authToken;
  let createdBlogId;

  beforeEach(() => {
    cy.loginViaAPI('admin', 'admin').then((response) => {
      authToken = response.id_token;
      Cypress.env('token', authToken);
    });
  });

  it('should find a blog by handle via API', () => {
    const handle = 'handle-search-test';
    const newBlog = {
      name: 'Handle Search Test Blog',
      handle: handle,
      description: 'Testing handle search functionality',
    };

    // Create blog first
    cy.authenticatedRequest('POST', '/api/blogs', newBlog).then((createResponse) => {
      createdBlogId = createResponse.body.id;
      
      // Then search by handle
      cy.authenticatedRequest('GET', `/api/blogs/handle/${handle}`).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.handle).to.eq(handle);
        expect(getResponse.body.name).to.eq(newBlog.name);
      });
    });
  });

  it('should return 404 for non-existent handle', () => {
    cy.request({
      method: 'GET',
      url: '/api/blogs/handle/non-existent-handle',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  afterEach(() => {
    if (createdBlogId) {
      cy.authenticatedRequest('DELETE', `/api/blogs/${createdBlogId}`);
    }
  });
});

