import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { serverConfig } from './configs';
import { IdentityResolver } from './resolvers/IdentityResolver';
import { createConnection } from 'typeorm';
import { QuestionResolver } from './resolvers/QuestionResolvers';

const { port } = serverConfig;

const app = express();

(async () => {
  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [IdentityResolver, QuestionResolver],
    }),
    context: ({ req, res }) => ({ request: req, response: res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
  });
})().catch((err) => console.log(err));
