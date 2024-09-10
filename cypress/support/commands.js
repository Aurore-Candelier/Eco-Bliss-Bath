// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", () => {
cy.request({
    method: "POST",
    url: "http://localhost:8081/login", // URL de ton API de login
    body: {
      username: "test2@test.fr", // Ton nom d'utilisateur
      password: "testtest", // Ton mot de passe
    },
}).then((response) => {
    // Stocker le token JWT dans localStorage ou sessionStorage
    window.localStorage.setItem("jwtToken", response.body.token);
});
});
