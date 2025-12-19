import createMock from '../src/apollos/apollo-server-env-mock';

const apolloServerEnv = require.requireActual('apollo-server-env');

module.exports = createMock(apolloServerEnv);
