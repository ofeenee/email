import {assert} from 'chai';
import Email from '../Email.js';
import validator from 'validator';


const validEmailAddress = 'example@email.com';
const invalidEmailAddress = 'example@emailcom';
const emailToTest = process.env.email;


describe('Email.validate():', function() {
  const email = new Email();
  it(`validate(${validEmailAddress}) to return true`, function() {
    try {
      assert.isTrue(email.validate(validEmailAddress));
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
  it(`validate(${invalidEmailAddress}) to return false`, function() {
    try {
      assert.isFalse(email.validate(invalidEmailAddress));
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
});

describe(`new Email()`, function() {
  const email = new Email();
  it(`create successful instance of the class Email() = "email"`, function() {
    try {
      assert.instanceOf(email, Email);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`the property emailAddress of the Email instance "email" should return null`, function () {
    try {
      assert.isNull(email.emailAddress);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`assign (${validEmailAddress}) to emailAddress property of the Email instance "email" (successfully)`, function() {
    try {
      email.emailAddress = validEmailAddress;
      assert.equal(email.emailAddress, validEmailAddress);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });

  it(`assign (${invalidEmailAddress}) to emailAddress property of the Email instance "email" (throws error)`, function() {
    try {
      email.emailAddress = invalidEmailAddress;
      assert.fail('email value is invalid, therefore should have thrown an error.');
    } catch (error) {
      assert.instanceOf(error, Error);
      assert.strictEqual(error.message, 'email value is invalid.');
    }
  });
  it(`emailAddress property of the Email instance "email" should return ${validEmailAddress}`, function() {
    try {
      assert.strictEqual(email.emailAddress, validEmailAddress);
    }
    catch (error) {
      assert.fail(error.message);
    }
  });
});

if (emailToTest) {
  describe(`Testing passed email address: ${emailToTest}`, function() {
    const email = new Email();
    const validateEmail = validator.isEmail(emailToTest);


    // check to see if email is an instance of the class Email
    it(`new Email()`, function() {
      try {
        assert.instanceOf(email, Email);
      }
      catch (error) {
        assert.fail(error.message);
      }
    });

    if (validateEmail) {
      // test validate() static method on Email
      it(`validate(${emailToTest}) to return true`, function() {
        try {
          const valid = email.validate(emailToTest)
          assert.isTrue(valid);
          assert.strictEqual(valid, validateEmail);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });
      // try to set the address value to the Email instance
      it(`assign (${emailToTest}) to emailAddress property`, function() {
        try {
          email.emailAddress = emailToTest;
          assert.strictEqual(email.emailAddress, emailToTest);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });
      // try to get the address value from the instance email
      it(`emailAddress property should return ${emailToTest}`, function() {
        try {
          assert.strictEqual(email.emailAddress, emailToTest);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });


      if (process.env.code) {
        it(`confirm verification email to ${emailToTest}`, async function() {
          try {
            const verification = await email.confirm(process.env.code);
            assert.isDefined(verification);
            assert.strictEqual(verification.status, 'approved');
            assert.strictEqual(verification.to, email.emailAddress);
            assert.isTrue(verification.valid);
            assert.isTrue(email.verified);

          } catch(error) {
            assert.fail(error.message);
          }
        });
      }
      else {
        it(`send verification email to ${emailToTest}`, async function () {
          try {
            const verification = await email.verify();

            // const {sid, status, valid, sendCodeAttempts} = verification;
            // console.log({sid, status, valid, sendCodeAttempts});

            assert.isDefined(verification);
            assert.containsAllKeys(verification, [
              'sid',
              'serviceSid',
              'accountSid',
              'to',
              'channel',
              'status',
              'valid',
            ]);
            assert.strictEqual(verification.status, 'pending');
            assert.strictEqual(verification.to, email.emailAddress);
            assert.isFalse(verification.valid);
            assert.isFalse(email.verified);

          } catch (error) {
            assert.fail(error.message);
          }
        });
      }

      it(`assign (${validEmailAddress}) to emailAddress property to update (successfully)`, function() {
        try {
          email.emailAddress = validEmailAddress;
          assert.strictEqual(email.emailAddress, validEmailAddress);
        }
        catch (error) {
          assert.fail(error.message);
        }
      });
      it(`assign (${invalidEmailAddress}) to emailAddress property to update (throws error)`, function() {
        try {
          email.emailAddress = invalidEmailAddress;
          assert.fail('email value is invalid, therefore should have thrown an error.');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.strictEqual(error.message, 'email value is invalid.');
        }
      });

    }
    else {
      it(`validate(${emailToTest}) to return false (invalid)`, function() {
        try {
          assert.isFalse(email.validate(emailToTest));
        }
        catch (error) {
          assert.fail(error.message);
        }
      });

      it(`assign (${emailToTest}) to property emailAddress property should fail and throw an error`, function() {
        try {
          email.emailAddress = emailToTest;
          assert.fail('email value is invalid, therefore should have thrown an error.');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.strictEqual(error.message, 'email value is invalid.');
        }
      });

      it(`emailAddress property should return null`, function() {
        assert.isNull(email.emailAddress);
      });
    }
  });
}