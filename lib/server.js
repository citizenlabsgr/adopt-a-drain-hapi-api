/* eslint-disable no-undef */
// 'use strict';
// const process = require('process');
// [# aad-api API]

// process.setMaxListeners(15);  // fail
/* $lab:coverage:off$ */
if (process.env.NODE_ENV !== 'production'
    && process.env.NODE_ENV !== 'staging'
    && process.env.NODE_ENV !== 'test') {
  // NPM_CONFIG_PRODUCTION is only set in production environment
  if (!('NPM_CONFIG_PRODUCTION' in process.env)) {
    // eslint-disable-next-line no-console
    console.log('server loading dotenv', process.env.NODE_ENV);
    // [* Load Environment variables when not in production]
    process.env.DEPLOY_ENV = '';
    // eslint-disable-next-line global-require
    const path = require('path');
    // eslint-disable-next-line
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
  }
}
/* $lab:coverage:on$ */
// [## Use]
// [* Use JWT to control access to API]
const Jwt = require('@hapi/jwt');

// [* Use HAPI to implement API]
const Hapi = require('@hapi/hapi');

// [* Use swagger to facilitate manual interaction with API]
const Inert = require('@hapi/inert');
const Vision =  require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('../package');
const DatabaseUrl = require('../lib/plugins/postgres/database_url.js');

// [* Use HapiPgPoolPlugin to start, create, and disconnect postgres client db connections]
const HapiPgPoolPlugin = require( './plugins/postgres/hapi_pg_pool_plugin.js');

// [* Use root_route]
const home_route = require('./routes/home_route.js');

// [* Use salutaion_route]

// [* Use time_route]
const time_route = require('./routes/time_route.js');

// [* Use Signin Route]
const signin_route = require('./routes/signin_route_post.js');

// [* Use Signup Route]
const signup_route = require('./routes/signup_route_post.js');

// [* Use Adopt ees Route]
// const adoptee s_route = require('./routes/adop tees_route_post.js');

// [* Use DELETE Adoptee Route]
const adoptee_route_delete = require('./routes/adoptee_route_delete.js');
// [* Use GET Adoptee Route]
const adoptee_route_get = require('./routes/adoptee_route_get.js');
// [* Use POST Adoptee Route]
const adoptee_route_post = require('./routes/adoptee_route_post.js');
const adoptee_mbr_route_post = require('./routes/adoptee_mbr_route_post.js');

// [* Use PUT Adoptee Route]
const adoptee_route_put = require('./routes/adoptee_route_put.js');

// [* Use POST Adopter Route]
const adopter_route_post = require('./routes/adopter_route_post.js');

// [* Use GET Adopter Route]
const adopter_route_get = require('./routes/adopter_route_get.js');

// [* Use DELETE Adopter Route]
const adopter_route_delete = require('./routes/adopter_route_delete.js');

// [* Use PUT Adopter Route]
const adopter_route_put = require('./routes/adopter_route_put.js');

// [* Use DELETE Document Route]
const document_route_delete = require('./routes/document_route_delete.js');

// [* Use GET Document Route]
const document_route_get = require('./routes/document_route_get.js');

// [* Use POST Document Route]
const document_route_post = require('./routes/document_route_post.js');

// [* Use DELETE Page Route]
const page_route_delete = require('./routes/page_route_delete.js');

// [* Use GET Page Route]
const page_route_get = require('./routes/page_route_get.js');

// [* Use POST Page Route]
const page_route_post = require('./routes/page_route_post.js');

// [* Use PUT Page Route]
const page_route_put = require('./routes/page_route_put.js');

// [## Configure]


// [* Database Configuration Docker Dev eg. '{"host":"db","port":5432,"database":"pg_db"}']
// [* Database Configuration Heroku Prod eg. '{"host":"0.0.0.0","database":"<get db name from heroku>"}']

// [* PORT, Production port is defined on the fly by heroku]
// [* PORT, Non-Production port is defined in {"host":"0.0.0.0","port":"5555"}]
//           heroku              docker

