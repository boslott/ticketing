import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('has a route handler listening to /api/tickets for post requests', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.send({});

	expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
	await request(app)
		.post('/api/tickets')
		.send({})
		.expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
	const signupResponse = global.signin();

	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', signupResponse)
		.send({});

	expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: '',
			price: 10,
		})
		.expect(400);

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			price: 10,
		})
		.expect(400);
});

it('returns an error if an invalid price is provided', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'This is a valid title',
			price: -10,
		})
		.expect(400);

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'This is a valid title',
		})
		.expect(400);
});

it('creates a ticket when valid inputs are provided', async () => {
	// First, look into the Ticket collection and see how many in total there are
	let tickets = await Ticket.find({});
	expect(tickets.length).toEqual(0);

	const title = 'This is a valid title';
	const price = 10;

	// Next create a new ticket
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title,
			price,
		})
		.expect(201);

	// Lastly, look back into the Ticket collection and see if there is an additional entry
	tickets = await Ticket.find({});
	expect(tickets.length).toEqual(1);
	expect(tickets[0].title).toEqual(title);
	expect(tickets[0].price).toEqual(price);
});
