// ***********************************************
// API Authentication Helper
// ***********************************************

Cypress.Commands.add('loginViaAPI', (username = 'admin', password = 'admin') => {
  return cy.request({
    method: 'POST',
    url: '/api/authenticate',
    body: {
      username: username,
      password: password,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    window.localStorage.setItem('jwt', response.body.id_token);
    Cypress.env('token', response.body.id_token);
    return response.body;
  });
});

Cypress.Commands.add('getAuthToken', () => {
  return Cypress.env('token') || window.localStorage.getItem('jwt');
});

Cypress.Commands.add('authenticatedRequest', (method, url, body = null) => {
  const token = Cypress.env('token') || window.localStorage.getItem('jwt');
  
  const options = {
    method: method,
    url: url,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = body;
  }

  return cy.request(options);
});

