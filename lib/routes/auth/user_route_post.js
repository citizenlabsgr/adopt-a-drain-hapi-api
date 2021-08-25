/*
const Joi = request('joi');

const ChelateUser = require('../../../lib/chelates/chelate_user.js');

// Post Insert
// * requires a user-token
// * payload must contain {pk:"", sk:"", ...} or  {sk:"", tk:"", ...}
// * payload must contain a {...,"form": {...}} key

module.exports = {
  // [Route: /user POST]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: ['POST'],
  path: '/user',
  handler: async function (req, h) {
    // [Define a /user POST route handler]
    let result = {status:"200", msg:"OK"};
    let client ;
    let token ; // guest token
    let form ;
    let rollback = false;
    try {

      // [Optionally rollback insert with headers.rollback=true]
      rollback = req.headers.rollback || false;
      // [Get the API Token from request]
      // [Get the API Token from request]
      token = req.headers.authorization; // guest token
      // [Get a database client from request]
      client = req.pg;
      // [Get pk from request]
      form = req.payload;
      // [Insert User into the database]
      await client.query('BEGIN');
      let res = await client.query(
        {
          text: 'select * from api_0_0_1.user($1::TEXT,$2::JSON)',
          values: [token,
                   form]
        }
      );
      result = res.rows[0].user;
      if (rollback) {
        // rollback for testing
        await client.query('ROLLBACK');
      } else {
        await client.query('COMMIT');
      }

    } catch (err) {
      // [Catch any exceptions and Rollback changes]
      await client.query('ROLLBACK');
      result.status = '500';
      result.msg = 'Unknown Error'
      result['error'] = err;
      console.error('/user post err', err);
    } finally {
      // [Release client back to pool]
      client.release();
      // [Return status, msg, and insertion (copy of the inserted record)]
      return result;
    }
  },
  options: {
        cors: {
            origin:["*"],
            headers:['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Content-Profile']
        },
        description: 'Add User aka SignUp',
        notes: 'Returns {} ',
        tags: ['api'],
        auth: {
          mode: 'required',
          strategy: 'lb_jwt_strategy',
          access: {
            scope: ['api_admin']
          }
        },
        validate: {
          payload: Joi.object({
            username: Joi.string().min(1).max(20).required(),
            displayname: Joi.string().min(1).max(20).required(),
            password: Joi.string().min(7).required()
          }),
          headers: Joi.object({
               'authorization': Joi.string().required()
          }).unknown()
        }
    }
}
*/
