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

function Email(verified = false) {
  try {
    if (!new.target) return new Email();
    return Object.defineProperties(this, {
      email: {
        value: null,
        configurable: true
      },
      verified: {
        value: verified,
        configurable: true
      },
      set: {
        value: (string) => {
          try {
            if (!validateEmailAddress(string)) {
              throw new Error('email value is invalid.');
            }
            else if (string === this.email) {
              return this.email;
            }
            else {
              Object.defineProperty(this, 'email', {
                value: string,
                configurable: true
              });
              Object.defineProperty(this, 'verified', {
                value: false,
                configurable: true
              });
              return this.email;
            }

          } catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      get: {
        value: () => {
          if (this.email) return this.email;
          else return null;
        },
        enumerable: true
      },
      validate: {
        value: validateEmailAddress,
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
      },
      isVerified: {
        value: () => {
          try {
            if (typeof this.verified === 'boolean') return this.verified;
            else return null;
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

export default Email;