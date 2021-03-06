'use strict';
const Joi = require('joi');
const ApiDebug = require('./debug/debug_api');
// const TestHelper = require('./util/test_helper');
// const Consts = require('../constants/consts');

const headerSchema = Joi.object({
  username: Joi.string().min(1).max(320).required(),
  password: Joi.string().min(8).required()
});

const payloadSchema = Joi.object({
  'authorization': Joi.string().required(),
  'debug': Joi.boolean().optional(),
  'test': Joi.string().optional(),
  'timeout': Joi.number().optional()
});

module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: 'POST',
  path: '/signin',
  handler: async function (req) {
    // [Define a /signin POST route handler]
    /* $lab:coverage:off$ */
    let result = {status:"200", msg:"OK"};
    let client ;
    let token ; // guest token
    let form ; 
    let singleTest = req.headers.test || false;
    const apiDebug = req.headers.debug || false;

    try {  
   
      // [Get the API Token from request]
      token = req.headers.authorization; // guest token
      token = `("${token.replace('Bearer ','')}")`;
      // [Get a database client from request]
      client = req.pg;
      // [Get form from request.params]
      form = req.payload;

      // [Optionally insert a test user when test in header]
      if (singleTest) {

        // [Inititate a transation when test is invoked]
        await client.query('BEGIN');

        // [Insert a transation when test is invoked]
        // const resA = 
        await client.query(
          {
            text: 'select * from api_0_0_1.signup($1::TOKEN,$2::JSONB)',
            values: [token,
                     singleTest]
          }
        );
        // console.log('    TEST signin add user for test', resA.rows);
      }

      // [Get credentials from request]
      
      const res = await client.query(
        {
          text: 'select * from api_0_0_1.signin($1::TOKEN,$2::JSONB)',
          values: [token,
                   form 
                  ]
        }
      );
  
      result = res.rows[0].signin;

      // $lab:coverage:on$
    } catch (err) {
      // [Catch any exceptions]
      /* $lab:coverage:off$ */

      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/signin err',err);
      /* $lab:coverage:on$ */
    
    } finally {

      if (singleTest) {
        // [Rollback transacton when excepton occurs and test is invoked]
        await client.query('ROLLBACK');
      }

      // [Release client back to pool]
      /* $lab:coverage:off$ */
      if (client) {
        client.release();
      }  else {
        console.error('!!! MAKE SURE DATABASE IS RUNNING!!! signin ');
      }

      new ApiDebug('signin', apiDebug).show(req.headers, req.payload, result);

      // [Return {status, msg, token}]
      // eslint-disable-next-line no-unsafe-finally
      return result;
      /* $lab:coverage:on$ */  
    }
  },
  options: {
      cors: {
        origin: JSON.parse(process.env.ACCEPTED_ORIGINS),
        headers:['Authorization', 'Content-Type'],
        exposedHeaders: ['Accept']
      },
      description: 'User Signin with Guest Token',
      notes: 'signin(token, credentials) Returns a {credentials: {username: email}, authentication: {token: JWT} | false }',
      tags: ['api', 'signin'],
      auth: {
        mode: 'required',
        strategy: 'lb_jwt_strategy',
        access: {
          scope: ['api_guest']
        }
      },
      validate: {
        payload: headerSchema,
        headers: payloadSchema.unknown()
      }
    }
};
/*
cors: {
          origin: JSON.parse(process.env.ACCEPTED_ORIGINS),
          headers:['Authorization', 'Content-Type'],
          additionalHeaders:['ApiDebug', 'ApiTimeout', 'ApiTest'],
          exposedHeaders: ['Accept'],
        },
*/