import {assert} from 'chai';
import Email from '../Email.js';
import validator from 'validator';

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

describe(`new Email(<email address>)`, function() {
  it(`successful instance of Email(${validEmailAddress})`, function() {
    const email = new Email(validEmailAddress);
    assert.instanceOf(email, Email);
  });
  it(`unsuccessful instance of Email(${invalidEmailAddress})`, function() {
    const email = new Email(invalidEmailAddress);
    assert.notInstanceOf(email, Email);
    assert.instanceOf(email, Error);
  });
});

if (emailToTest) {
  describe(`Testing passed email address: ${emailToTest}`, function() {
    const validEmail = validator.isEmail(emailToTest);
    const email = new Email(emailToTest);
    const updateEmail = 'email.address@example.com';

    if (validEmail) {
      // test validate() static method on Email
      it(`validate(${emailToTest}) to return true`, function() {
        assert.isTrue(Email.validate(emailToTest));
      });
      // check to see if email is an instance of the class Email
      it(`new Email(${emailToTest})`, function() {
        assert.instanceOf(email, Email);
      });
      // try to get the address value from the instance email
      it(`get() instance method to return value`, function() {
        assert.strictEqual(email.get(), emailToTest);
      });
      it(`update email address to (${updateEmail})`, function() {
        email.update(updateEmail);
        assert.strictEqual(email.get(), updateEmail);
      });

    }
    else {
      it(`validate(${emailToTest}) to return false`, function() {
        assert.isFalse(Email.validate(emailToTest));
        assert.instanceOf(email, Error);
      });
    }
  });
}