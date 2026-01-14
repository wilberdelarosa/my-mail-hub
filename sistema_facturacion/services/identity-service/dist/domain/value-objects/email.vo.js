"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    _value;
    constructor(value) {
        this.validate(value);
        this._value = value.toLowerCase().trim();
    }
    get value() {
        return this._value;
    }
    validate(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            throw new Error(`Invalid email format: ${email}`);
        }
        if (email.length > 255) {
            throw new Error('Email is too long');
        }
    }
    equals(other) {
        return this._value === other._value;
    }
    toString() {
        return this._value;
    }
}
exports.Email = Email;
//# sourceMappingURL=email.vo.js.map