const Lab = require('@hapi/lab');

const { expect } = require('@hapi/code');

// eslint-disable-next-line no-multi-assign
const { describe, it } = exports.lab = Lab.script();

// const { init } = require('../lib/server');

const Chelate = require('../lib/chelates/chelate');
const Consts = require('../lib/constants/consts');

/* New
PK SK TK must have all
ATT ATT ATT must convert to PK SK TK
CONST CONST CONST must convert to PK SK TK
GUID GUID GUID must convert to PK SK TK
* * * must convert to PK SK TK

* is a calculated GUID

PK + SK must be unique

test   PK    SK    TK          obvious issues
       ----- ----- ----------- ---------
Y      Empty                   ok

-      ATT                     exception(Missing SK)
-            ATT               exception(Missing PK)
-                  ATT         exception(Missing PK)
-            ATT   ATT         exception(Missing PK)
-      ATT   ATT               exception(Missing TK)
y      ATT   ATT   ATT   form  ok
-      ATT   ATT   CONST form  ok
-      ATT   ATT   GUID  form  ok
-      ATT   CONST ATT   form  ok
-      ATT   CONST CONST form  ok
y      ATT   CONST GUID  form  ok
-      ATT   GUID  ATT   form  ok
-      ATT   GUID  CONST form  ok
-      ATT   GUID  GUID  form  ok

-      CONST                   exception(Missing SK)
-            CONST             exception(Missing PK)
-                  CONST       exception(Missing PK)
-            CONST   CONST     exception(Missing PK)
-      CONST   CONST           exception(Missing TK)
-      CONST CONST CONST form  same as ATT ATT ATT
-      CONST CONST ATT   form  same as ATT ATT ATT
-      CONST CONST GUID  form  same as ATT ATT ATT
-      CONST ATT   ATT   form  ok
-      CONST ATT   CONST form  same as ATT ATT ATT
-      CONST ATT   GUID  form  same as ATT ATT ATT
-      CONST GUID  CONST form  same as ATT ATT ATT
-      CONST GUID  ATT   form  same as ATT ATT ATT
-      CONST GUID  GUID  form  same as ATT ATT ATT

-      GUID              form  exception(Missing SK)
-            GUID        form  exception(Missing PK)
-                  GUID  form  exception(Missing PK)
-            GUID  GUID  form  exception(Missing PK)
-      GUID  GUID        form  exception(Missing TK)
-      GUID  GUID  GUID  form  exception(Infinite)
-      GUID  GUID  ATT   form
-      GUID  GUID  CONST form
-      GUID  ATT   ATT   form
-      GUID  ATT   CONST form
-      GUID  ATT   GUID  form
-      GUID  CONST ATT   form
-      GUID  CONST CONST form
-      GUID  CONST GUID  form
-
-      ATT   CONST GUID  form
-      ATT   GUID  CONST form
-      CONST ATT   GUID  form
-      CONST GUID  ATT   form
-      GUID  ATT   CONST form
-      GUID  CONST ATT   form

*/
describe('Chelate', () => {
  // Initialize
  /*
  const keyMapUser = {
    pk: { att: 'username' },
    sk: { const: 'USER' },
    tk: { guid: '*' },
  };
  */

  const attAttAtt = {
    pk: { att: 'username' },
    sk: { att: 'displayname' },
    tk: { att: 'password' },
  };

  const constConstConst = {
    pk: { const: 'USER1' },
    sk: { const: 'USER2' },
    tk: { const: 'USER3' },
  };

  const guidGuidGuid = {
    pk: { guid: '520a5bd9-e669-41d4-b917-81212bc184a3' },
    sk: { guid: '620a5bd9-e669-41d4-b917-81212bc184a3' },
    tk: { guid: '720a5bd9-e669-41d4-b917-81212bc184a3' },
  };
  /*
  const starStarStar = { // aka guidGuidGuid
    pk: { guid: '*' },
    sk: { guid: '*' },
    tk: { guid: '*' },
  };
  */
  /*
  it('New Chelate() empty', () => {
    let chelateObj = new Chelate();
    expect(chelateObj).to.exist();
    expect(chelateObj).toBeDefined();
    expect(chelateObj.pk).not.toBeDefined();
    expect(chelateObj.sk).not.toBeDefined();
    expect(chelateObj.tk).not.toBeDefined();
    expect(chelateObj.form).not.toBeDefined();
    expect(chelateObj.active).not.toBeDefined();
    expect(chelateObj.created).not.toBeDefined();
    expect(chelateObj.updated).not.toBeDefined();
  }) */

  it('New Chelate({ATT ATT ATT} and form)', () => {
    const form = {
      username: 'abc@xyz.com',
      displayname: 'abc',
      password: 'a1A!aaaa',
    };

    const chelate = new Chelate(attAttAtt, form);

    expect(chelate).to.exist();
    expect(chelate.pk).to.equal('username#abc@xyz.com');
    expect(chelate.sk).to.equal('displayname#abc');
    expect(chelate.tk).to.equal('password#a1A!aaaa');

    expect(chelate.form.username).to.equal('abc@xyz.com');
    expect(chelate.form.displayname).to.equal('abc');
    expect(chelate.form.password).to.equal('a1A!aaaa');

    expect(chelate.active).to.equal(true);
    expect(chelate.created).to.exist();
    expect(chelate.updated).to.exist();

    expect(chelate.toJson().form.username).to.equal('abc@xyz.com');
    expect(chelate.toJson().form.displayname).to.equal('abc');
    expect(chelate.toJson().form.password).to.equal('a1A!aaaa');
    expect(chelate.toJson().active).to.equal(true);
    expect(chelate.toJson().created).to.exist();
    expect(chelate.toJson().updated).to.exist();
  });

  it('New Chelate({CONST CONST CONST} and form)', () => {
    const form = {
      username: 'abc@xyz.com',
      displayname: 'abc',
      password: 'a1A!aaaa',
    };

    const chelate = new Chelate(constConstConst, form);

    expect(chelate).to.exist();

    expect(chelate.pk).to.equal('const#USER1');
    expect(chelate.sk).to.equal('const#USER2');
    expect(chelate.tk).to.equal('const#USER3');
    expect(chelate.form.username).to.equal('abc@xyz.com');
    expect(chelate.form.displayname).to.equal('abc');
    expect(chelate.form.password).to.equal('a1A!aaaa');
    expect(chelate.active).to.equal(true);
    expect(chelate.created).to.exist();
    expect(chelate.updated).to.exist();
    expect(chelate.toJson().form.username).to.equal('abc@xyz.com');
    expect(chelate.toJson().form.displayname).to.equal('abc');
    expect(chelate.toJson().form.password).to.equal('a1A!aaaa');
    expect(chelate.toJson().active).to.equal(true);
    expect(chelate.toJson().created).to.exist();
    expect(chelate.toJson().updated).to.exist();
  });

  it('New Chelate({GUID GUID GUID} and form)', () => {
    const form = {
      username: 'abc@xyz.com',
      displayname: 'abc',
      password: 'a1A!aaaa',
    };

    const chelate = new Chelate(guidGuidGuid, form);

    expect(chelate).to.exist();

    expect(chelate.pk).to.equal('guid#520a5bd9-e669-41d4-b917-81212bc184a3');
    expect(chelate.sk).to.equal('guid#620a5bd9-e669-41d4-b917-81212bc184a3');
    expect(chelate.tk).to.equal('guid#720a5bd9-e669-41d4-b917-81212bc184a3');
    expect(chelate.form.username).to.equal('abc@xyz.com');
    expect(chelate.form.displayname).to.equal('abc');
    expect(chelate.form.password).to.equal('a1A!aaaa');
    expect(chelate.active).to.equal(true);
    expect(chelate.created).to.exist();
    expect(chelate.updated).to.exist();
    expect(chelate.toJson().form.username).to.equal('abc@xyz.com');
    expect(chelate.toJson().form.displayname).to.equal('abc');
    expect(chelate.toJson().form.password).to.equal('a1A!aaaa');
    expect(chelate.toJson().active).to.equal(true);
    expect(chelate.toJson().created).to.exist();
    expect(chelate.toJson().updated).to.exist();
  });

  it('New Chelate({* * *} and form)', () => {
    const form = {
      username: 'abc@xyz.com',
      displayname: 'abc',
      password: 'a1A!aaaa',
    };

    const chelate = new Chelate(guidGuidGuid, form);

    expect(chelate).exist();

    // expect(chelate.pk).to.match(new RegExp(Consts.guidPlusPattern()));
    // expect(chelate.sk).to.match(new RegExp(Consts.guidPlusPattern()));
    // expect(chelate.tk).to.match(new RegExp(Consts.guidPlusPattern()));

    expect(chelate.pk).to.match(Consts.guidPlusPattern());
    expect(chelate.sk).to.match(Consts.guidPlusPattern());
    expect(chelate.tk).to.match(Consts.guidPlusPattern());

    expect(chelate.form.username).to.equal('abc@xyz.com');
    expect(chelate.form.displayname).to.equal('abc');
    expect(chelate.form.password).to.equal('a1A!aaaa');
    expect(chelate.active).to.equal(true);
    expect(chelate.created).exist();
    expect(chelate.updated).exist();
    expect(chelate.toJson().form.username).to.equal('abc@xyz.com');
    expect(chelate.toJson().form.displayname).to.equal('abc');
    expect(chelate.toJson().form.password).to.equal('a1A!aaaa');
    expect(chelate.toJson().active).to.equal(true);
    expect(chelate.toJson().created).exist();
    expect(chelate.toJson().updated).exist();
  });

  /*
  removed the .update(form) method
    it('update(form) Chelate(whatever and form).update(form)', () => {
     let form = {
       "username":"abc@xyz.com",
       "displayname":"abc",
       "password":"a1A!aaaa"
      };
      let form1 = {
        "username":"ABC@xyz.com",
        "displayname":"ABC",
        "password":"A1a!AAAA"
       };
      let chelate = new Chelate(attAttAtt, form).update(form1);

      expect(chelate).toBeDefined();
      expect(chelate.pk).to.equal("username#abc@xyz.com");
      expect(chelate.sk).to.equal("displayname#abc");
      expect(chelate.tk).to.equal("password#a1A!aaaa");
      expect(chelate.form.username).to.equal("ABC@xyz.com");
      expect(chelate.form.displayname).to.equal("ABC");
      expect(chelate.form.password).to.equal("A1a!AAAA");

    })
  */
  it('toJson() Chelate(whatever and form).toJson()', () => {
    const form = {
      username: 'abc@xyz.com',
      displayname: 'abc',
      password: 'a1A!aaaa',
    };

    const jsonObj = new Chelate(attAttAtt, form).toJson();

    expect(typeof jsonObj).to.equal('object');
  });

  /*
  it('New Chelate(key_map_user, chelate)', () => {
   let form = {
     "username":"abc@user.com",
     "displayname":"abc",
     "password":"a1A!aaaa"
    };
    let chelate = {
      pk: "username#abc@user.com",
      sk: "const#USER",
      tk: "guid#820a5bd9-e669-41d4-b917-81212bc184a3",
      form: form
    }

    let chelateObj = new Chelate(key_map_user,chelate);

    expect(chelateObj).toBeDefined();
    expect(chelateObj.pk).to.equal('username#abc@user.com');
    expect(chelateObj.sk).to.equal('const#USER');
    expect(chelateObj.tk).toBeDefined();
    expect(chelateObj.tk).toMatch(new RegExp(Consts.guidPlusPattern(),'i') );
    expect(chelateObj.form.username).to.equal('abc@user.com');
    expect(chelateObj.form.displayname).to.equal('abc');
    expect(chelateObj.form.password).to.equal('a1A!aaaa');
    expect(chelateObj.active).to.equal(true);
    expect(chelateObj.created).toBeDefined();
    expect(chelateObj.updated).toBeDefined();
  })

  it('New Chelate({ATT CONST *} and form)', () => {
   let form = {
     "username":"abc@xyz.com",
     "displayname":"abc",
     "password":"a1A!aaaa"
    };
    let key_map = {
      pk: {att: "username"},
      sk: {const: "USER"},
      tk: {guid: "*"}        // * is flag to calculate guid
    };
    let chelate = new Chelate(att_const_guid, form);
    //console.log('chelate', chelate);
    expect(chelate).toBeDefined();
    expect(chelate.pk).to.equal('username#abc@xyz.com');
    expect(chelate.sk).to.equal('const#USER');
    expect(chelate.tk).toBeDefined();
    expect(chelate.tk).toMatch(new RegExp(Consts.guidPlusPattern(),'i') );
    expect(chelate.form.username).to.equal('abc@xyz.com');
    expect(chelate.form.displayname).to.equal('abc');
    expect(chelate.form.password).to.equal('a1A!aaaa');

  })

  it('Chelate.assign(form) ', () => {
   let form = {
     "username":"abc@xyz.com",
     "displayname":"abc",
     "password":"a1A!aaaa"
    };

    // make an object
    let chelate_original = new Chelate(attAttAtt, form);
    // fill an empty object
    let chelate = new Chelate().assign(chelate_original);

    expect(chelate).toBeDefined();
    expect(chelate.pk).to.equal('username#abc@xyz.com');
    expect(chelate.sk).to.equal('displayname#abc');
    expect(chelate.tk).to.equal('password#a1A!aaaa');
    expect(chelate.form.username).to.equal('abc@xyz.com');
    expect(chelate.form.displayname).to.equal('abc');
    expect(chelate.form.password).to.equal('a1A!aaaa');
    expect(chelate.active).to.equal(true);
    expect(chelate.created).toBeDefined();
    expect(chelate.updated).toBeDefined();
    expect(chelate.toJson().form.username).to.equal('abc@xyz.com');
    expect(chelate.toJson().form.displayname).to.equal('abc');
    expect(chelate.toJson().form.password).to.equal('a1A!aaaa');
    expect(chelate.toJson().active).to.equal(true);
    expect(chelate.toJson().created).toBeDefined();
    expect(chelate.toJson().updated).toBeDefined();

  })

  it('Chelate.toString()', () => {
   let form = {
     "username":"abc@xyz.com",
     "displayname":"abc",
     "password":"a1A!aaaa"
    };

    let chelate = new Chelate(attAttAtt, form);
    expect(chelate).toBeDefined();
    expect(chelate.toString()).toBeDefined();
  })

  it('New Chelate({ATT CONST *} and form)', () => {
   let form = {
     "username":"abc@xyz.com",
     "displayname":"abc",
     "password":"a1A!aaaa"
    };

    let chelate = new Chelate(att_const_guid, form);
    //console.log('chelate', chelate);
    expect(chelate).toBeDefined();
    expect(chelate.pk).to.equal('username#abc@xyz.com');
    expect(chelate.sk).to.equal('const#USER');
    expect(chelate.tk).to.equal('guid#520a5bd9-e669-41d4-b917-81212bc184a3');
    expect(chelate.form.username).to.equal('abc@xyz.com');
    expect(chelate.form.displayname).to.equal('abc');
    expect(chelate.form.password).to.equal('a1A!aaaa');

  })

  it('Chelate({ATT CONST GUID} and chelate).update(form) ', () => {

   let form1 = {
     "username":"abc@user.com",
     "displayname":"abc",
     "password":"a1A!aaaa"
    };
    let chelate1 = {
      pk: "username#abc@user.com",
      sk: "const#USER",
      tk: "guid#820a5bd9-e669-41d4-b917-81212bc184a3",
      form: form1
    }

    let form2 = {
      "username":"abc2@user.com",
      "displayname":"abc2",
      "password":"b1B!bbbb"
     };

    let chelate = new Chelate(att_const_guid,chelate1).update(form2);
    //console.log('chelate', chelate);
    //expect(chelateObj._guessFormType(key_map, chelate)).to.equal(1);
    expect(chelate).toBeDefined();
    expect(chelate.pk).to.equal('username#abc@user.com');
    expect(chelate.sk).to.equal('const#USER');
    expect(chelate.tk).toBeDefined();
    expect(chelate.tk).toMatch(new RegExp(Consts.guidPlusPattern(),'i') );
    expect(chelate.form.username).to.equal('abc2@user.com');
    expect(chelate.form.displayname).to.equal('abc2');
    expect(chelate.form.password).to.equal('b1B!bbbb');
    expect(chelate.active).to.equal(true);
    expect(chelate.created).toBeDefined();
    expect(chelate.updated).toBeDefined();
  })
*/
});
