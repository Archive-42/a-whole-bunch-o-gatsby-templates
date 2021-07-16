describe('Footer', () => {

  context('with a single todo', () => {
    it('displays a singular todo in count', () => {
      cy.seedAndVisit([{
        id: 1,
        name: 'Buy milk',
        isComplete: false
      }]); // 1 item in the list 
      cy.get('.todo-count')
        .should('contain', '1 todo left');
    });
  });

  context('with multiple todos', () => {
    beforeEach(() => {
      cy.seedAndVisit();
    });
    it('displays plural todos in count', () => {
      cy.get('.todo-count')
        .should('contain', '3 todos left');
    });

    // making tests data driven
    it('Handles filter links', () => {
      const filters = [
        {
          link: 'Active',
          expectedLength: 3
        },
        {
          link: 'Completed',
          expectedLength: 1
        },
        {
          link: 'All',
          expectedLength: 4
        }
      ]

      cy.wrap(filters) // cy.wrap() puts the data in the context of cypress and allows us to chain additional cypress commands
        .each(filter => {
        cy.contains(filter.link)
          .click();

        cy.get('.todo-list li')
          .should('have.length', filter.expectedLength)
      });

    // it('Filters to active todos', () => {
    //   cy.contains('Active')
    //     .click();

    //   cy.get('.todo-list li')
    //     .should('have.length', 3)
    // });
    // it('Filters to completed todos', () => {
    //   cy.contains('Completed')
    //     .click();

    //   cy.get('.todo-list li')
    //     .should('have.length', 1)      
    // });

    });
  });
});