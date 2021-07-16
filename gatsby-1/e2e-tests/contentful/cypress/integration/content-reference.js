describe(`content-reference`, () => {
  beforeEach(() => {
    cy.visit("/content-reference").waitForRouteChange()
  })
  it(`content-reference-many-2nd-level-loop`, () => {
    cy.get(
      '[data-cy-id="default-content-reference-many-2nd-level-loop"]'
    ).snapshot()
  })
  it(`content-reference-many-loop-a-greater-b`, () => {
    cy.get(
      '[data-cy-id="default-content-reference-many-loop-a-greater-b"]'
    ).snapshot()
  })
  it(`content-reference-many-loop-b-greater-a`, () => {
    cy.get(
      '[data-cy-id="default-content-reference-many-loop-b-greater-a"]'
    ).snapshot()
  })
  it(`content-reference-many-self-reference`, () => {
    cy.get(
      '[data-cy-id="default-content-reference-many-self-reference"]'
    ).snapshot()
  })
  it(`content-reference-one`, () => {
    cy.get('[data-cy-id="default-content-reference-one"]').snapshot()
  })
  it(`content-reference-one-loop-a-greater-b`, () => {
    cy.get(
      '[data-cy-id="default-content-reference-one-loop-a-greater-b"]'
    ).snapshot()
  })
  it(`content-reference-one-loop-b-greater-a`, () => {
    cy.get(
      '[data-cy-id="default-content-reference-one-loop-b-greater-a"]'
    ).snapshot()
  })
  it(`content-reference-one-self-reference`, () => {
    cy.get(
      '[data-cy-id="default-content-reference-one-self-reference"]'
    ).snapshot()
  })
})

describe(`content-reference localized`, () => {
  beforeEach(() => {
    cy.visit("/content-reference").waitForRouteChange()
  })
  it(`english-content-reference-one-localized`, () => {
    cy.get('[data-cy-id="english-content-reference-one-localized"]').snapshot()
  })
  it(`english-content-reference-many-localized`, () => {
    cy.get('[data-cy-id="english-content-reference-many-localized"]').snapshot()
  })
  it(`german-content-reference-one-localized`, () => {
    cy.get('[data-cy-id="german-content-reference-one-localized"]').snapshot()
  })
  it(`german-content-reference-many-localized`, () => {
    cy.get('[data-cy-id="german-content-reference-many-localized"]').snapshot()
  })
})
