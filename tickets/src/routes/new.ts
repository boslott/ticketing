import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@boslott/common';

import { Ticket } from '../models/ticket';

const router = express.Router();

// Put the body middleware after the authenticate middleware
// Body middleware will put errors on the error Object that will be checked in the next middleware
// The validateRequest middleware will look at the errors Object and throw an Error if there is one
router.post(
	'/api/tickets',
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
		const { title, price } = req.body;

		// We created the build method so that typescript can help us out
		// Our requireAuth middleware already checks to make sure there is a currentUser
		const ticket = Ticket.build({
			title,
			price,
			userId: req.currentUser!.id,
		});

		console.log('A new ticket was just created: ', ticket);

		await ticket.save(err => {
			if (err) console.error('ticket saving error: ', err);
		});

		res.status(201).send(ticket);
	}
);

export { router as createTicketRouter };
