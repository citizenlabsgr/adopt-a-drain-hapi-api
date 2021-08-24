'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionChelate extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'chelate';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(expected_keys JSONB, form JSONB) RETURNS JSONB

    AS $$
    
      Declare _rc JSONB := '{}'::JSONB;
    
      Declare _rec record;
    
      Declare _key TEXT;
    
      DECLARE _fld TEXT;
    
      Declare i integer := 0;
    
    BEGIN
    
      -- [Function: Chelate]
    
      -- [Description: Build a Chelate given a list of expected keys and a form]
    
      -- construct {form:{},pk:"", sk:"", tk:""}
    
      -- user with client.insert
    
      -- make a chelate from expected_keys and form
    
      -- expected_keys eg {"pk":"username","sk":"const#USER", "tk":"*"}
    
      -- expected_keys eg {"pk":"asset_id+user_key","sk":"const#USER", "tk":"*"}
    
      -- check incomming values
    
      -- Validate expected_keys and form]
    
      if expected_keys is NULL or form is NULL then
    
        -- [Fail NULL when expected_keys or form is NULL]
    
        return NULL;
    
      end if;
    
      -- keys
    
      -- Build Chelate keys from form values]
    
      FOR _rec IN SELECT * FROM jsonb_each_text(expected_keys)
    
        LOOP
    
           _key := _rec.key;
    
           _fld := _rec.value; -- value is a field name
    
    
    
           if form ? _fld then
    
              -- Handle Simple Value as {<key-name>:<form.field-name>#<form.field-value>}]
    
              -- [Handle Simple Value]
    
              _rc := _rc || format('{"%s":"%s#%s"}',_key, _fld, form ->> _fld)::JSONB;
    
    
    
           elsif strpos(_fld, 'const#') = 1 then
    
              -- Handle Constant as {<key-name>:const#<constant-value>}]
    
              -- [Handle Constant ... passthrough]
    
              _rc := _rc || format('{"%s":"%s"}',_key, _fld)::JSONB;
    
           elsif strpos(_fld, 'guid#') = 1 then
    
              -- Handle GUID as {<key-name>:guid#<guid-value>}]
    
              -- [Handle GUID...passthrough, guid is defined, so pass it through]
    
              _rc := _rc || format('{"%s":"%s"}',_key, _fld)::JSONB;
    
           elsif _fld = '*' then
    
              -- Handle Wildcard as {<key-name>:guid#<generated-guid-value>}]
    
              -- [Handle Wildcard...generate guid]
    
              _rc := _rc || format('{"%s":"guid#%s"}',_key, uuid_generate_v4())::JSONB;
    
           else -- not found
    
              -- [Fail NULL When expected key is not found in form]
    
              return NULL;
    
           end if;
    
           i = 1;
    
        END LOOP;
    
    
    
        if i = 0 then
    
          -- [Fail NULL When expected key object is {}]
    
          return NULL;
    
        end if;
    
    
    
        _rc := _rc || format('{"form":%s}',form::TEXT)::JSONB;
    
      -- [Return {pk,sk,tk,form:{key1:value, key2:value2,...}}]
    
      return _rc;
    
    
    
    END;
    
    $$ LANGUAGE plpgsql;
    
    
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(JSONB,JSONB) to api_user;
    */
    
    
    CREATE OR REPLACE FUNCTION ${this.name}(chelate JSONB) RETURNS JSONB
    
    AS $$
    
     DECLARE _rec record;
    
     DECLARE _fld TEXT;
    
     DECLARE _form jsonb;
    
     DECLARE _value TEXT;
    
     DECLARE _key TEXT;
    
     DECLARE _out JSONB;
    
    BEGIN
    
    
    
    --
    
    
    
    -- creates proposed chelate to update
    
    
    
    -- "created" is added on insert, it will be in the record and doesnt need to be added
    
    -- "updated" is changed everytime
    
    --   GUID never changes
    
    _form := chelate ->> 'form';
    
    -- UPDATED date
    
    _out := format('{"updated": "%s"}', NOW());
    
    
    
    -- get outter keys of chelate
    
    FOR _rec IN SELECT * FROM jsonb_each_text(chelate)
    
    LOOP
    
      _key := _rec.key;
    
      _fld := split_part(_rec.value, '#', 1);
    
    
    
      if _key = 'form' then
    
         -- copy the whole form att
    
         _out := _out || format('{"form": %s}', _form::TEXT)::JSONB;
    
      elsif  _form ->> _fld is NULL then -- key not in form
    
         -- is a constant, a guid, created, keep the current value
    
        if not(_fld = 'updated') then -- skip updated field
    
           _out := _out || format('{"%s":"%s"}', _key, chelate ->> _key)::JSONB;
    
        end if;
    
      else
    
         -- this is a key
    
        _out := _out || format('{"%s":"%s#%s"}', _key, _fld, _form ->> _fld)::JSONB;
    
    
    
      end if;
    
    END LOOP;
    
    
    
    return _out;
    
    
    
    END;
    
    $$ LANGUAGE plpgsql;
    
    
    
    
    /* Doesnt work in Hobby
    GRANT EXECUTE on FUNCTION ${this.name}(JSONB) to api_user;
    */
    `;
    // console.log('CreateFunction', this.sql);
  }    
};