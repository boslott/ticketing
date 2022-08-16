import express, { Request, Response } from 'express';
import { NotFoundError } from '@boslott/common';

import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
	// req.params.id is the :id variable sent in the route
	const ticket = await Ticket.findById(req.params.id);

	if (!ticket) {
		throw new NotFoundError();
	}

	// The status code will default to 200 which is what we already want in this situation
	res.send(ticket);
});

export { router as showTicketRouter };
