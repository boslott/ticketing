export abstract class CustomError extends Error {
	// List out all of the different properties that must be defined by any class that extends this
	// Very similar to how an Interface works
	abstract statusCode: number;

	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, CustomError.prototype);
	}

	// Must return an array of objects with each object having a message string and an optional field string
	abstract serializeErrors(): { message: string; field?: string }[]
}
