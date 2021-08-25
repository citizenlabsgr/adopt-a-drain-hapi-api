'use strict';

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionUpdateTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'update';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `BEGIN;
    insert into ${this.kind}_${this.version}.one
    
      (pk, sk, tk, form, owner)
    
      values (
    
          'username#update@user.com',
    
          'const#USER',
    
          'guid#820a5bd9-e669-41d4-b917-81212bc184a3',
    
          '{"username":"update@user.com",
    
                  "displayname":"J",
    
                  "scope":"api_user",
    
                  "password": "$2a$06$TXVF4CDfUcHXvTeOIGrEn.BSGbbCzLxMu2t8tyZimKtsBRxxyeQBK"
    
           }'::JSONB,
    
          'updateOwner'
    
      );
    
      SELECT plan(12);
    
      -- 1
    
      SELECT has_function(
          '${this.kind}_${this.version}',
          'update',
          ARRAY[ 'JSONB','TEXT' ],
          'Function Update (_chelate JSONB,TEXT) exists'
      );
    
      --  2
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "form":{"username":"update@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          'updateOwner')::JSONB ->> 'msg',
    
          'Bad Request'::TEXT,
    
          'Update Bad no keys form Bad Request 0_0_1'::TEXT
    
      );
    
      -- 3
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form":{"username":"update@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          'updateOwner')::JSONB ->> 'msg',
    
          'Bad Request'::TEXT,
    
          'Update Bad tk only form Bad Request 0_0_1'::TEXT
    
      );
    
      -- 4
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "sk":"const#USER",
    
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form":{"username":"update@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          'updateOwner')::JSONB ->> 'msg',
    
          'Bad Request'::TEXT,
    
          'Update Bad sk tk form Bad Request 0_0_1'::TEXT
    
      );
    
      -- 5
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "pk":"username#update@user.com",
    
          "sk":"const#USER",
    
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3"
    
          }'::JSONB,
    
          'updateOwner')::JSONB ->> 'msg',
    
          'Bad Request'::TEXT,
    
          'Update Bad pk sk tk NO form Bad Request 0_0_1'::TEXT
    
      );
    
      -- 6
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "pk":"username#unknown@user.com",
    
          "sk":"const#USER",
    
          "tk":"guid#unknown820a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form":{"username":"unknown@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          'updateOwner')::JSONB ->> 'msg',
    
          'Not Found'::TEXT,
    
          'Update Bad pk sk tk form PK Not Found 0_0_1'::TEXT
    
      );
    
      -- 7
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "pk":"username#unknown@user.com",
    
          "sk":"const#USER",
    
          "tk":"guid#unknown820a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form":{"username":"unknown@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          'updateOwner')::JSONB ->> 'msg',
    
          'Not Found'::TEXT,
    
          'Update Bad badpk sk tk form PK Not Found 0_0_1'::TEXT
    
      );
 
      -- 8 Not Found with a change
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "pk":"username#unknown@user.com",
    
          "sk":"const#USER",
    
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form": {
    
              "username":"update2@user.com",
    
              "displayname":"J",
    
              "const":"USER",
    
              "guid":"820a5bd9-e669-41d4-b917-81212bc184a3"
    
            }
    
          }'::JSONB,
    
          'unknownOwner')::JSONB ->> 'msg',
    
          'Not Found'::TEXT,
    
          'Update Not Found with Change  0_0_1'::TEXT
    
      );
    
    
    
      -- 9 No change
    
    
    
      SELECT is (
    
        (${this.kind}_${this.version}.update('{
    
          "pk":"username#update@user.com",
    
          "sk":"const#USER",
    
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form": {
    
              "username":"update@user.com",
    
              "displayname":"J",
    
              "const":"USER",
    
              "guid":"820a5bd9-e669-41d4-b917-81212bc184a3"
    
            }
    
          }'::JSONB,
    
          'updateOwner')::JSONB - 'updation'),
    
          '{"msg":"OK","status":"200"}'::JSONB,
    
          'Update No change OK  0_0_1'::TEXT
    
      );
    
    
    
      -- 10 Form change OK
    
     SELECT is (
    
       ${this.kind}_${this.version}.update(
    
           '{
    
             "pk":"username#update@user.com",
    
             "sk":"const#USER",
    
             "tk":"guid#d820a5bd9-e669-41d4-b917-81212bc184a3",
    
             "form":{
    
                     "username":"update@user.com",
    
                     "displayname":"K",
    
                     "const":"USER",
    
                     "guid":"820a5bd9-e669-41d4-b917-81212bc184a3"
    
                   }
    
            }'::JSONB,
    
            'updateOwner'
    
         )::JSONB ->> 'msg',
    
         'OK'::TEXT,
    
         'Update displayname change OK  0_0_1'::TEXT
    
     );
    
    
    
     -- 11  Single Key Change only
    
     SELECT is (
    
       ${this.kind}_${this.version}.update(
    
         '{
    
           "pk":"username#update@user.com",
    
           "sk":"const#USER",
    
           "tk":"guid#d820a5bd9-e669-41d4-b917-81212bc184a3",
    
           "form":{
    
                   "username":"CHANGEupdate@user.com",
    
                   "displayname":"J",
    
                   "const":"USER",
    
                   "guid":"820a5bd9-e669-41d4-b917-81212bc184a3"
    
                 }
    
          }'::JSONB,
    
          'updateOwner'
    
         )::JSONB ->> 'msg',
    
         'OK'::TEXT,
    
         'Update pk key change OK  0_0_1'::TEXT
    
     );
    
     --  12 Multiple Key Change
    
     SELECT is (
    
       ${this.kind}_${this.version}.update(
    
         '{
    
           "pk":"username#update@user.com",
    
           "sk":"const#USER",
    
           "tk":"guid#d820a5bd9-e669-41d4-b917-81212bc184a3",
    
           "form":{
    
                   "username":"CHANGEupdate@user.com",
    
                   "displayname":"J",
    
                   "const":"CHANGETEST",
    
                   "guid":"820a5bd9-e669-41d4-b917-81212bc184a3"
    
                 }
    
          }'::JSONB,
    
          'updateOwner'
    
         )::JSONB ->> 'msg',
    
         'Not Found'::TEXT,
    
         'Update, DOUBLE PUMP on an update 0_0_1'::TEXT
    
     );
    
      SELECT * FROM finish();
    
    ROLLBACK;
    `;
    // $lab:coverage:on$
  }    
};