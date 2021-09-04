import validator from 'https://esm.sh/validator';
const { isEmail } = validator;

class Email {
  #email;

  constructor(Email) {
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
}

export default Email;