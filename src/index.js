import dotenv from 'dotenv'; // eslint-disable-line

dotenv.config();
// import './apollos/data-connector-postgres/postgres/pgEnum-fix.js';
import './config.js';
import server from './server.js';
import util from 'util';
const logOutput = (...args) => process.stdout.write(`${util.format(...args)}\n`);
const logError = (...args) => process.stderr.write(`${util.format(...args)}\n`);




export { testSchema } from './server.js'; // eslint-disable-line import/prefer-default-export

// Use the port, if provided.
const { PORT } = process.env;
if (!PORT && process.env.NODE_ENV !== 'test')
  logError(
    'Add `PORT=XXXX` if you are having trouble connecting to the server. By default, PORT is 4000.'
  );

server.listen({ port: PORT || 4000 }, () => {
  logOutput(`🚀 Server ready at http://0.0.0.0:${PORT || 4000}`);
});
