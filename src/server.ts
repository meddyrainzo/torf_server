import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { serverConfig } from './configs';
import { IdentityResolver } from './Resolvers/IdentityResolver';

const { port } = serverConfig;

const app = express();

(async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [IdentityResolver],
    }),
  });

  apolloServer.applyMiddleware({ app });
  app.listen(port, () => {
    console.log(`Server running on: http://localhost:${port}`);
  });
})().catch((err) => console.log(err));
