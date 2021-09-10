import {assert} from 'chai';
import Email from '../Email.js';
import validator from 'validator';


// import dotenv from 'dotenv';
// dotenv.config();

const validEmailAddress = 'example@email.com';
const invalidEmailAddress = 'example@emailcom';
const emailToTest = process.env.email;


describe('Email.validate():', function() {

  it(`validate(${validEmailAddress}) to return true`, function() {
    assert.isTrue(Email.validate(validEmailAddress));
  });
  it(`validate(${invalidEmailAddress}) to return false`, function() {
    assert.isFalse(Email.validate(invalidEmailAddress));
  });
});

describe(`new Email()`, function() {
  const email = new Email();
  it(`successful instance of the class Email()`, function() {
    assert.instanceOf(email, Email);
  });

  it(`get() should return null`, function () {
    assert.isNull(email.get());
  });

  it(`set(${validEmailAddress}) to email instance (successfully)`, function() {
    assert.equal(email.set(validEmailAddress), validEmailAddress);
  });

  it(`set(${invalidEmailAddress}) to email instance (throws error)`, function() {
    try {
      email.set(invalidEmailAddress);
      assert.fail('email value is invalid, therefore should have thrown an error.');
    } catch (error) {
      assert.instanceOf(error, Error);
      assert.strictEqual(error.message, 'email value is invalid.');
    }
  });
  it(`get() value of email instance to return ${validEmailAddress}`, function() {
    assert.strictEqual(email.get(), validEmailAddress);
  });
});

if (emailToTest) {
  describe(`Testing passed email address: ${emailToTest}`, function() {
    const email = new Email();
    const validateEmail = validator.isEmail(emailToTest);


    // check to see if email is an instance of the class Email
    it(`new Email()`, function() {
      assert.instanceOf(email, Email);
    });

    if (validateEmail) {
      // test validate() static method on Email
      it(`validate(${emailToTest}) to return true`, function() {
        const valid = Email.validate(emailToTest)
        assert.isTrue(valid);
        assert.strictEqual(valid, validateEmail);
      });
      // try to set the address value to the Email instance
      it(`set(${emailToTest}) to Email instance`, function() {
        assert.strictEqual(email.set(emailToTest), emailToTest);
      });
      // try to get the address value from the instance email
      it(`get() instance method to return ${emailToTest}`, function() {
        assert.strictEqual(email.get(), emailToTest);
      });


      if (process.env.code) {
        it(`confirm verification email to ${emailToTest}`, async function() {
          try {
            const verification = await email.confirmEmailVerification(process.env.code);
            assert.isDefined(verification);
            assert.strictEqual(verification.status, 'approved');
            assert.strictEqual(verification.to, email.get());
            assert.isTrue(verification.valid);
            assert.isTrue(email.isVerified());

          } catch(error) {
            assert.fail(error.message);
          }
        });
      }
      else {
        it(`send verification email to ${emailToTest}`, async function () {
          try {
            const verification = await email.sendEmailVerification();

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
            assert.strictEqual(verification.to, email.get());
            assert.isFalse(verification.valid);
            assert.isFalse(email.isVerified());

          } catch (error) {
            assert.fail(error.message);
          }
        });
      }

      it(`set(${validEmailAddress}) of Email instance to update (successfully)`, function() {
        assert.strictEqual(email.set(validEmailAddress), validEmailAddress);
      });
      it(`set(${invalidEmailAddress}) of Email instance to update (throws error)`, function() {
        try {
          email.set(invalidEmailAddress)
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
        assert.isFalse(Email.validate(emailToTest));
      });
      it(`set(${emailToTest}) should fail and throw an error`, function() {
        try {
          email.set(emailToTest);
          assert.fail('email value is invalid, therefore should have thrown an error.');
        }
        catch (error) {
          assert.instanceOf(error, Error);
          assert.strictEqual(error.message, 'email value is invalid.');
        }
      })
      it(`get() should return null`, function() {
        assert.isNull(email.get());
      });
    }
  });
}