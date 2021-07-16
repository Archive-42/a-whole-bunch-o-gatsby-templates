/// <reference types="cypress" />
beforeEach(() => {
  cy.request('POST', '/reset', {
    todos: []
  })
})
beforeEach(() => {
  cy.visit('/')
})
beforeEach(function stubRandomId() {
  let count = 1
  cy.window()
    .its('Math')
    .then(Math => {
      cy.stub(Math, 'random', () => {
        return `0.${count++}`
      }).as('random') // save reference to the spy
    })
})
afterEach(() => {
  // makes debugging failing tests much simpler
  cy.screenshot('runner')
})

/**
 * Adds a todo item
 * @param {string} text
 */
const addItem = text => {
  cy.get('.new-todo').type(`${text}{enter}`)
}

it('adds items to store', () => {
  addItem('something')
  addItem('something else')
  cy.window()
    .its('app.$store.state.todos')
    .should('have.length', 2)
})

it('creates an item with id 1', () => {
  cy.server()
  cy.route('POST', '/todos').as('new-item')
  addItem('something')
  cy.wait('@new-item')
    .its('request.body')
    .should('deep.equal', {
      id: '1',
      title: 'something',
      completed: false
    })
})

it('calls spy twice', () => {
  addItem('something')
  addItem('else')
  cy.get('@random').should('have.been.calledTwice')
})

it('puts todos in the store', () => {
  addItem('something')
  addItem('else')
  cy.window()
    .its('app.$store.state.todos')
    .should('deep.equal', [
      { title: 'something', completed: false, id: '1' },
      { title: 'else', completed: false, id: '2' }
    ])
})

it('adds todos via app', () => {
  // bypass the UI and call app's actions directly from the test
  // app.$store.dispatch('setNewTodo', <desired text>)
  // app.$store.dispatch('addTodo')
  // using https://on.cypress.io/invoke
  // bypass the UI and call app's actions directly from the test
  // app.$store.dispatch('setNewTodo', <desired text>)
  // app.$store.dispatch('addTodo')
  cy.window()
    .its('app.$store')
    .invoke('dispatch', 'setNewTodo', 'new todo')

  cy.window()
    .its('app.$store')
    .invoke('dispatch', 'addTodo')
  // and then check the UI
  cy.contains('li.todo', 'new todo')
})

it('handles todos with blank title', () => {
  // bypass the UI and call app's actions directly from the test
  // app.$store.dispatch('setNewTodo', <desired text>)
  // app.$store.dispatch('addTodo')
  cy.window()
    .its('app.$store')
    .invoke('dispatch', 'setNewTodo', '  ')

  cy.window()
    .its('app.$store')
    .invoke('dispatch', 'addTodo')

  // confirm the application is not breaking
  cy.get('li.todo')
    .should('have.length', 1)
    .first()
    .should('not.have.class', 'completed')
    .find('label')
    .should('have.text', '  ')
})