/* $lab:coverage:off$ */
// origins is parsed here to make sure it has been configured
JSON.parse(process.env.ACCEPTED_ORIGINS);
let claims = process.env.JWT_CLAIMS || '{"aud":"citizenlabs-api", "iss":"citizenlabs", "sub":"client-api", "user":"guest", "scope":"api_guest", "key":"0"}';
const jwt_claims = JSON.parse(claims);

const port = process.env.PORT || 5555;

// [* HOST Configuration]
const host = process.env.HOST || '0.0.0.0';

// [## Start Hapi Server]
const server = Hapi.Server({
  host: host,
  port: port,
});

/* $lab:coverage:on$ */

// [* Swagger Configuration]

const swaggerOptions = {
  info: {
          title: 'Test API Documentation',
          version: Pack.version
      },
  };

// [* Switch to heroku color url when available]
const databaseUrl = new DatabaseUrl(process);
const DB_URL = databaseUrl.db_url;
// const testable = databaseUrl.testable;
// [Hapi Registration Configuration]
// console.log('Inert ', Inert);
const registrations = [
  Inert,
  Vision,
  // [Register Swagger Plugin]
  {
      plugin: HapiSwagger,
      options: swaggerOptions
  },
  // [Register JWT Plugin]
  Jwt,
  // [Register Postgres Connection Pool Plugin]
  {
    plugin: HapiPgPoolPlugin,
    options: {
      config: {
        /* $lab:coverage:off$ */
        database_url: DB_URL || '<database-url>',
        docker_env: process.env.DOCKER_ENV || false
        /* $lab:coverage:on$ */
      }
    }
  }

];
// [* Route Configuration]
const api_routes = [
  // [* Home Route Configuration]
  home_route,
  // [* Salutation Route Configuration]
  // [* Time Route Configuration, Get the database time]
  time_route,
  // [* Signin Route Configuration, Login]
  signin_route,
  // [* Signup Route Configuration, Create Account]
  signup_route,
  // [* Adopt ees Route Configuration, Get adopted drains]

  // [* Adoptee Route Configuration, DELETE adopted drain]
  adoptee_route_delete,
  // [* Adoptee Route Configuration, Get adopted drains]
  adoptee_route_get,
  // [* Adoptee Route Configuration, POST adopted drains]
  adoptee_route_post,
  // [* Adoptee Route Configuration, POST MBR ]
  adoptee_mbr_route_post,
  // [* Adoptee Route Configuration, Put adoptee]
  adoptee_route_put,
  // [* Adopter Route Configuration, POST adopter aka user]
  adopter_route_post,
  // [* Adopter Route Configuration, Get adopter]
  adopter_route_get,
  // [* Adopter Route Configuration, Delete adopter]
  adopter_route_delete,
  // [* Adoptee Route Configuration, Put adopter]
  adopter_route_put,
  // [* Document Route Configuration, Delete document ]
  document_route_delete,
  // [* Document Route Configuration, Get document ]
  document_route_get,
  // [* Document Route Configuration, Post document ]
  document_route_post,
    // [* Page Route Configuration, Delete page ]
  page_route_delete,
    // [* Page Route Configuration, Get page ]
    page_route_get,
    // [* Page Route Configuration, POST page ]
    page_route_post,
    // [* Page Route Configuration, PUT page]
    page_route_put

];

const strategy =  function () {
  // [* Authorization JWT Strategy Configuration]

  return {
    keys: process.env.JWT_SECRET,
    verify: {
        /* $lab:coverage:off$ */
        aud: jwt_claims.aud || '<audience>',
        iss: jwt_claims.iss || '<issuer>',
        sub: jwt_claims.sub || '<subject>'
        /* $lab:coverage:on$ */
    },
    validate: (artifacts) => {
        /* $lab:coverage:off$ */

        if (! artifacts.decoded.payload.user) {
          return {isValid: false};
        }

        if (! artifacts.decoded.payload.scope) {
          return {isValid: false};
        }

        return {
            isValid: true,
            credentials: { user: artifacts.decoded.payload.user, scope: artifacts.decoded.payload.scope }
        };
        /* $lab:coverage:on$ */
    }
  };
};

