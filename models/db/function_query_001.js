'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class FunctionQuery001 extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    // let version = `${baseName}_${baseVersion}`;

    this.name = 'query';
    let version = `${baseName}_${baseVersion}`;
    this.name = `${version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(criteria JSONB) RETURNS JSONB
    AS $$
    
      declare _result JSONB;
      DECLARE _criteria JSONB;
    BEGIN
    
      -- [Function: Query by Criteria like {pk,sk},{sk,tk}, or {xk,yk}]
      -- [Description: General search]
      -- select by pk and sk
      -- or sk and tk
      -- use wildcard * in any position    
      -- criteria is {pk:"", sk:""} 
      --            or {sk:"", tk:""} 
      --            or {xk:"", yk:""}
      --    
      -- [Validate parameters (criteria)]
    
      if criteria is NULL then
    
        -- [Fail 400 when a parameter is NULL]
        return format('{"status":"400","msg":"Bad Request", "extra":"A", "criteria":"%s"}',criteria)::JSONB;
    
      end if;
    
      _criteria := criteria::JSONB;
      
      BEGIN
        
        -- [Note sk, tk, yk key may contain wildcards *]    
        -- [Remove password when found]
    
        if _criteria ? 'pk' and _criteria ? 'sk' and _criteria ->> 'sk' = '*' then
    
              -- [Query where _criteria is {pk, sk:*}]      
		      SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result    
		            FROM ${version}.one u    
		            where pk = lower(_criteria ->> 'pk');		            

        elsif _criteria ? 'pk' and _criteria ? 'sk' then
    
              -- [Query where _criteria is {pk, sk}]      
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${version}.one u    
	            where pk = lower(_criteria ->> 'pk')  and sk = _criteria ->> 'sk';  
          
        elsif _criteria ? 'sk' and _criteria ? 'tk' and _criteria ->> 'tk' = '*' then
    
              -- [Query where _criteria is {sk, tk:*}]          
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${version}.one u
	            where sk = _criteria ->> 'sk';   
    
        elsif _criteria ? 'sk' and _criteria ? 'tk' then
    
              -- [Query where _criteria is {sk, tk}]
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${version}.one u
	            where sk = _criteria ->> 'sk' and tk = _criteria ->> 'tk';
          
        elsif _criteria ? 'xk' and _criteria ? 'yk' and _criteria ->> 'yk' = '*'  then
    
              -- [Query where _criteria is {xk,yk:*}] 	     
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${version}.one u
	            where tk = _criteria ->> 'xk';
                 
        elsif _criteria ? 'xk' and _criteria ? 'yk' then
    
          	  -- [Query where _criteria is {xk, yk}]
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${version}.one u
	            where tk = _criteria ->> 'xk' and sk = _criteria ->> 'yk';

        else
    
          -- [Fail 400 when the Search Pattern is missing expected Keys]
          return format('{"status:"400","msg":"Bad Request", "extra":"B%s", "criteria": "%s"}', sqlstate, _criteria::TEXT)::JSONB;
    
        end if;
    
      EXCEPTION
    
          when others then
    
            --Raise Notice 'query EXCEPTION out';
            return format('{"status":"400","msg":"Bad Request", "extra":"C%s","criteria": "%s"}',sqlstate, _criteria::TEXT)::JSONB;
    
      END;
    
      if _result is NULL then
    
        -- [Fail 404 when query results are empty 
        return format('{"status":"404","msg":"Not Found","criteria": %s}', _criteria::TEXT)::JSONB;
    
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