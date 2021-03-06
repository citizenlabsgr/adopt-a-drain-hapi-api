
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class FunctionAdopteePostTojUserTokenTest extends Step {
        constructor(kind, version, baseVersion) {
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = `
    BEGIN;
      -- token : token
      -- function: adoptee
      -- chelate: 
      -- method: POST
      -- expected: 
      -- setup: 

      /* no setup */

      SELECT plan(1);

      
        /* Work-around pgtap bug with user defined types and hasFunction
        SELECT has_function(
  
            'api_0_0_1',
      
            'adoptee',
      
            ARRAY[TOKEN,OWNER_ID,JSONB],
      
            'DB Function POST adoptee (TOKEN,OWNER_ID,JSONB) exists'
      
        );
        */
        
        SELECT is (
            (api_0_0_1.adoptee(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_user","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'{"lat":1,"lon":1,"name":"abc","type":"adoptee","drain_id":"GR_40107671","adopter_key":"duckduckgoose"}'::JSONB
            )::JSONB - 'insertion'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB adoptee(TOKEN,OWNER_ID,JSONB) POST api_user 200 0_0_1'::TEXT
        
          );
        
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
        }
    };
            