'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionUpdate extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'update';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `
    CREATE OR REPLACE FUNCTION ${this.name}(chelate JSONB,key TEXT) RETURNS JSONB
  
      AS $$
  
        --declare _chelate JSONB;
  
        declare old_chelate JSONB;
  
        declare new_chelate JSONB;
  
        DECLARE v_RowCountInt  Int;
  
        declare _result record;
  
        --DECLARE new_form JSONB;
  
      BEGIN
  
        -- [Function: Update with Chelate like {pk,sk,form}]
  
        -- [Description: General update]
  
        -- have to merge chelate.form with existing chelate
  
        -- handles partial chelate pk,sk, form (no tk)
  
        -- retrieves chelate from table with pk and sk
  
        -- needs to detect tk only changes
  
          --_chelate := chelate::JSONB;
  
          -- primary key update only
  
          -- form must be provided
  
          -- [Validate Parameter (chelate)]
  
          if chelate is NULL then
  
            -- [Fail 400 when a parameter is NULL]
  
            return '{"status":"400","msg":"Bad Request", "extra":"A"}'::JSONB;
  
          end if;
  
  
  
  
  
          if not(chelate ? 'pk'
  
                  and chelate ? 'sk'
  
                  and chelate ? 'form') then
  
             -- [Fail 400 when pk, sk or form are missing ]
  
             return '{"status":"400", "msg":"Bad Request", "extra":"B"}'::JSONB;
  
          end if;
  
  
  
          -- detect a key change
  
  
  
          if ${this.kind}_${this.version}.changed_key(chelate) then
  
            -- [Delete old chelate and insert new when keys change]
  
            -- update keys and form
  
            -- Select and Merge
  
            -- [Get existing chelate from table when key change detected]
  
              SELECT to_jsonb(r) into old_chelate
  
                from (
  
                 Select *
  
                  from ${this.kind}_${this.version}.one
  
                  where pk = lower(chelate ->> 'pk')
  
                  and sk = (chelate ->> 'sk')
  
                  and owner = key
  
                ) r;
  
            if old_chelate is NULL then
  
              -- [Fail 404 when chelate is not found in table]
  
              return format('{"status":"404", "msg":"Not Found", "extra":"C","pk":"%s","sk":"%s","key":"%s"}',lower(chelate ->> 'pk'), (chelate ->> 'sk'), key)::JSONB;
  
            end if;
  
            -- tk patch: fix up the tk when not in the chelate parameter
  
            if not(chelate ? 'tk') then
  
              -- [Patch tk from old chelate when key change detected]
  
              -- add old tk to new chelate
  
              chelate := chelate || format('{"tk":"%s"}',(old_chelate ->> 'tk'))::JSONB;
  
            end if;
  
            -- make proper record (will sort out the tk patch)
  
            -- [Build replacement chelate when key change detected]
  
            new_chelate := ${this.kind}_${this.version}.chelate(chelate);
  
            new_chelate := new_chelate || format('{"active":"%s"}',(old_chelate ->> 'active'))::JSONB;
  
            new_chelate := new_chelate || format('{"owner":"%s"}',(old_chelate ->> 'owner'))::JSONB;
  
            new_chelate := new_chelate || format('{"created":"%s"}',(old_chelate ->> 'created'))::JSONB;
  
            new_chelate := new_chelate || format('{"updated":"%s"}',(old_chelate ->> 'updated'))::JSONB;
  
  
  
            -- Delete old
  
            -- [Drop existing chelate when key change detected]
  
            Delete from ${this.kind}_${this.version}.one
  
              where pk = lower(chelate ->> 'pk')
  
              and sk = chelate ->> 'sk'
  
              and owner = key
  
              returning * into _result;
  
            -- Insert new
  
            -- [Insert new chelate when key change detected]
  
            insert into ${this.kind}_${this.version}.one (pk,sk,tk,form, active, owner, created, updated)
  
              values ((new_chelate ->> 'pk'),
  
                      (new_chelate ->> 'sk'),
  
                      (new_chelate ->> 'tk'),
  
                      ((to_jsonb(_result)->>'form')::JSONB || (new_chelate ->> 'form')::JSONB),
  
                      ((new_chelate ->> 'active')::BOOLEAN),
  
                      (new_chelate ->> 'owner'),
  
                      (new_chelate ->> 'created')::TIMESTAMP,
  
                      NOW()
  
                     )
  
                      returning * into _result;
  
  
  
          else
  
  
  
            -- [Update the Chelate's Form when keys are not changed]
  
            -- update the form only
  
            update ${this.kind}_${this.version}.one
  
              set
  
                form = form || (chelate ->> 'form')::JSONB,
  
                updated = NOW()
  
              where
  
                pk = lower(chelate ->> 'pk')
  
                and sk = (chelate ->> 'sk')
  
                and owner = key
  
                returning * into _result;
  
  
  
            if not(FOUND) then
  
               -- [Fail 404 when given chelate is not found]
  
               return format('{"status":"404", "msg":"Not Found", "extra":"D", "key":"%s", "pk":"%s", "sk":"%s"}',key,chelate ->> 'pk',chelate ->> 'sk')::JSONB;
  
            end if;
  
  
  
          end if;
  
  
  
  
  
          -- [Remove password before return]
  
          -- [Return {status,msg,updation}]
  
  
  
          return format('{"status":"200","msg":"OK","updation":%s}',(to_jsonb(_result) #- '{form,password}')::TEXT)::JSONB;
  
  
  
          --return format('{"status":"200","msg":"OK","updation":%s}',to_jsonb(_result)::TEXT)::JSONB;
  
  
  
      END;
  
      $$ LANGUAGE plpgsql;
  
  
  /* Doesnt work in Hobby
  grant EXECUTE on FUNCTION ${this.name}(JSONB,TEXT) to api_user;
  */
    `;
    // console.log('CreateFunction', this.sql);
  }    
};