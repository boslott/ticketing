import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';

declare global {
	var signup: () => Promise<string[]>;
}

let mongo: any;

// Hook function that will run before all of our tests start executing
beforeAll(async () => {
	process.env.JWT_KEY = 'whatEverString';

	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri);
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

global.signup = async () => {
	const firstName = 'testFirst';
	const lastName = 'testLast';
	const email = 'test@test.test';
	const password = 'password';

	const response = await request(app)
		.post('/api/users/signup')
		.send({
			firstName,
			lastName,
			email,
			password,
		})
		.expect(201);

	const cookie = response.get('Set-Cookie');

	return cookie;
};
