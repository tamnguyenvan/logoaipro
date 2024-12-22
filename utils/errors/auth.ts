export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super("Invalid email or password.");
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor() {
    super("User with this email already exists.");
  }
}

export class MissingFieldError extends AuthError {
  constructor(field: string) {
    super(`The field "${field}" is required.`);
  }
}
