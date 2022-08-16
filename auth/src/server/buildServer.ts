import { createServer } from '@graphql-yoga/node';
import express from 'express';
import { json } from 'body-parser';
import { PrismaClient } from '@prisma/client';

import typeDefs from './typeDefs';
import Query from './resolvers/Queries';
import Mutation from './resolvers/Mutations';


export default function buildServer(gqlPath: string) {
	const app = express();
	app.use(json());
	// const prisma = new PrismaClient();

	const graphQLServer = createServer({
		schema: {
			typeDefs,
			resolvers: {
				Query,
				Mutation,
			},
		},
		logging: true,
		context: req => {
			return {
				...req,
				// prisma,
			};
		}
	});

	app.use(gqlPath, graphQLServer);
	console.log(`Auth Server now running at endpoint ${gqlPath}`);

	return app
};


