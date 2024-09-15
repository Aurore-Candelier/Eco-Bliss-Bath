describe('Testing the Connexion feature', () => {
  // Avant chaque test, nous visitons la page de connexion
  beforeEach(() => {
    cy.visit('/'); 
    cy.get("[data-cy='nav-link-login']").click();
  });


  it('login successful with valid credentials', () => {

    cy.get("[data-cy='login-input-username']").type('test2@test.fr');

    cy.get("[data-cy='login-input-password']").type('testtest');

    cy.get("[data-cy='login-submit']").click();

    cy.get("[data-cy='nav-link-cart']").should('be.visible').should('contain', 'Mon panier');
  });

  it('login with wrong email', () => {
    cy.get("[data-cy='login-input-username']").type('test2@@test.fr');

    cy.get("[data-cy='login-input-password']").type('testtest');

    cy.get("[data-cy='login-submit']").click();

    cy.get("[data-cy= 'login-errors']").should('be.visible').should('contain', 'Merci de remplir correctement tous les champs')
  });

  it('login with wrong password', () => {
    cy.get("[data-cy='login-input-username']").type('test2@test.fr');

    cy.get("[data-cy='login-input-password']").type('test');

    cy.get("[data-cy='login-submit']").click();

    cy.get("[data-cy= 'login-errors']").should('be.visible').should('contain', 'Identifiants incorrects')
  });

  it('login with wrong email and password', () => {
    cy.get("[data-cy='login-input-username']").type('test2@@test.fr');

    cy.get("[data-cy='login-input-password']").type('test');

    cy.get("[data-cy='login-submit']").click();

    cy.get("[data-cy= 'login-errors']").should('be.visible').should('contain', 'Merci de remplir correctement tous les champs')
  });

});
