import express, { Request, Response } from 'express';

import { Ticket } from '../models/ticket';

// To be able to use this file as a barrel file for the routes directory
export * from './new';
export * from './show';
export * from './update';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
	const tickets = await Ticket.find({});
	res.send(tickets);
});

export { router as indexTicketRouter };
