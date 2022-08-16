/*
	This middle's job is to extract the payload from the jwt and set it to a given property
	ONLY IF a user is logged in
*/

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
	id: string;
	email: string;
}

// Add-in (Augment) typescript's definition of what a Request object is
// This enables to add the optional currentUser property
// And if the property is defined, it will be of type UserPayload
// This is how to 'reach into' an existing type definition and make a modification to it
declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload;
		}
	}
}

export const currentUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {

	// The '?' is typescript - our '?' statement is the same as:
	// if(!req.session || !req.session.jwt)
	if (!req.session?.jwt) {
		// If there is not a session object or if there is not a jwt on the session object, we
		// want to just return, so we will call the next function
		return next();
	}

	// Now decode the jwt
	// If there is anything wrong with the jwt, we want to capturn the error and send back
	// or continue on saying the 'user is not logged in'
	try {
		// Typescript thinks that JWT_KEY might be undefined, but we have already put a check
		// in the initial 'start' method so the bang (!) at the end tells typescript it is defined
		const payload = jwt.verify(
			req.session.jwt,
			process.env.JWT_KEY!
		) as UserPayload;
		req.currentUser = payload;
		next();
	} catch (err) {
		// TODO throw the appropriate error
		console.log('The current user midleware caught an error: ', err);
	}
};
