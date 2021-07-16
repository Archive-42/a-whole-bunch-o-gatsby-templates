describe(`gatsby-plugin-image / native lazy loading`, () => {
  beforeEach(() => {
    // /!\ Make sure to run this one using a real build: not in develop
    // because we need SSR rendering in that scenario
    cy.wrap(Cypress.config().baseUrl).should(`not.contain`, `:8000`)
    cy.visit(`/lazy-loading`)
  })

  it(`lazy loads an image when scrolling`, () => {
    // We need to wait for a decent amount of time so that the image
    // can resolve. This is necessary because the assertion
    // is done outside the Cypress scheduler and so, Cypress is not able
    // to ping for the specific assertion to be truthy.
    cy.wait(500)
    cy.get(`[data-cy=already-loaded]`)
      .should(`be.visible`)
      .then($img => {
        expect($img[0].complete).to.equal(true)
      })

    cy.get(`[data-cy=lazy-loaded]`)
      .should(`exist`)
      .then($img => {
        expect($img[0].complete).to.equal(false)
      })

    cy.scrollTo(`bottom`)

    cy.wait(500)
    cy.get(`[data-cy=lazy-loaded]`)
      .should(`exist`)
      .then($img => {
        expect($img[0].complete).to.equal(true)
      })
  })
})
