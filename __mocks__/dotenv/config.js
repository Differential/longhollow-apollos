import util from 'util';
const logOutput = (...args) => process.stdout.write(`${util.format(...args)}\n`);


// logOutput('Disable reading from `env` file in test env.');
