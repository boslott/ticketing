import express from 'express';

import { currentUser } from '@boslott/common';

const router = express.Router();

// We extracted some logic from this and created middlewares
router.get(
	'/api/users/currentuser',
	currentUser,
	(req, res) => {
		console.log('current USER route was just hit');
		console.log('req.currentUser: ', req.currentUser);
		res.send({ currentUser: req.currentUser || null });
	});

export { router as currentUserRouter };
