'use strict';
const Joi = require('joi');
const ApiDebug = require('./debug/debug_api');
// const TestHelper = require('./util/test_helper');

// [Route:]
// [Description:]
// [Header: token]
// [Header: rollback , default is false]

// const ChelateUser = require('../../lib/chelates/chelate_user.js');

/*
Post Insert
* requires a guest-token
* payload must contain {pk:"", sk:"", ...} or  {sk:"", tk:"", ...}
* payload must contain a {...,"form": {...}} key
*/

const headerSchema = Joi.object({
  'authorization': Joi.string().required()
});

const payloadSchema = Joi.object({
  username: Joi.string().min(1).max(320).required(),
  displayname: Joi.string().min(1).max(20).required(),
  password: Joi.string().min(7).required()
});

module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: ['POST'],
  path: '/signup',
  handler: async function (req) {
    /* $lab:coverage:off$ */
    // [Define a /signup POST route handler]
    // [Signup is a convenience route for /user]
    let result = {status:"200", msg:"OK"};
    let client = false;
    let token ; // guest token
    let form ;
    let rollback = req.headers.rollback || false;
    let apiDebug = req.headers.debug || false;

    try {
      // [Optionally rollback insert with headers.cleanup=true]
      // rollback = req.headers.rollback || false;
      // [Get the API Token from request]
      token = req.headers.authorization;
      token = token.replace('Bearer ','');
      token = `("${req.headers.authorization}")`; // guest token
      
      // [Get a database client from request]

      client = req.pg;

      // [Get pk from request.payload]
      form = req.payload;
      // [Insert User into the database]
      await client.query('BEGIN');

      let res = await client.query(
        {
          text: 'select * from api_0_0_1.signup($1::TOKEN,$2::JSONB)',
          values: [token,
                   JSON.stringify(form)]
        }
      );
      result = res.rows[0].signup;

      if (rollback) {
        // rollback for testing
        await client.query('ROLLBACK');
      } else {
        await client.query('COMMIT');
      }

    } catch (err) {
      await client.query('ROLLBACK');
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/signup err', err);
    } finally {
      // [Release client back to pool]
      if (client) {
        req.pg.release();
      } else {
        console.error('!!! MAKE SURE DATABASE IS RUNNING!!! signup');
      }
      new ApiDebug('signup', apiDebug).show(req.headers, req.payload, result);

      // [Return status, msg, and insertion (copy of the inserted record)]
      // eslint-disable-next-line no-unsafe-finally
      return result;
      /* $lab:coverage:on$ */
    }
  },
  options: {
        cors: {
            origin: JSON.parse(process.env.ACCEPTED_ORIGINS),
            headers:['Authorization', 'Content-Type'],
            exposedHeaders: ['Accept'],
          },
        description: 'Add User aka SignUp',
        notes: 'Returns {} ',
        tags: ['api','signup'],
        auth: {
          mode: 'required',
          strategy: 'lb_jwt_strategy',
          access: {
            scope: ['api_guest']
          }
        },
        validate: {
          payload: payloadSchema,
          headers: headerSchema.unknown()
        }
    }
};
