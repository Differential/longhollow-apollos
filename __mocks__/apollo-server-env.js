import { jest } from '@jest/globals';
import createMock from '#apollos/apollo-server-env-mock/index.js';

const apolloServerEnv = jest.requireActual('apollo-server-env');

export default createMock(apolloServerEnv);
