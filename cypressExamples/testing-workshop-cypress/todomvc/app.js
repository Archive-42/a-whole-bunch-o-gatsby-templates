/* global Vue, Vuex, axios */
/* eslint-disable no-console */
/* eslint-disable-next-line */
; (function () {
  Vue.use(Vuex)

  function randomId() {
    return Math.random()
      .toString()
      .substr(2, 10)
  }

  const store = new Vuex.Store({
    state: {
      loading: true,
      todos: [],
      newTodo: ''
    },
    getters: {
      newTodo: state => state.newTodo,
      todos: state => state.todos,
      loading: state => state.loading
    },
    mutations: {
      SET_LOADING(state, flag) {
        state.loading = flag
      },
      SET_TODOS(state, todos) {
        state.todos = todos
      },
      SET_NEW_TODO(state, todo) {
        state.newTodo = todo
      },
      ADD_TODO(state, todoObject) {
        console.log('add todo', todoObject)
        state.todos.push(todoObject)
      },
      REMOVE_TODO(state, todo) {
        let todos = state.todos
        todos.splice(todos.indexOf(todo), 1)
      },
      CLEAR_NEW_TODO(state) {
        state.newTodo = ''
        console.log('clearing new todo')
      }
    },
    actions: {
      loadTodos({ commit }) {
        commit('SET_LOADING', true)

        axios
          .get('/todos')
          .then(r => r.data)
          .then(todos => {
            console.log('got %d todos', todos.length)
            commit('SET_TODOS', todos)
            commit('SET_LOADING', false)
          })
          .catch(e => {
            console.error('could not load todos')
            console.error(e.message)
            console.error(e.response.data)
          })
      },

      /**
       * Sets text for the future todo
       *
       * @param {any} { commit }
       * @param {string} todo Message
       */
      setNewTodo({ commit }, todo) {
        commit('SET_NEW_TODO', todo)
      },
      addTodo({ commit, state }) {
        if (!state.newTodo) {
          // do not add empty todos
          return
        }
        const todo = {
          title: state.newTodo,
          completed: false,
          id: randomId()
        }
        // artificial delay in the application
        // for test "flaky test - can pass or not depending on the app's speed"
        // in cypress/integration/11-retry-ability/answer.js
        // increase the timeout delay to make the test fail
        // 50ms should be good
        setTimeout(() => {
          axios.post('/todos', todo).then(() => {
            commit('ADD_TODO', todo)
          })
        }, 0)
      },
      addEntireTodo({ commit }, todoFields) {
        const todo = {
          ...todoFields,
          id: randomId()
        }
        axios.post('/todos', todo).then(() => {
          commit('ADD_TODO', todo)
        })
      },
      removeTodo({ commit }, todo) {
        axios.delete(`/todos/${todo.id}`).then(() => {
          console.log('removed todo', todo.id, 'from the server')
          commit('REMOVE_TODO', todo)
        })
      },
      clearNewTodo({ commit }) {
        commit('CLEAR_NEW_TODO')
      },
      // example promise-returning action
      addTodoAfterDelay({ commit }, { milliseconds, title }) {
        return new Promise(resolve => {
          setTimeout(() => {
            const todo = {
              title,
              completed: false,
              id: randomId()
            }
            commit('ADD_TODO', todo)
            resolve()
          }, milliseconds)
        })
      }
    }
  })

  // app Vue instance
  const app = new Vue({
    store,
    data: {
      file: null
    },
    el: '.todoapp',

    created() {
      this.$store.dispatch('loadTodos')
    },

    // computed properties
    // https://vuejs.org/guide/computed.html
    computed: {
      loading() {
        return this.$store.getters.loading
      },
      newTodo() {
        return this.$store.getters.newTodo
      },
      todos() {
        return this.$store.getters.todos
      }
    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {
      setNewTodo(e) {
        this.$store.dispatch('setNewTodo', e.target.value)
      },

      addTodo(e) {
        // do not allow adding empty todos
        if (!e.target.value.trim()) {
          throw new Error('Cannot add a blank todo')
        }
        e.target.value = ''
        this.$store.dispatch('addTodo')
        this.$store.dispatch('clearNewTodo')
      },

      removeTodo(todo) {
        this.$store.dispatch('removeTodo', todo)
      },

      // utility method for create a todo with title and completed state
      addEntireTodo(title, completed = false) {
        this.$store.dispatch('addEntireTodo', { title, completed })
      }
    }
  })

  // if you want to expose "app" globally only
  // during end-to-end tests you can guard it using "window.Cypress" flag
  // if (window.Cypress) {
  window.app = app
  // }
})()
