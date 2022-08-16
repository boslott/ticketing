import { CustomError } from './custom-error';

// Extending our custom-made abstract class allows for more errors being shown if things are forgotten or misspelled
export class DatabaseConnectionError extends CustomError {
	statusCode = 500;
	reason = 'Error connecting to the database';

	constructor() {
		super('Error connecting to the database - message is for logging purposes');

		Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
	}

	serializeErrors() {
		return [
			{ message: this.reason }
		];
	}
}
