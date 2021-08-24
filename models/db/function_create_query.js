'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionQuery extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'query';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(criteria JSONB) RETURNS JSONB

    AS $$
    
      --declare _criteria JSONB;
    
      declare _result JSONB;
    
    BEGIN
    
      -- [Function: Query by Criteria like {pk,sk},{sk,tk}, or {xk,yk}]
    
      -- [Description: General search]
    
      -- select by pk and sk
    
      -- or sk and tk
    
      -- use wildcard * in any position
    
      -- criteria is {pk:"", sk:""} or {sk:"", tk:""} or {xk:"", yk:""}
    
    
    
      -- [Validate parameters (criteria)]
    
      if criteria is NULL then
    
        -- [Fail 400 when a parameter is NULL]
    
        return '{"status":"400","msg":"Bad Request"}'::JSONB;
    
      end if;
    
    
    
      BEGIN
    
    
    
        -- [Note sk, tk, yk key may contain wildcards *]
    
        -- [Remove password when found]
    
        if criteria ? 'pk' and criteria ? 'sk' and criteria ->> 'sk' = '*' then
    
          -- [Query where criteria is {pk, sk:*}]
    
          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
    
            FROM ${this.kind}_${this.version}.one u
    
            where pk = lower(criteria ->> 'pk');
    
    
    
        elsif criteria ? 'pk' and criteria ? 'sk' then
    
          -- [Query where criteria is {pk, sk}]
    
          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
    
            FROM ${this.kind}_${this.version}.one u
    
            where pk = lower(criteria ->> 'pk')  and sk = criteria ->> 'sk';
    
    
    
        elsif criteria ? 'sk' and criteria ? 'tk' and criteria ->> 'tk' = '*' then
    
          -- [Query where criteria is {sk, tk:*}]
    
          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
    
            FROM ${this.kind}_${this.version}.one u
    
            where sk = criteria ->> 'sk';
    
    
    
        elsif criteria ? 'sk' and criteria ? 'tk' then
    
          -- [Query where criteria is {sk, tk}]
    
          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
    
            FROM ${this.kind}_${this.version}.one u
    
            where sk = criteria ->> 'sk' and tk = criteria ->> 'tk';
    
    
    
        elsif criteria ? 'xk' and criteria ? 'yk' and criteria ->> 'yk' = '*'  then
    
          -- [Query where criteria is {xk,yk:*}]
    
          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
    
            FROM ${this.kind}_${this.version}.one u
    
            where tk = criteria ->> 'xk';
    
    
    
        elsif criteria ? 'xk' and criteria ? 'yk' then
    
          -- [Query where criteria is {xk, yk}]
    
          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
    
            FROM ${this.kind}_${this.version}.one u
    
            where tk = criteria ->> 'xk' and sk = criteria ->> 'yk';
    
    
    
        else
    
          -- [Fail 400 when the Search Pattern is missing expected Keys]
    
          return format('{"status:"400","msg":"Bad Request", "extra":"A%s"}',sqlstate)::JSONB;
    
        end if;
    
    
    
      EXCEPTION
    
          when others then
    
            --Raise Notice 'query EXCEPTION out';
    
            return format('{"status":"400","msg":"Bad Request", "extra":"%s"}',sqlstate)::JSONB;
    
      END;
    
    
    
      if _result is NULL then
    
        -- [Fail 404 when query results are empty]
    
        return format('{"status":"404","msg":"Not Found","criteria":%s}', criteria)::JSONB;
    
      end if;
    
    
    
      -- [Return {status,msg,selection}]
    
      return format('{"status":"200", "msg":"OK", "selection":%s}', _result)::JSONB;
    
    
    
    END;
    
    $$ LANGUAGE plpgsql;
    
    
    /* Doesnt work in Hobby
    --grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_guest;
    
    grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_user;
    
    grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_admin;
    */
    `;
    // console.log('CreateFunction', this.sql);
  }    
};