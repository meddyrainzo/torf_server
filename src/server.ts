import express from 'express';
import { serverConfig } from './configs';

const { port } = serverConfig;

const app = express();

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
