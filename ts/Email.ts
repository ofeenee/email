import validator from 'https://esm.sh/validator';
const {isEmail} = validator;

class Email {
  #email!: string;

  constructor(email: string) {
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

  update(email: string) {
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