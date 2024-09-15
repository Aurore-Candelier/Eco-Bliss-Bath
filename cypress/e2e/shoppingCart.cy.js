describe("test shopping carts", () => {
  before(() => {
    cy.login();
    cy.visit("/");
    cy.get("[data-cy='nav-link-login']").click();

    cy.get("[data-cy='login-input-username']").type("test2@test.fr");

    cy.get("[data-cy='login-input-password']").type("testtest");

    cy.get("[data-cy='login-submit']").click();

    cy.get("[data-cy='nav-link-cart']")
      .should("be.visible")
      .should("contain", "Mon panier");
  });

  it("Ajoute un produit avec stock disponible au panier et vérifie le stock", () => {
    cy.visit("/#/products"); // Va sur la page des produits

    // Clique sur le premier produit disponible
    cy.get('[data-cy="product-link"]').eq(2).click();
    cy.wait(5000);
    // Vérifie que le stock est supérieur à 1
    let stockValue;
    cy.get('[data-cy="detail-product-stock"]')
      .invoke("text")
      .then((stock) => {
        stockValue = parseInt(stock);
        expect(stockValue).to.be.greaterThan(1); // Vérifie que le stock est supérieur à 1
      });

    cy.get('[data-cy="detail-product-add"]').click();
    cy.get("[data-cy=nav-link-cart]").click();
    cy.get('[data-cy="cart-line"]').should("have.length", 1);

    cy.visit("/#/products");
    cy.get('[data-cy="product-link"]').eq(2).click();
    cy.wait(5000);

    cy.get('[data-cy="detail-product-stock"]')
      .invoke("text")
      .then((stock) => {
        let newStockValue = parseInt(stock);
        expect(newStockValue).to.be.lessThan(stockValue); // Vérifie que le stock est supérieur à 1
      });
  });

  it("Vérifie les limites du panier", () => {
    cy.visit("/#/products");
    cy.get('[data-cy="product-link"]').eq(2).click();

    // Test valeur négative
    cy.get('[data-cy="detail-product-quantity"]').clear().type("-1");
    cy.get('[data-cy="detail-product-add"]').click();
    cy.get('[data-cy="error-message"]').should("contain", "Quantité invalide");

    // Test valeur supérieure à 20
    cy.get('[data-cy="detail-product-quantity"]').clear().type("21");
    cy.get('[data-cy="detail-product-add"]').click();
    cy.get('[data-cy="error-message"]').should(
      "contain",
      "Quantité maximale dépassée"
    );
  });

  it("Vérifie le contenu du panier via API", () => {
    cy.visit("/#/products");
    cy.get('[data-cy="product-link"]').eq(2).click();
    cy.wait(5000);
    cy.get('[data-cy="detail-product-add"]').click();
    cy.request("POST", "http://localhost:8081/login", {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response)=>{
      cy.request({
        method: "GET",
        url: "http://localhost:8081/orders",
        headers: {
          Authorization: `Bearer ${response.body.token}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("orderLines").and.to.be.an("array");
  
        // Vérifie que les articles du panier via l'API contiennent le bon produit
        const items = response.body.orderLines;
        expect(items).to.have.length.greaterThan(0); // Assure qu'il y a au moins un produit
      });
    })
  });
});
