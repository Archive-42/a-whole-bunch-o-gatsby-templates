/// <reference types="Cypress" />
/* eslint-env mocha */
import {
  enterTodo,
  getNewTodoInput,
  getTodoApp,
  getTodoItems,
  resetDatabase,
  visit
} from '../../support/utils'

it('loads the app', () => {
  visit()
  getTodoApp().should('be.visible')
})

describe('UI', () => {
  beforeEach(resetDatabase)
  beforeEach(() => visit())

  context('basic features', () => {
    it('loads application', () => {
      getTodoApp().should('be.visible')
    })

    it('starts with zero items', () => {
      cy.get('.todo-list')
        .find('li')
        .should('have.length', 0)
    })

    it('adds two items', () => {
      enterTodo('first item')
      enterTodo('second item')
      getTodoItems().should('have.length', 2)
    })

    it('enters text in the input', () => {
      const text = 'do something'
      getNewTodoInput().type(text)
      getNewTodoInput().should('have.value', text)
    })

    it('can add many items', () => {
      const N = 5
      for (let k = 0; k < N; k += 1) {
        enterTodo(`item ${k + 1}`)
      }
      getTodoItems().should('have.length', N)
    })
  })

  context('advanced', () => {
    it('adds two and deletes first', () => {
      enterTodo('first item')
      enterTodo('second item')

      getTodoItems()
        .contains('first item')
        .parent()
        .find('.destroy')
        .click({ force: true }) // because it only becomes visible on hover

      cy.contains('first item').should('not.exist')
      cy.contains('second item').should('exist')
      getTodoItems().should('have.length', 1)
    })
  })

  context('cy.tasks', () => {
    it('can observe records saved in the database', () => {
      const title = 'create a task'
      enterTodo(title)
      // https://on.cypress.io/task
      cy.task('hasSavedRecord', title, { timeout: 10000 })
    })

    it('returns resolved value', () => {
      const title = 'create a task'
      enterTodo(title)
      // https://on.cypress.io/task
      cy.task('hasSavedRecord', title, { timeout: 10000 })
        .should('contain', {
          title,
          completed: false
        })
        // there is also an ID
        .and('have.property', 'id')
    })
  })
})
