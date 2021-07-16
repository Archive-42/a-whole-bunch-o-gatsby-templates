'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  ENV['@sentry/ember'] = {
    sentry: {
      tracesSampleRate: 1,
      dsn: process.env.SENTRY_DSN,
    },
    ignoreEmberOnErrorWarning: true,
    minimumRunloopQueueDuration: 5,
    minimumComponentRenderDuration: 2,
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;

    // Include fake dsn so that instrumentation is enabled when running from cli
    ENV['@sentry/ember'].sentry.dsn = 'https://0@0.ingest.sentry.io/0';

    ENV['@sentry/ember'].minimumRunloopQueueDuration = 0;
    ENV['@sentry/ember'].minimumComponentRenderDuration = 0;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
