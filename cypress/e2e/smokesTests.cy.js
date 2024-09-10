describe('Smoke Tests', () => {
  it('should load the homepage', () => {
      cy.visit('/');
      cy.contains('Inscription').should('be.visible');
      cy.contains('Connexion').should('be.visible');
  });

  it('should allow a user to login', () => {
      cy.visit('/login');
      cy.get("[data-cy='nav-link-login']").click();

      cy.get('[data-cy="login-input-username"]').should('be.visible').type('test2@test.fr');
      cy.get('[data-cy="login-input-password"]').should('be.visible').type('testtest');
      cy.get('[data-cy="login-submit"]').should('be.visible').click();

      cy.url().should('include', '/#/');

      cy.get('[data-cy="product-home-link"]').first().click();

      cy.url().should('include', '/products');

  });
});

//  // Test pour vérifier la disponibilité du produit
//   it('should display product availability', () => {
//     cy.intercept('GET', '**/products/random').as('getProduct');
//     cy.visit('/products/random');

//     cy.wait('@getProduct');

//   // Vérifier que le champ de disponibilité est visible
//   cy.get('[data-cy="detail-product-stock"]').should('be.visible');

//   // Vérifier que le stock est bien affiché avec le texte "en stock"
//   cy.get('[data-cy="detail-product-stock"]').should('contain', 'en stock');
// });