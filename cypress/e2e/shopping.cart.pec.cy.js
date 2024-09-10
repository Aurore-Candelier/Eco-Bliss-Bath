describe("test shopping carts", () => {
  before(() => {
    cy.login();
    cy.visit('/'); 
    cy.get("[data-cy='nav-link-login']").click();

    cy.get("[data-cy='login-input-username']").type('test2@test.fr');

    cy.get("[data-cy='login-input-password']").type('testtest');

    cy.get("[data-cy='login-submit']").click();

    cy.get("[data-cy='nav-link-cart']").should('be.visible').should('contain', 'Mon panier');
  });

  it("Ajoute un produit avec stock disponible au panier et vérifie le stock", () => {
    cy.visit("/products"); // Va sur la page des produits
    cy.get(".text-header > button").click();

    // Clique sur le premier produit disponible
    cy.get('[data-cy="product-link"]').eq(2).click();
    cy.wait(5000);
    // Vérifie que le stock est supérieur à 1
    cy.log(cy.get('[data-cy="detail-product-stock"]').eq(0).textContent);
    cy.get('[data-cy="detail-product-stock"]')
    // cy.log(text);
    //   const initialStock = text.replace("en stock",""); // Extrait le stock initial
    //   cy.log(initialStock)
    //   expect(initialStock).to.be.greaterThan(1); // Vérifie que le stock est supérieur à 1

    //   // Ajoute le produit au panier
    //   cy.get('[data-cy="detail-product-add"]').click();

    //   // Vérifie que le produit est bien dans le panier
    //   cy.get('[data-cy="cart-line"]').should("have.length.greaterThan", 0);
    //   cy.get('[data-cy="cart-line"]').should("contain", "Nom du produit");

    //   // Vérifie que le stock a diminué
    //   cy.get('[data-cy="detail-product-stock"]')
    //     .invoke("text")
    //     .then((textAfter) => {
    //       cy.log(textAfter);
    //       const newStock = parseInt(textAfter.match(/\d+/)[0], 10); // Extrait le stock après ajout
    //       expect(newStock).to.equal(initialStock - 1); // Vérifie que le stock a bien diminué de 1
    //     });
  });

  // it("Vérifie les limites du panier", () => {
  //   cy.visit("/#/products");
  //   cy.get('[data-cy="product-link"]').eq(2).click();

  //   // Test valeur négative
  //   cy.get('[data-cy="detail-product-quantity"]').clear().type("-1");
  //   cy.get('[data-cy="detail-product-add"]').click();
  //   cy.get('[data-cy="error-message"]').should("contain", "Quantité invalide");

  //   // Test valeur supérieure à 20
  //   cy.get('[data-cy="detail-product-quantity"]').clear().type("21");
  //   cy.get('[data-cy="detail-product-add"]').click();
  //   cy.get('[data-cy="error-message"]').should(
  //     "contain",
  //     "Quantité maximale dépassée"
  //   );
  // });

  it("Vérifie le contenu du panier via API", () => {
    cy.window().then((window)=>{
      cy.log(window.localStorage);
    }) 
    cy.request({
        method: "GET",
        url: "http://localhost:8081/orders",
        headers: {
          Authorization: `Bearer ${token}`
        },
        failOnStatusCode: false
      }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("items").and.to.be.an("array");

      // Vérifie que les articles du panier via l'API contiennent le bon produit
      const items = response.body.items;
      expect(items).to.have.length.greaterThan(0); // Assure qu'il y a au moins un produit

      // Vérifie le produit ajouté dans le panier via l'API
      const addedProduct = items.find((item) => item.name === "Nom du produit");
      expect(addedProduct).to.exist;
      expect(addedProduct.quantity).to.eq(1); // Vérifie la quantité du produit ajouté
    });
  });
});
