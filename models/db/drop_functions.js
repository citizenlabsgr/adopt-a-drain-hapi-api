'use strict';

const Step = require('../../lib/runner/step');
module.exports = class DropFunction extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);

    // [Function drops occur when a function's name or parameters change]

    this.sql = `
    DROP FUNCTION if exists api_0_0_1.adopter(TOKEN,VARCHAR,OWNER_ID);
    DROP FUNCTION if exists api_0_0_1.adoptee(token,owner_id,identity);
    DROP FUNCTION if exists api_0_0_1.adopter(token,identity,json,owner_id);

    DROP FUNCTION if exists base_0_0_1.query(mbr);

    -- DROP FUNCTION if exists function api_0_0_1.adoptee(token, jsonb) ;

    DROP FUNCTION if exists api_0_0_1.adoptee(TOKEN,JSON);

    DROP FUNCTION if exists api_0_0_1.adoptee(TOKEN,MBR);

    DROP FUNCTION if exists api_0_0_1.adoptee(TOKEN,VARCHAR);

    DROP FUNCTION if exists api_0_0_1.adoptee(TOKEN,IDENTITY,JSON);

    DROP FUNCTION if exists base_0_0_1.query(jsonb);

    DROP FUNCTION if exists base_0_0_1.query(jsonb,owner_id);

    DROP FUNCTION if exists base_0_0_1.sign(json,text,text);

    DROP FUNCTION if exists base_0_0_1.delete(JSONB, OWNER_ID);
    DROP FUNCTION if exists base_0_0_1.delete(TOKEN, VARCHAR, OWNER_ID);
    DROP FUNCTION if exists base_0_0_1.delete(jsonb,text);

    DROP FUNCTION if exists base_0_0_1.update(jsonb,text);
    DROP FUNCTION if exists base_0_0_1.update(chelate JSONB, OWNER_ID);
    DROP FUNCTION if exists base_0_0_1.insert(jsonb,text);

    DROP FUNCTION if exists base_0_0_1.validate_token(text,text);
    DROP FUNCTION if exists base_0_0_1.sign(json,text,text);

    DROP FUNCTION if exists api_0_0_1.adoptee(TOKEN, IDENTITY, JSON, OWNER_ID);
    DROP FUNCTION if exists api_0_0_1.adoptee(TOKEN,VARCHAR,OWNER_ID);
    DROP FUNCTION if exists api_0_0_1.adoptee(text,text,text);
    Drop Function if exists api_0_0_1.adoptee(TEXT, TEXT);
    Drop Function if exists api_0_0_1.adoptee(TEXT, VARCHAR, TEXT);
    Drop Function if exists api_0_0_1.adoptee(TEXT, TEXT, JSON, TEXT);
    DROP FUNCTION if exists api_0_0_1.adoptees(token,json);

    DROP FUNCTION if exists api_0_0_1.signin(token,json,integer) ;

    DROP FUNCTION if exists api_0_0_1.signup(TEXT,JSON,TEXT);
    DROP FUNCTION if exists api_0_0_1.signin(TEXT,JSON);
    DROP FUNCTION if exists api_0_0_1.adopter(TEXT,JSON);

    DROP FUNCTION if exists base_0_0_1.chelate(JSONB);
    DROP FUNCTION if exists base_0_0_1.chelate(JSONB,JSONB);
    DROP FUNCTION if exists base_0_0_1.insert(JSONB,TEXT);
    `;
  }

  getName() {
    return 'Drop Functions that have changed.';
  }

};
