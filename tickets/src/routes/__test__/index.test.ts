import request from 'supertest';
import { app } from '../../app';

const createTicket = (index: number) => {
	return request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: `Test title one ${index}`,
			price: index,
		});
};

it('can fetch a list of tickets', async () => {
	await createTicket(1);
	await createTicket(2);
	await createTicket(3);

	const response = await request(app)
		.get('/api/tickets')
		.send()
		.expect(200);

	expect(response.body.length).toEqual(3);
});
