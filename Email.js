import validator from 'validator';
const {isEmail} = validator;

function validateEmailAddress(string) {
  try {
    if (typeof string !== 'string' || !string) throw new Error('value is invalid.');
    else return isEmail(string);
  }
  catch (error) {

  }
}

import dotenv from 'dotenv';
dotenv.config();

const {
  TWILIO_ACCOUNT_SID: accountSid,
  TWILIO_AUTH_TOKEN: authToken,
  TWILIO_SERVICE_SID: serviceSid
} = process.env;

import twilio from 'twilio';
const client = twilio(accountSid, authToken);

function Email(object = {}) {
  try {
    if (!new.target) return new Email(verified);
    return Object.defineProperties(this, {
      set: {
        value: function setEmailAddress(string) {
          try {
            if (!validateEmailAddress(string)) {
              throw new Error('email value is invalid.');
            }
            else if (string === object?.email) {
              return object?.email;
            }
            else {
              object.email = string;
              return object.email;
            }

          } catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      get: {
        value: function getEmailAddress() {
          try {
            if (object.email) return object.email;
            else return null;
          }
          catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      verification: {
        value: Object.defineProperties({}, {
          sendCode: {
            value: async () => {
              try {
                if (!this.email) throw new Error('email is not yet set.');

                const verification = await client.verify.services(serviceSid)
                  .verifications
                  .create({ to: this.email, channel: 'email' });

                return verification;

              }
              catch (error) {
                throw error;
              }
            },
            enumerable: true
          },
          confirmCode: {
            value: async (code) => {
              try {
                if (!code) throw new Error('value is invalid.');

                const verification = await client.verify.services(serviceSid)
                  .verificationChecks
                  .create({ to: this.email, code });

                const { valid } = verification;
                if (valid) {
                  Object.defineProperty(this, 'verified', {
                    value: true,
                    configurable: true
                  });
                }
                return verification;

              }
              catch (error) {
                throw error;
              }
            },
            enumerable: true
          }
        }),
        enumerable: true
      }
    });
  }
  catch (error) {
    throw error;
  }
}


export default Email;