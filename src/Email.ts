import dotenv from 'dotenv';
dotenv.config();

import validator from 'validator';
const { isEmail } = validator;



function validateEmailAddress(email: string | null): boolean {
  try {
    if (email === null) return false;
    return isEmail(email);
  }
  catch (error) {
    return false;
  }
}

interface TwilioAccount {
  accountSid: string,
  authToken: string,
  serviceSid: string,
}

const TwilioAccount:TwilioAccount = {
  accountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
  authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
  serviceSid: process.env.TWILIO_SERVICE_SID ?? '',
}

interface EmailInterface {
  set(email:string):string,
  get():string,
  verification: {
    sendCode():Promise<VerificationInstance>,
    confirmCode(code:string):Promise<VerificationCheckInstance>
  }
};

interface emailProperty {
  email: string,
}

// const {
//   TWILIO_ACCOUNT_SID: accountSid,
//   TWILIO_AUTH_TOKEN: authToken,
//   TWILIO_SERVICE_SID: serviceSid
// } = process.env;



import twilio from 'twilio';
import { VerificationCheckInstance } from 'twilio/lib/rest/verify/v2/service/verificationCheck';
import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';
const client: twilio.Twilio = twilio(TwilioAccount.accountSid, TwilioAccount.authToken);


function Email(this: object, email: string ):EmailInterface {
  try {

    if (!new.target) throw new Error('Email must be called with the new keyword');

    const emailAddress = Symbol('Email');
    const verified = Symbol('Verified');

    if (!validateEmailAddress(email)) throw new Error('email value is invalid');


     return Object.defineProperties(this, {
      [emailAddress]: {
        value: email,
        configurable: true,
      },
      [verified]: {
        value: false,
        configurable: true
      },
      set: {
        value: function setEmail(string: string): string {
          try {
            string = string.trim().toLowerCase();
            if (!validateEmailAddress(string)) {
              throw new Error('email value is invalid.');
            }
            else if (string === this[emailAddress]) {
              return this[emailAddress];
            }
            else {
              Object.defineProperty(this, emailAddress, {
                value: string,
                configurable: true
              });
              return this[emailAddress];
            }

          } catch (error) {
            throw error;
          }
        },
        enumerable: true
      },
      get: {
        value: function getEmail(): string {
          return this[emailAddress];
        },
        enumerable: true
      },
      verification: {
        value: Object.defineProperties({}, {
          sendCode: {
            value: async ():Promise<VerificationInstance> => {
              try {

                if (this[verified]) throw new Error('email is already verified');
                const verification = await client.verify.services(TwilioAccount.serviceSid)
                  .verifications
                  .create({ to: this[emailAddress], channel: 'email' });

                return verification;

              }
              catch (error) {
                throw error;
              }
            },
            enumerable: true
          },
          confirmCode: {
            value: async function confirmVerificationCode(code:string):Promise<VerificationCheckInstance> {
              try {
                const verification = await client.verify.services(TwilioAccount.serviceSid)
                  .verificationChecks
                  .create({ to: this[emailAddress], code });

                  if (verification.status === 'approved') {
                    Object.defineProperty(this, verified, {
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
    });

  }
  catch (error) {
    throw error;
  }
}

Object.defineProperty(Email, 'validate', {
  value: validateEmailAddress,
  enumerable: true
});

const user = {
  email: new Email('yousif@almudhaf.com')
};

console.log(user);
console.log(user.email.get());

user.email.verification.sendCode().then(function(response) {
  console.log(response);
})
.catch(function(error) {
  console.log(error);
});




export default Email;