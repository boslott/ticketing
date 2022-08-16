import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@boslott/common';

// const app = buildServer('/api/auth');
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
	cookieSession({
		// The JWT is already encrypted so we do no need to encrypt the cookie as well
		// This allows the micro service to not be dependent on a specific encryption method across languages
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Add the NotFoundError anyway before the errorHandler
app.all('*', async (req, res, next) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
