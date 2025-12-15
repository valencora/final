describe('Test 2: Modificar Blog', () => {
  it('debe modificar el blog creado en el test anterior', () => {
    // Hacer login visualmente
    cy.visit('/login');
    cy.get('[data-cy="loginTitle"]').should('be.visible').and('contain', 'Sign in');
    
    cy.get('[data-cy="username"]').type('admin');
    cy.get('[data-cy="password"]').type('admin');
    cy.get('[data-cy="submit"]').click();

    // Verificar que el login fue exitoso
    cy.url().should('not.include', '/login');
    cy.get('[data-cy="loginError"]').should('not.exist');

    // Navegar a la página de blogs
    cy.visit('/blog');
    cy.get('[data-cy="BlogHeading"]').should('be.visible');

    // Buscar el blog "Blog de Prueba E2E" creado en el test anterior
    cy.contains('Blog de Prueba E2E')
      .closest('tr')
      .within(() => {
        cy.get('[data-cy="entityEditButton"]').click();
      });

    // Verificar que estamos en la página de edición
    cy.url().should('include', '/blog/');
    cy.url().should('include', '/edit');
    cy.get('[data-cy="BlogCreateUpdateHeading"]').should('be.visible');
    cy.get('[data-cy="BlogCreateUpdateHeading"]').should('contain', 'Create or edit a Blog');

    // Obtener el handle actual para mantenerlo
    cy.get('[data-cy="handle"]').then(($input) => {
      const handleActual = $input.val();

      // Modificar los campos del blog
      cy.get('[data-cy="name"]').clear().type('Blog Modificado E2E');
      cy.get('[data-cy="handle"]').clear().type(handleActual);
      cy.get('[data-cy="description"]').clear().type('Este blog ha sido modificado exitosamente en el segundo test E2E');

      // Guardar los cambios
      cy.get('[data-cy="entityCreateSaveButton"]').click();

      // Esperar a que se complete la actualización
      cy.wait(1000);

      // Verificar que estamos de vuelta en la lista de blogs
      cy.url().should('include', '/blog');
      cy.get('[data-cy="BlogHeading"]').should('be.visible');

      // Verificar que el blog modificado aparece con el nuevo nombre
      cy.contains('Blog Modificado E2E').should('be.visible');
      cy.contains('Este blog ha sido modificado exitosamente en el segundo test E2E').should('be.visible');
    });
  });
});

