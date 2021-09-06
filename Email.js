import isEmail from 'validator/lib/isEmail.js';

class Email {
  #email;

  constructor(email) {
    try {
      if (isEmail(email)) {
        return this.#email = email;
      }
      else {
        throw new Error('Email value is invalid.');
      }
    }
    catch (error) {
      return error;
    }
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

  update(email) {
    try {
      if (isEmail(email) && email !== this.#email) {
        this.#email = email;
      }
      else if (email === this.#email) {
        return;
      }
      else {
        throw new Error('email value is invalid.');
      }
    }
    catch (error) {
      throw error;

    }
  }

  get() {
    return this.#email;
  }
}

export default Email;