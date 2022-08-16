import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';

// 404 - Not found
// 401 - Forbidden

const testId = new mongoose.Types.ObjectId().toHexString();
const testTitle = 'Valid title';
const testPrice = 10;

it('returns a 404 if the provided id does not exist', async () => {

	const res = await request(app)
		.put(`/api/tickets/${testId}`)
		.set('Cookie', global.signin())
		.send({
			title: testTitle,
			price: testPrice,
		})
		.expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {

	await request(app)
		.put(`/api/tickets/${testId}`)
		.send({
			testTitle,
			testPrice,
		})
		.expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {

	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: testTitle,
			price: testPrice,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'New random string with some new price',
			price: 1000,
		})
		.expect(401);

});

it('returns a 400 if the user provides an invalid title or price', async () => {
	// Save instance of the cookie so we can reference the user that was "signed in" during the creation of the ticket
	const cookie = global.signin();
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: testTitle,
			price: testPrice,
		});

	// Invalid title
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: 20,
		})
		.expect(400);

	// title does not exist
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			price: 20,
		})
		.expect(400);

	// Invalid price
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'Valid title',
			price: -20,
		})
		.expect(400);

	// price does not exist
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'Valid title',
		})
		.expect(400);

});

it('updates the ticket if the provided inputs are valid', async () => {
	// Our "happy" path
	const cookie = global.signin();
	const updatedTitle = 'New title and new price';
	const updatedPrice = 9999;
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title: testTitle,
			price: testPrice,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: updatedTitle,
			price: updatedPrice,
		})
		.expect(200);

	// Fetch the ticket and make an assertion to ensure it was actually updated
	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send();

	expect(ticketResponse.body.title).toEqual(updatedTitle);
	expect(ticketResponse.body.price).toEqual(updatedPrice);
});

