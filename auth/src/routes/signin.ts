import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError, validateRequest } from '@boslott/common';
import { User } from '../models';
import { Password } from '../utils';

const router = express.Router();

router.post('/api/users/signin',
	[
		body('email')
			.isEmail()
			.withMessage('Email must be valid'),
		body('password')
			.trim()
			.notEmpty()
			.withMessage('You must supply a password'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		console.log('SignIN route was just hit');
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			// When dealing with validating Auth scenarios, provide as little information as possible as to what went wrong
			// Little information provided due to malicious users trying to gain access
			throw new BadRequestError('Invalid Credentials');
		}

		const passwordsMatch = await Password.compare(existingUser.password, password);
		if (!passwordsMatch) {
			// When dealing with validating Auth scenarios, provide as little information as possible as to what went wrong
			// Little information provided due to malicious users trying to gain access
			throw new BadRequestError('Invalid Credentials');
		}

		// 1. Generate JWT
		const userJwt = jwt.sign({
			id: existingUser.id,
			email: existingUser.email,
		}, process.env.JWT_KEY!);

		// 2. Store it on the session object
		req.session = {
			jwt: userJwt
		};

		res.status(200).send(existingUser);
	}
);

export { router as signinRouter };
