import validator from 'validator';
const { isEmail } = validator;

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
      console.log(error.message);
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
      console.log(error.message);
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
      console.log(error.message);

    }
  }

  get() {
    return this.#email;
  }
}

export default Email;