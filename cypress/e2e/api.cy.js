// Variables API
const apiUrl = Cypress.env("apiUrl");
const apiLogin = `${apiUrl}/login`;
const apiOrders = `${apiUrl}/orders`;
const apiProducts = `${apiUrl}/products`;
const apiAddToCart = `${apiUrl}/orders/add`;
const apiAddReview = `${apiUrl}/reviews`;

// Test de connexion pour un utilisateur inconnu et connu
describe("Login API Tests", () => {
  it("should return 401 for an unknown user", () => {
    cy.request({
      method: "POST",
      url: apiLogin,
      body: {
        username: "test@test.com",
        password: "wrongPassword",
      },
      failOnStatusCode: false, // Pour capturer les réponses avec erreur
    }).then((response) => {
      expect(response.status).to.eq(401); // Vérifie que la réponse est 401
    });
  });

  it("should return 200 for a known user", () => {
    cy.request({
      method: "POST",
      url: apiLogin,
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },
    }).then((response) => {
      expect(response.status).to.eq(200); // Vérifie que la réponse est 200
      expect(response.body).to.have.property("token"); // Vérifie la présence du token
    });
  });
});

describe("GET /orders without authentication", () => {
  it("returns 401 when not authenticated", () => {
    cy.request({
      method: "GET",
      url: apiOrders,
      failOnStatusCode: false, // Pour éviter que Cypress échoue sur les codes d'erreur HTTP
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});

// Test d'API avec authentification mais sans accès
describe("GET /orders with authentication but without access", () => {
  before(() => {
    // Récupère le token avant chaque test
    cy.request("POST", apiLogin, {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      const token = response.body.token; // Si le token est dans la réponse
      cy.wrap(token).as("authToken"); // Stocker le token pour l'utiliser plus tard
    });
  });

  // it("returns 403 when authenticated but without access", () => {
  //   cy.get('@authToken').then((token) => {
  //     cy.request({
  //       method: "GET",
  //       url: apiOrders,
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       },
  //       failOnStatusCode: false
  //     }).then((response) => {
  //       expect(response.status).to.eq(403);
  //     });
  //   });
  // });
});

// Test pour les produits
describe("Product API Tests", () => {
  it("gets a list of products", () => {
    cy.request("GET", apiProducts).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).length.to.be.greaterThan(6);
    });
  });

  let productId;

  it("gets the list of products and extracts the ID", () => {
    cy.request("GET", apiProducts).then((response) => {
      productId =
        response.body[Math.floor(Math.random() * response.body.length)].id;
    });
  });

  it("gets product details by ID", () => {
    expect(productId).to.be.a("number");

    cy.request(apiProducts + `/${productId}`)
      .its("status")
      .should("eq", 200);
  });
});

describe("PUT / add an available product", () => {
  before(() => {
    cy.request("POST", apiLogin, {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      const token = response.body.token;
      cy.wrap(token).as("authToken"); // Stocke le token pour l'utiliser dans le test
    });
  });

  it("should add a product to the cart", () => {
    cy.get("@authToken").then((token) => {
      cy.request({
        method: "PUT",
        url: apiAddToCart,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          product: 5,
          quantity: 1,
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(JSON.stringify(response.body));
        expect(response.status).to.eq(200);
      });
    });
  });

  it("should not allow adding an out-of-stock product to the cart", () => {
    cy.get("@authToken").then((token) => {
      cy.request({
        method: "PUT",
        url: apiAddToCart,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          product: 3,
          quantity: 1,
        },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(JSON.stringify(response.body));
        // Vérifie que le statut est 400 ou le statut spécifique pour les produits en rupture de stock
        expect(response.status).to.eq(400);
      });
    });
  });
});

describe("POST / add a reviews", () => {
  before(() => {
    cy.request("POST", apiLogin, {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      const token = response.body.token;
      cy.wrap(token).as("authToken"); // Stocke le token pour l'utiliser dans le test
    });
  });

  it("should create a new review successfully", () => {
    cy.get("@authToken").then((token) => {
      const reviewData = {
        title: "Excellent produit",
        comment: "Je suis très satisfait de cet achat.",
        rating: 5
      };

      cy.request({
        method: "POST",
        url: apiAddReview,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: reviewData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('title', reviewData.title);
        expect(response.body).to.have.property('comment', reviewData.comment);
        expect(response.body).to.have.property('rating', reviewData.rating);
      });
    });
  });
});