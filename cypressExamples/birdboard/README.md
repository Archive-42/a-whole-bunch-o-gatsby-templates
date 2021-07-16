# BirdBoard

Simple example Twitter client to demonstrate some core Cypress concepts as seen within the [📺 Cypress In A Nutshell webcast](https://youtu.be/7LEU4tMeG8Q).

- The frontend is implement with Vue, Vuex, Vue Router, and Vuetify.
- The backend provides an API via an Express server, and data is stored within MongoDB instance.


## Project setup
1. Install a local instance of MongoDB. [Check the installation docs](https://docs.mongodb.com/manual/installation/) for your operating system.
   > If you're using macOS you can quickly have a MongoDB instance via the [MongoDB.app](http://gcollazo.github.io/mongodbapp/)

   > If on Windows, make sure to create a data/db folder in the root directory, then start a mongodb instance :
   ```cmd
   "C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath="c:\data\db"
   ```
   You can also start mongoDB instance through the windows application (MongoDB Compass Community), using default mongodb configuration.

2. **(Optional)** If you actually want to load real tweets from Twitter, you'll need to grab a [Twitter API keys](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens.html), and place them within `/src/server/twitter.js` file.
    ```js
    const twitter = new TwitterAPI({
      consumer_key: '',
      consumer_secret: '',
      access_token_key: '',
      access_token_secret: ''
    })
    ```
3. Install dependencies:
    ```
    npm install
    ```

4. Start the server
   ```
   npm run start:server
   ```

5. Serve the app
   ```
   npm run serve
   ```

## Scripts

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Open Cypress desktop app
```
npx cypress open
```

### Headlessly run Cypress tests
```
npx cypress run
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
