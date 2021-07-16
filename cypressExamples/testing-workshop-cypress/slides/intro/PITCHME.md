# Gleb Bahmutov, PhD

- VP of Engineering, Cypress
- gleb (at) cypress.io
- [@bahmutov](https://twitter.com/bahmutov)

+++

## What we are going to cover 1/3

As long as ⏳ permits

- example TodoMVC
  * web app, data store, REST calls
- basic page load test
- selector playground
- resetting state
- XHR spying and stubbing, fixtures

+++

## What we are going to cover 2/3

As long as ⏳ permits

- CI and Cypress dashboard
- test reporters
- configuration and environment variables
- retry-ability
- debugging
- visual testing

+++
## What we are going to cover 3/3

As long as ⏳ permits

- page objects vs app actions
- fixtures and backend
- preprocessors
- component testing
- plugins
- code coverage

+++

## Time 🕰

- total workshop duration 3 - 9 hours, depending on the included sections
- short breaks, lunch

+++

Please: if you have experience with Cypress.io, help others during the workshop 🙏

+++

## How learning works

1. I explain and show
2. We do together
3. You do and I help

+++

## Requirements

You will need:

- `git` to clone this repo
- Node v8+ to install dependencies

```text
git clone <repo url>
cd testing-workshop-cypress
npm install
```

+++

## Repo organization

- `/todomvc` is a web application we are going to test
- all tests are in `cypress/integration` folder
  - there are subfolders for exercises
    - `01-basic`
    - `02-adding-items`
    - `03-selector-playground`
    - `04-reset-state`
    - etc
- keep application `todomvc` running!

Note:
We are going to keep the app running, while switching from spec to spec for each part.

+++

## `todomvc`

Let us look at the application.

- `cd todomvc`
- `npm start`
- `open localhost:3000`

**important** keep application running through the entire workshop!

+++

It is a regular TodoMVC application.

![TodoMVC](/slides/intro/img/todomvc.png)

+++

If you have Vue DevTools plugin

![With Vue DevTools](/slides/intro/img/vue-devtools.png)

+++

Look at XHR when using the app

![Network](/slides/intro/img/network.png)

+++

Look at `todomvc/index.html` - main app DOM structure

![DOM](/slides/intro/img/DOM.png)

+++

Look at `todomvc/app.js`

![Application](/slides/intro/img/app.png)

+++

## Questions

@ul
- what happens when you add a new Todo item?
- how does it get to the server?
- where does the server save it?
- what happens on start up?
@ulend

Note:
The students should open DevTools and look at XHR requests that go between the web application and the server. Also the students should find `todomvc/data.json` file with saved items.

---?image=/slides/intro/img/vue-vuex-rest.png&size=contain

Note:
This app has been coded and described in this blog post [https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/](https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/)

+++

This app has been coded and described in this blog post [https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/](https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/)

➡️ Pick the [next section](https://github.com/cypress-io/testing-workshop-cypress#content-)
