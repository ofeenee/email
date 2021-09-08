import isEmail from 'validator/lib/isEmail.js';

class Email {
  #email;

  constructor() {
    try {

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
}

export default Email;