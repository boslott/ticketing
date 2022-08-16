/*
	This middleware is always run after the currentUser middleware, so we have already checked to see
	if there is a session object and put a currentUser property on it if a user is logged in

	This middleware will first check if there is a currentUser property or not.
	If NO -> return a 401 FORBIDDEN error
*/

import { Request, Response, NextFunction } from 'express';

import { NotAuthorizedError } from '../errors';

export const requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.currentUser) {
		// Instead of returning the hard-coded response below,
		// we created the NotAuthorized customError below to throw
		// res.status(401).send('Not authorized');

		throw new NotAuthorizedError();
	}

	// DO NOT FORGET THE NEXT() FUNCTION!!!!
	// The middleware will end and not call the next-in-line, so the request will hang ... FOREVER!
	next();
}