exports.init = async () => {
  // [* Start server for testing]
  // con sole.log('[* Start server for testng] 1');
  // process.setMaxListeners(15); // fail
    // try {
        await server.register(
          registrations
        );
      // set authentication strategy
      server.auth.strategy('lb_jwt_strategy', 'jwt', strategy() );
      server.auth.default('lb_jwt_strategy');
      server.route(api_routes);

      // use for testing
      await server.initialize();

      // } catch(e){
      /* $lab:coverage:off$ */
      // console.error('init register ', e);
      /* $lab:coverage:on$ */
    // } finally {
      /*
      for (let ev in process.env) {

        if (!/[a-z]/.test(ev) && /[A-Z]/.test(ev)) {
          if (ev.includes('SECRET')
              || ev.includes('PASSWORD')
              || ev.includes('DATABASE_URL')) {
              console.log(ev, '********');
          } else {
            console.log(ev, process.env[ev]);
          }
        }

      }
      */
      return server;
    // }
  };


// Declare an authentication strategy using the jwt scheme.
// Use keys: with a shared secret key OR json web key set uri.
// Use verify: To determine how key contents are verified beyond signature.
// If verify is set to false, the keys option is not required and ignored.
// The verify: { aud, iss, sub } options are required if verify is not set to false.
// The verify: { exp, nbf, timeSkewSec, maxAgeSec } paramaters have defaults.
// Use validate: To create a function called after token validation.


exports.start = async () => {
  /* $lab:coverage:off$ */
  // [* Start server for general use]
   // con sole.log('[* Start server for general use] 1');

    await server.register(
      registrations
    );
    // [Set authorization strategy]
    server.auth.strategy('lb_jwt_strategy', 'jwt', strategy() );
    server.auth.default('lb_jwt_strategy');
    // [Load routes]
    server.route(api_routes);
    // starts server for use
    // [Launch the server]
    await server.start();

    // [Give some feedback about routes]
    let swaggered = false;
    // console.log('docker_env', process.env.DOCKER_ENV);
    if (process.env.NODE_ENV !== 'production') {
      console.log('When using docker-compose');
      server.table().forEach((route) => {
        if (!route.path.includes('swagger')) {
          console.log(`${route.method}\thttp://${host}:${port}${route.path}`);
        } else {
          swaggered = true;
        }
      });
    }
    console.log("Otherwise");
    server.table().forEach((route) => {
      if (!route.path.includes('swagger')) {
        console.log(`${route.method}\t${server.info.uri}${route.path}`);
      } else {
        swaggered = true;
      }
    });

    if (swaggered) {
      console.log(`Swagger enabled at /documentation`);
    }

      /*
      for (let ev in process.env) {

        if (!/[a-z]/.test(ev) && /[A-Z]/.test(ev)) {
          if (ev.includes('SECRET')
              || ev.includes('PASSWORD')
              || ev.includes('DATABASE_URL')) {
              console.log('* lib/server.js ',ev, '********');
          } else {
            console.log('* lib/server.js',ev, process.env[ev]);
          }
        }
      }
      */


    console.log('[* Start API server] ok');

    return server;
    /* $lab:coverage:on$ */
};
// console.log('server ', server);
// console.log('process', process);
// emitter.setMaxListeners(15); // for API tests fail
// server.emitter.setMaxListeners(15); // for API tests fail
// process.stdout.setMaxListeners(15); // fail
// process.setMaxListeners(15);
// process.setMaxListeners(15);

// events.defaultMaxListeners = 15;
process.on('unhandledRejection', (err) => {
    /* $lab:coverage:off$ */
    console.error(err);
    process.exit(1);
    /* $lab:coverage:on$ */
}).on('warning', e => console.warn(e.stack));
// .on('connection',);

server.events.on('stop', () => {
    // [Stops server when ???]

});
