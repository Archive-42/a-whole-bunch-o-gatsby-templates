// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

context('navigator.getBattery updates', () => {
  it('updates battery display', function () {
    let appListener
    const updateBattery = cy
      .stub()
      .callsFake((e, fn) => (appListener = fn))
      .as('update')
    const mockBatteryInfo = {
      level: 0.3,
      charging: true,
      chargingTime: 1800, // seconds
      dischargingTime: Infinity,
      addEventListener: updateBattery
    }

    cy.visit('/', {
      onBeforeLoad (win) {
        delete win.navigator.battery
        win.navigator.getBattery = () => Promise.resolve(mockBatteryInfo)
      }
    })
    // initial display
    cy.contains('.battery-percentage', '30%').should('be.visible')
    cy.contains('.battery-status', 'Adapter').should('be.visible')

    // application started listening for battery updates
    // by attaching to two events
    cy.get('@update')
      .should('have.been.calledTwice')
      .and('have.been.calledWith', 'chargingchange')
      .and('have.been.calledWith', 'levelchange')
      // send a changed battery status event
      .then(() => {
        // verify the listener was set
        expect(appListener).to.be.a('function')
        mockBatteryInfo.level = 0.275
        // log message for clarity
        cy.log('Set battery at **27.5%**')
        appListener()
      })

    // because all Cypress commands are automatically chained
    // this "cy.contains" only runs AFTER
    // previous ".then" completes
    cy.contains('.battery-percentage', '27.5%')
      .should('be.visible')
      .then(() => {
        // let's change a different propety
        mockBatteryInfo.charging = false
        appListener()
        // log message for clarity
        cy.log('Pulling the 🔌')
        cy.contains('.battery-status', 'Battery').should('be.visible')
      })
  })

  it('calls charging event listener', function () {
    let chargingChange
    const mockBatteryInfo = {
      level: 0.3,
      charging: true,
      chargingTime: 1800, // seconds
      dischargingTime: Infinity,
      addEventListener: (eventName, cb) => {
        if (eventName === 'chargingchange') {
          chargingChange = cb
        }
      }
    }

    cy.visit('/', {
      onBeforeLoad (win) {
        delete win.navigator.battery
        win.navigator.getBattery = () => Promise.resolve(mockBatteryInfo)
      }
    })
    // initial display
    cy.contains('.battery-percentage', '30%').should('be.visible')
    cy.contains('.battery-status', 'Adapter')
      .should('be.visible')
      .then(() => {
        // verify the listener was set
        expect(chargingChange).to.be.a('function')
        mockBatteryInfo.level = 0.44
        // log message for clarity
        cy.log('Set battery at **44%**')
        chargingChange()
      })

    cy.contains('.battery-percentage', '44%').should('be.visible')
  })
})
