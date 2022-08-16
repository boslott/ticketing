import request from 'supertest';

import { app } from '../../app';

/*
	More granular tests can be made, but we are keeping it simplier and quicker for learning
	purposes and not doing as many tests or as specific of tests
*/

it('returns a 201 on successful signup', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			firstName: 'testFirst',
			lastName: 'testLast',
			email: 'test@test.test',
			password: 'password',
		})
		.expect(201);
});

it('returns a 400 with an invalid email', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			firstName: 'testFirst',
			lastName: 'testLast',
			email: 'invalidemail',
			password: 'password',
		})
		.expect(400);
});

it('returns a 400 with an invalid password', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			firstName: 'testFirst',
			lastName: 'testLast',
			email: 'test@test.test',
			password: 'notok',
		})
		.expect(400);
});

// To handle more than one request within a test
it('returns a 400 with missing email and password', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			firstName: 'testFirst',
			lastName: 'testLast',
			email: '',
			password: 'password',
		})
		.expect(400);
	return request(app)
		.post('/api/users/signup')
		.send({
			firstName: 'testFirst',
			lastName: 'testLast',
			email: 'test@test.test',
			password: '',
		})
		.expect(400);
});

it('dissallows duplicate emails', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			firstName: 'testFirst',
			lastName: 'testLast',
			email: 'test@test.test',
			password: 'password',
		})
		.expect(201);

	await request(app)
		.post('/api/users/signup')
		.send({
			firstName: 'testFirst',
			lastName: 'testLast',
			email: 'test@test.test',
			password: 'password',
		})
		.expect(400);
});

it('sets a cookie after successful signup', async () => {
	// 1. Make a successful signup request
	const response = await request(app)
		.post('/api/users/signup')
		.send({
			firstName: 'testFirst',
			lastName: 'testLast',
			email: 'test@test.test',
			password: 'password',
		})
		.expect(201);

	// 2. Inspect the response that comes back
	expect(response.get('Set-Cookie')).toBeDefined();
});
