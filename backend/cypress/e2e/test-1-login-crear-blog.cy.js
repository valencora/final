describe('Test 1: Login y Crear Blog', () => {
  it('debe hacer login y crear un blog', () => {
    // Hacer login visualmente
    cy.visit('/login');
    cy.get('[data-cy="loginTitle"]').should('be.visible').and('contain', 'Sign in');
    
    cy.get('[data-cy="username"]').type('admin');
    cy.get('[data-cy="password"]').type('admin');
    cy.get('[data-cy="submit"]').click();

    // Verificar que el login fue exitoso
    cy.url().should('not.include', '/login');
    cy.get('[data-cy="loginError"]').should('not.exist');

    // Obtener el número de blogs existentes usando la API para generar handle único
    cy.loginViaAPI('admin', 'admin').then(() => {
      cy.authenticatedRequest('GET', '/api/blogs').then((blogsResponse) => {
        const numeroBlogs = blogsResponse.body.length;
        const handleNumero = (numeroBlogs + 1).toString();

        // Navegar a la página de blogs
        cy.visit('/blog');
        cy.get('[data-cy="BlogHeading"]').should('be.visible');
        cy.get('[data-cy="BlogHeading"]').should('contain', 'Blogs');

        // Crear un nuevo blog
        cy.get('[data-cy="entityCreateButton"]').click();
        cy.url().should('include', '/blog/new');
        cy.get('[data-cy="BlogCreateUpdateHeading"]').should('be.visible');
        cy.get('[data-cy="BlogCreateUpdateHeading"]').should('contain', 'Create or edit a Blog');

        // Llenar el formulario del blog
        const nombreBlog = 'Blog de Prueba E2E';
        const descripcionBlog = 'Este blog fue creado en el primer test E2E y será modificado y eliminado en los siguientes tests';

        cy.get('[data-cy="name"]').type(nombreBlog);
        cy.get('[data-cy="handle"]').type(handleNumero);
        cy.get('[data-cy="description"]').type(descripcionBlog);

        // Guardar el blog
        cy.get('[data-cy="entityCreateSaveButton"]').click();
        cy.wait(1000);

        // Verificar que el blog fue creado exitosamente
        cy.url().should('satisfy', (url) => url.includes('/blog'));
        cy.contains(nombreBlog).should('be.visible');
        cy.contains(handleNumero).should('be.visible');
      });
    });
  });
});

