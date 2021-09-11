import validator from 'validator';
const {isEmail, isBoolean} = validator;

import dotenv from 'dotenv';
dotenv.config();

const {
  TWILIO_ACCOUNT_SID: accountSid,
  TWILIO_AUTH_TOKEN: authToken,
  TWILIO_SERVICE_SID: serviceSid
} = process.env;

import twilio from 'twilio';
const client = twilio(accountSid, authToken);

function Email() {
  try {
    if (!new.target) return new Email();
    let email = null;
    let verified = false;

    return Object.defineProperties(this, {
      validate: {
        value: function validateEmailAddress(string) {
          try {
            if (typeof string !== 'string' || !string) throw new Error('value is invalid.');
            else return isEmail(string);
          }
          catch (error) {

          }
        },
        enumerable: true
      },
      emailAddress: {
        set: function setEmailAddress(string) {
          try {
            if (!isEmail(string)) {
              throw new Error('email value is invalid.');
            }
            else if (string === email) {
              return email;
            }
            else {
              email = string;
              return email;
            }

          } catch (error) {
            throw error;
          }
        },
        get: function retrievePrivateVariableEmail() {
          if (email) return email;
          else return null;
        },
        enumerable: true
      },
      verified: {
        set: function (boolean) {
          try {
            if (typeof boolean !== 'string' || !boolean) throw new Error('value is invalid.')
            if (!isBoolean(boolean)) {
              throw new Error('value is invalid.');
            }
            else if (boolean === verified) {
              return verified;
            }
            else {
              verified = boolean;
              return verified;
            }
          }
          catch (error) {
            throw error;
          }
        },
        get: function () {
          if (typeof verified === 'boolean') return verified;
          else return null;
        },
        enumerable: true
      },
      verify: {
        value: async function sendEmailVerification() {
          try {
            if (!email) throw new Error('email is not yet set.');

            const verification = await client.verify.services(serviceSid)
              .verifications
              .create({ to: email, channel: 'email' });

            return verification;

          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      confirm: {
        value: async function confirmEmailVerification(code) {
          try {
            if (!code) throw new Error('value is invalid.');

            const verification = await client.verify.services(serviceSid)
              .verificationChecks
              .create({ to: email, code });

            const { valid } = verification;
            if (valid) verified = true;
            return verification;

          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      }
    });
  }
  catch (error) {
    throw error;
  }
}
const email = new Email();

console.log(email);
console.log(email.emailAddress);
console.log(email.verified);

export default Email;