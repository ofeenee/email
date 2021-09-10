import validator from 'validator';
const {isEmail} = validator;

import dotenv from 'dotenv';
dotenv.config();

const {
  TWILIO_ACCOUNT_SID: accountSid,
  TWILIO_AUTH_TOKEN: authToken,
  TWILIO_SERVICE_SID: serviceSid
} = process.env;

import twilio from 'twilio';
const client = twilio(accountSid, authToken);



class Email {
  #email;
  #verified = false;

  constructor() {
    try {
      this.#email = null;
    }
    catch (error) {
      throw error;
    }
  }

  set(email) {
    try {
      if (!isEmail(email)) {
        throw new Error('email value is invalid.');
      }
      else if (email === this.#email) {
        return this.#email;
      }
      else {
        this.#email = email;
        return this.#email;
      }
    }
    catch (error) {
      throw error;
    }
  }

  get() {
    if (this.#email) return this.#email;
    else return null;
  }

  static validate(email) {
    try {
      if (!email || typeof email !== 'string' || !isEmail(email)) {
        return false;
      }
      else {
        return true;
      }
    }
    catch (error) {
      throw error;
    }
  }

  async sendEmailVerification() {
    try {
      const verification = await client.verify.services(serviceSid)
        .verifications
        .create({ from: 'yousif@almudhaf.com', to: this.#email, channel: 'email' })

      return verification;

    }
    catch (error) {
      console.log(error.message);
    }
  }
  async confirmEmailVerification(code) {
    try {
      const verification = await client.verify.services(serviceSid)
        .verificationChecks
        .create({ to: this.#email, code });

      const {valid, status} = verification;
      if (valid) this.#verified = true;
      return verification;

    }
    catch (error) {
      console.log(error.message);
    }
  }

  isVerified() {
    return this.#verified;
  }
}

export default Email;