## ☀️ Part 3: Selector playground

### 📚 You will learn

- Cypress Selector Playground tool
- best practices for selecting elements

+++

- keep `todomvc` app running
- open `03-selector-playground/spec.js`

+++

> How do we select element in `cy.get(...)`?

- Browser's DevTools can suggest selector

+++

![Chrome suggests selector](/slides/03-selector-playground/img/chrome-copy-js-path.png)

+++

Open "Selector Playground"

![Selector playground button](/slides/03-selector-playground/img/selector-button.png)

+++

Selector playground can suggest much better selectors.

![Selector playground](/slides/03-selector-playground/img/selector-playground.png)

+++

⚠️ It can suggest a weird selector

![Default suggestion](/slides/03-selector-playground/img/default-suggestion.png)

+++

Read [best-practices.html#Selecting-Elements](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements)

![Best practice](/slides/03-selector-playground/img/best-practice.png)

+++

## Todo

- add test data ids to `todomvc/index.html` DOM markup
- use new selectors to write `cypress/integration/03-selector-playground/spec.js`

Note:
The updated test should look something like the next image

+++

![Selectors](/slides/03-selector-playground/img/selectors.png)

+++

## Cypress is just JavaScript

```js
import {selectors, tid} from './common-selectors'
it('finds element', () => {
  cy.get(selectors.todoInput).type('something{enter}')

  // "tid" forms "data-test-id" attribute selector
  // like "[data-test-id='item']"
  cy.get(tid('item')).should('have.length', 1)
})
```

+++
## 🏁 Selecting Elements

- Use Selector Playground
- follow [https://on.cypress.io/best-practices#Selecting-Elements](https://on.cypress.io/best-practices#Selecting-Elements)
- **bonus:** try [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro)

➡️ Pick the [next section](https://github.com/cypress-io/testing-workshop-cypress#content-)
