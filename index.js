import isEmail from 'validator/lib/isEmail.js';

class Email {
  #email;

  constructor(email) {
    try {
      if (isEmail(email)) {
        this.#email = email;
      }
      else {
        throw new Error('Email value is invalid.');
      }
    }
    catch (error) {
      throw error;
    }
  }

  static validate(email) {
    try {
      if (!email || typeof email !== 'string' || !isEmail(email)) {
        throw new Error('Email value is invalid.');
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
        throw new Error('update is not necessary.');
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