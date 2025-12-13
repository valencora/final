describe('Blog API Tests', () => {
  let authToken;
  let createdBlogId;

  beforeEach(() => {
    // Login via API before each test
    cy.loginViaAPI('admin', 'admin').then((response) => {
      authToken = response.id_token;
      Cypress.env('token', authToken);
    });
  });

  it('should create a new blog via API', () => {
    const newBlog = {
      name: 'Cypress Test Blog',
      handle: 'cypress-test-blog',
      description: 'This is a test blog created by Cypress',
    };

    cy.authenticatedRequest('POST', '/api/blogs', newBlog).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body.name).to.eq(newBlog.name);
      expect(response.body.handle).to.eq(newBlog.handle);
      createdBlogId = response.body.id;
    });
  });

  it('should get all blogs via API after login', () => {
    cy.authenticatedRequest('GET', '/api/blogs').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should get a specific blog by ID via API', () => {
    // First create a blog
    const newBlog = {
      name: 'Test Blog for Get',
      handle: 'test-blog-get',
      description: 'Test description',
    };

    cy.authenticatedRequest('POST', '/api/blogs', newBlog).then((createResponse) => {
      const blogId = createResponse.body.id;
      
      // Then get it
      cy.authenticatedRequest('GET', `/api/blogs/${blogId}`).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.id).to.eq(blogId);
        expect(getResponse.body.name).to.eq(newBlog.name);
      });
    });
  });

  afterEach(() => {
    // Cleanup: Delete created blog if it exists
    if (createdBlogId) {
      cy.authenticatedRequest('DELETE', `/api/blogs/${createdBlogId}`);
    }
  });
});

