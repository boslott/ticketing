import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

it('returns a 404 if the ticket is not found', async () => {
	// The route we are testing is /api/tickets/:id, 
	// We first create a "real" MongoDB id to use
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.get(`/api/tickets/${id}`)
		.send()
		.expect(404);
});

it('returns the ticket if the tickt is found', async () => {
	const title = 'Valid title';
	const price = 20;

	const response = await request(app)
		.post('/api/tickets/')
		.set('Cookie', global.signin())
		.send({
			title,
			price,
		})
		.expect(201);

	// To check to see about the ticket we just created, we look up the ticket using
	// the id of the ticket we just created (found on the body property of the response object)
	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send()
		.expect(200);

	expect(ticketResponse.body.title).toEqual(title);
	expect(ticketResponse.body.price).toEqual(price);
});
