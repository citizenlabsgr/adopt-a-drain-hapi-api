'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionSignup001 extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.method = 'POST';
    this.params = 'token TEXT,form JSON, key TEXT default \'0\'';
    this.name = 'signup';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.baseKind='base';
    this.baseVersion=baseVersion;

    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
        Declare _form JSONB; Declare result JSONB; Declare chelate JSONB := '{}'::JSONB;Declare tmp TEXT;
            BEGIN
              -- [Function: Signup given guest_token TEXT, form JSON]
              -- [Description: Add a new user]
              -- [Switch to Role]
              -- [Switch to api_guest Role]
              -- not supported under Hobby
              -- set role api_ guest;
    
              -- [Validate Token]
    
              result := ${this.baseKind}_${this.baseVersion}.validate_token(token, 'api_guest') ;
    
              if result is NULL then
    
                -- [Fail 403 When token is invalid]
    
                -- not available in hobby RESET ROLE;
    
                return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;
    
              end if;
    
              -- [Verify token has expected scope]
    
              if not(result ->> 'scope' = 'api_guest') then
    
                  -- [Fail 401 when unexpected scope is detected]
    
                  return '{"status":"401","msg":"Unauthorized"}'::JSONB;
    
              end if;
    
              -- [Validate form parameter]
    
              if form is NULL then
    
                  -- [Fail 400 when form is NULL]
    
                  -- not available in hobby RESET ROLE;
    
                  return '{"status":"400","msg":"Bad Request", "extra": "form is NULL" }'::JSONB;
    
              end if;
    
              -- [Validate Form with user's credentials]
    
              _form := form::JSONB;
    
              -- [Validate Requred form fields]
    
              if not(_form ? 'username') then
    
                  -- [Fail 400 when form is missing username field]
    
                  -- not available in hobby RESET ROLE;
    
                  return '{"status":"400","msg":"Bad Request","extra": "Undefined username"}'::JSONB;
    
              end if;
              if not(_form ? 'password') then
    
                  -- [Fail 400 when form is missing password field]
    
                  -- not available in hobby RESET ROLE;
    
                  return '{"status":"400","msg":"Bad Request", "extra":"Undefined password"}'::JSONB;
    
              end if;
    
              -- [Hash password when found]
    
              if _form ? 'password' then
    
                  --_form := (_chelate ->> 'form')::JSONB;
    
                  _form := _form || format('{"password": "%s"}',crypt(form ->> 'password', gen_salt('bf')) )::JSONB;
    
              end if;
    
              -- [Assign Scope]
    
              _form := _form || format('{"scope":"%s"}','api_user')::JSONB;
    
              --raise notice 'signup _form %', _form;
    
              -- [Overide the token's default role]
    
              -- not available in hobby set role api_user;
    
              -- [Assemble Data]
    
              --if CURRENT_USER = 'api_user' then
               
                  if key = '0' then
    
                      -- [Generate owner key when not provided]
    
                      chelate := ${this.baseKind}_${this.baseVersion}.chelate('{"pk":"username","sk":"const#USER","tk":"*"}'::JSONB, _form); -- chelate with keys on insert
    
                  else
    
                    if position('#' in key) < 1 then
    
                        -- [Concat guid to when not 0 and no # is found]
    
                        key := format('guid#%s',key);
    
                    end if;
    
                      -- [Overide owner when signup key provided]
    
                      chelate := ${this.baseKind}_${this.baseVersion}.chelate(format('{"pk":"username","sk":"const#USER","tk":"%s"}', key)::JSONB, _form); -- chelate with keys on insert
    
                  end if;
    
              --end if;
    
              -- [Stash guid for insert]
    
              -- not hobby friendly tmp = set_config('request.jwt.claim.key', chelate ->> 'tk', true); -- If is_local is true, the new value will only apply for the current transaction.
    
              -- [Execute insert]
              raise notice 'chelate %', chelate;

              chelate := chelate || format('{"owner":"%s"}', chelate ->> 'tk')::JSONB;
    raise notice 'chelate %', chelate;
              result := ${this.baseKind}_${this.baseVersion}.insert(chelate, chelate ->> 'owner');
    
              -- result := ${this.baseKind}_${this.baseVersion}.insert(chelate ->> 'tk', chelate,chelate ->> 'owner');
              -- not available in hobby RESET ROLE;
    
              -- [Return {status,msg,insertion}]
    
              return result;
    
            END;
    
            $$ LANGUAGE plpgsql;
    
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TEXT,JSON,TEXT) to api_guest;
    */
    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.method}`;
  }
};