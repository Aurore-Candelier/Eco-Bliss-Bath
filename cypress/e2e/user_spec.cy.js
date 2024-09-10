describe('User Signup', () => {
  it('should successfully register a new user', () => {
    // Visiter la page d'inscription
    cy.visit('http://localhost:8080/#/register');

    // Remplir le formulaire d'inscription
    cy.get('[data-cy="register-input-lastname"]').type('Doe');
    cy.get('[data-cy="register-input-firstname"]').type('John');
    cy.get('[data-cy="register-input-email"]').type('testuser4@example.com');
    cy.get('[data-cy="register-input-password"]').type('securePassword123');
    cy.get('[data-cy=register-input-password-confirm]').type('securePassword123');

    // Soumettre le formulaire
    cy.get('[data-cy="register-submit"]').click();

    // Vérifier si l'utilisateur est redirigé vers la page d'accueil
    cy.url().should('eq', 'http://localhost:8080/#/register'); // Adaptez l'URL à votre configuration
  });
});