let spy
Cypress.on(`window:before:load`, win => {
  spy = cy.spy(win.console, `error`).as(`spyWinConsoleError`)
})

describe(`Redirects`, () => {
  it(`are case insensitive when ignoreCase is set to true`, () => {
    cy.visit(`/Longue-PAGE`, { failOnStatusCode: false }).waitForRouteChange()

    cy.get(`h1`).invoke(`text`).should(`contain`, `Hi from the long page`)
  })
  it(`are case sensitive when ignoreCase is set to false`, () => {
    cy.visit(`/PAGINA-larga`, { failOnStatusCode: false }).waitForRouteChange()

    cy.get(`h1`).invoke(`text`).should(`contain`, `NOT FOUND`)
  })

  it(`use redirects when preloading page-data`, () => {
    const expectedLinks = [`/Longue-PAGE`, `/pagina-larga`]

    // we should not hit those routes
    cy.intercept("GET", "/page-data/Longue-PAGE/page-data.json").as(
      "page-data-for-redirected-page-a"
    )
    cy.intercept("GET", "/page-data/pagina-larga/page-data.json").as(
      "page-data-for-redirected-page-b"
    )

    cy.intercept("GET", "/page-data/long-page/page-data.json").as(
      "redirected-page-data"
    )

    cy.visit(`/redirect-links/`).waitForRouteChange()

    cy.get("a").each(($el, index, $list) => {
      cy.then(() => {
        expect($el[0].href.replace(`http://localhost:9000`, ``)).to.be.oneOf(
          expectedLinks
        )
      })
      // focus / hover links to force trigger preload
      cy.wrap($el).trigger("mouseover")
    })

    cy.then(() => {
      // those requests should not happen
      cy.get("@page-data-for-redirected-page-a").should(networkCall => {
        expect(networkCall).to.be.null
      })
      cy.get("@page-data-for-redirected-page-b").should(networkCall => {
        expect(networkCall).to.be.null
      })

      // instead we want links to use redirects
      cy.get("@redirected-page-data").should(networkCall => {
        expect(networkCall.response.statusCode).to.be.oneOf([304, 200])
      })
    })
  })
})
