import { createGlobalId, parseGlobalId } from '../src/apollos/server-core/index.js';
import util from 'util';
const logOutput = (...args) => process.stdout.write(`${util.format(...args)}\n`);




const [id] = process.argv.slice(2);
if (!id) {
  logOutput(
    'Pass Rock or Apollos ID: translate.js AuthenticatedUser:8sad98fd89sadf98uasdf'
  );
  process.exit(1);
}

if (id.includes(':')) logOutput(parseGlobalId(id).id);
else logOutput(createGlobalId(id, 'Generic').split(':')[1]);
