export class NotLoggedError extends Error {
	constructor(message: string = 'No user logged in.') {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, NotLoggedError.prototype);
  }
}
