"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validator_1 = __importDefault(require("validator"));
const { isEmail } = validator_1.default;
function validateEmailAddress(email) {
    try {
        if (email === null)
            return false;
        return isEmail(email);
    }
    catch (error) {
        return false;
    }
}
const TwilioAccount = {
    accountSid: (_a = process.env.TWILIO_ACCOUNT_SID) !== null && _a !== void 0 ? _a : '',
    authToken: (_b = process.env.TWILIO_AUTH_TOKEN) !== null && _b !== void 0 ? _b : '',
    serviceSid: (_c = process.env.TWILIO_SERVICE_SID) !== null && _c !== void 0 ? _c : '',
};
;
// const {
//   TWILIO_ACCOUNT_SID: accountSid,
//   TWILIO_AUTH_TOKEN: authToken,
//   TWILIO_SERVICE_SID: serviceSid
// } = process.env;
const twilio_1 = __importDefault(require("twilio"));
const client = (0, twilio_1.default)(TwilioAccount.accountSid, TwilioAccount.authToken);
function Email(email) {
    try {
        if (!new.target)
            throw new Error('Email must be called with the new keyword');
        const emailAddress = Symbol('Email');
        const verified = Symbol('Verified');
        if (!validateEmailAddress(email))
            throw new Error('email value is invalid');
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
                value: function setEmail(string) {
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
                    }
                    catch (error) {
                        throw error;
                    }
                },
                enumerable: true
            },
            get: {
                value: function getEmail() {
                    return this[emailAddress];
                },
                enumerable: true
            },
            verification: {
                value: Object.defineProperties({}, {
                    sendCode: {
                        value: () => __awaiter(this, void 0, void 0, function* () {
                            try {
                                if (this[verified])
                                    throw new Error('email is already verified');
                                const verification = yield client.verify.services(TwilioAccount.serviceSid)
                                    .verifications
                                    .create({ to: this[emailAddress], channel: 'email' });
                                return verification;
                            }
                            catch (error) {
                                throw error;
                            }
                        }),
                        enumerable: true
                    },
                    confirmCode: {
                        value: function confirmVerificationCode(code) {
                            return __awaiter(this, void 0, void 0, function* () {
                                try {
                                    const verification = yield client.verify.services(TwilioAccount.serviceSid)
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
                            });
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
user.email.verification.sendCode().then(function (response) {
    console.log(response);
})
    .catch(function (error) {
    console.log(error);
});
exports.default = Email;
