import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@boslott/common';

import { Ticket } from '../models/ticket';

const router = express.Router();

router.put(
	'/api/tickets/:id',
	requireAuth,
	[
		body('title')
			.not()
			.isEmpty()
			.withMessage('Title is required'),
		body('price')
			.isFloat({ gt: 0 })
			.withMessage('Price must be greater than zero'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const ticket = await Ticket.findById(req.params.id);

		if (!ticket) throw new NotFoundError();

		if (ticket.userId !== req.currentUser!.id) throw new NotAuthorizedError();

		ticket.set({
			title: req.body.title,
			price: req.body.price,
		});
		await ticket.save();

		// We send back anything for now so the request will resolve and the tests will resolve
		res.send(ticket);
	}
);

export { router as updateTicketRouter };
