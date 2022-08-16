import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@boslott/common';

const router = express.Router();

// Validation is used as a middleware, the steps of which are listed in the array parameter
router.post('/api/users/signup', [
	body('email')
		.isEmail()
		.withMessage('Email must be valid'),
	body('password')
		.trim()
		.isLength({ min: 6, max: 12 })
		.withMessage('Password must be between 6 and 12 characters')
],
	validateRequest,
	async (req: Request, res: Response) => {
		console.log('/api/users/signup endpoint has been hit');
		console.log('signup req.body: ', req.body);

		const { firstName, lastName, email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			throw new BadRequestError('Email is already in use');
		}

		const user = User.build({ firstName, lastName, email, password });
		await user.save();

		console.log('A new user was just created: ', user);

		// After we have saved the user, we now want to create the json web  token and save it 
		// to the cookie-session session object
		// 1. Generate JWT
		const userJwt = jwt.sign({
			id: user.id,
			email: user.email,
		}, process.env.JWT_KEY!);

		// 2. Store it on the session object
		req.session = {
			jwt: userJwt
		};

		res.status(201).send(user);
	});

export { router as signupRouter };
