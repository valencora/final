describe('Test 3: Eliminar Blog', () => {
  it('debe eliminar el blog creado en el primer test', () => {
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

    // Buscar el blog modificado o el original en la tabla
    cy.get('[data-cy="BlogHeading"]').should('be.visible');
    
    // Esperar a que la tabla cargue
    cy.wait(500);
    
    // Buscar el blog modificado primero, si no existe buscar el original
    cy.get('tr[data-cy="entityTable"]').then(($rows) => {
      if ($rows.length === 0) {
        throw new Error('No se encontraron blogs en la lista. Asegúrate de ejecutar primero el test 1.');
      }
      
      // Intentar encontrar el blog modificado o el original
      let encontrado = false;
      
      $rows.each((index, row) => {
        const rowText = Cypress.$(row).text();
        if (rowText.includes('Blog Modificado E2E') || rowText.includes('Blog de Prueba E2E')) {
          encontrado = true;
          cy.wrap(row).within(() => {
            cy.get('[data-cy="entityDeleteButton"]').click();
          });
          return false; // Salir del each
        }
      });
      
      if (!encontrado) {
        throw new Error('No se encontró el blog "Blog de Prueba E2E" o "Blog Modificado E2E". Asegúrate de ejecutar primero el test 1.');
      }
    });

    // Confirmar el borrado en el modal
    cy.get('[data-cy="blogDeleteDialogHeading"]').should('be.visible');
    cy.get('[data-cy="blogDeleteDialogHeading"]').should('contain', 'Confirm delete operation');
    cy.get('[data-cy="entityConfirmDeleteButton"]').click();

    // Esperar a que se complete el borrado y recargar la página
    cy.wait(2000);
    cy.visit('/blog');
    cy.get('[data-cy="BlogHeading"]').should('be.visible');

    // Verificar que el blog eliminado ya no está en la lista
    cy.contains('Blog Modificado E2E').should('not.exist');
    cy.contains('Blog de Prueba E2E').should('not.exist');
  });
});

