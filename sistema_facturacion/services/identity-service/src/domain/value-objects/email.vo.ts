/**
 * Email Value Object - Dominio
 * 
 * Encapsula la lógica de validación de emails
 * Es inmutable (no se puede cambiar después de crear)
 */
export class Email {
    private readonly _value: string;

    constructor(value: string) {
        this.validate(value);
        this._value = value.toLowerCase().trim();
    }

    get value(): string {
        return this._value;
    }

    /**
     * Validación de email
     */
    private validate(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
            throw new Error(`Invalid email format: ${email}`);
        }

        if (email.length > 255) {
            throw new Error('Email is too long');
        }
    }

    /**
     * Dos emails son iguales si tienen el mismo valor
     */
    equals(other: Email): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}
