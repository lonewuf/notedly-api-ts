import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import models from './models';
import db from './db';
import { UserResolver } from './resolvers/user';
import { HelloResolver } from './resolvers/hello';
import { getUser } from './utils/getUser';
import { NoteResolver } from './resolvers/notes';

const main = async () => {
	const app = express();
	db.connect('mongodb://127.0.0.1:27017/notedly-dev');
	app.get('/test', (_, res) => {
		res.send('hello world');
	});

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, UserResolver, NoteResolver],
			validate: false,
		}),
		context: async ({ req }) => {
			const token = req.headers.authorization;
			const user = getUser(token || '');
			return { models, user };
		},
	});

	apolloServer.applyMiddleware({
		app,
		path: '/api',
	});

	const PORT = process.env.PORT || 8000;
	const HOST = (process.env.HOST as string) || '0.0.0.0';
	app.listen(PORT as number, HOST, () =>
		console.log(`Server is listening on port ${PORT}`)
	);
};

main().catch((err) => console.log(err));
