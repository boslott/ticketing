import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
	console.log('Auth Service starting up ... !');
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY environment variable must be defined');
	}
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI environment variable must be defined');
	}

	// Try to connect to the DB first
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('Auth is connected to the Auth MongoDB');
	}
	// If the connection fails, log the error
	catch (err) {
		console.log('MongoDB connection error: ', err);
	}
	// If the connection succeeds, then listen for incoming traffic
	app.listen(8000, () => {
		console.log('Auth API now listening to http://localhost:8000');
	})
};

start();
