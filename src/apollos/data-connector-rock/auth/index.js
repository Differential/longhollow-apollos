import lodash from 'lodash';
import { registerToken } from './token.js';
const { get } = lodash;

export { registerToken, generateToken } from './token.js';
export { authSchema as schema } from '../../data-schema/index.js';
export { default as dataSource } from './data-source.js';
export { default as resolver } from './resolver.js';

export const contextMiddleware = ({ req, context: ctx }) => {
  if (get(req, 'headers.authorization')) {
    const { userToken, rockCookie, sessionId } = registerToken(
      req.headers.authorization
    );
    if (sessionId) {
      return {
        ...ctx,
        userToken,
        rockCookie,
        sessionId,
      };
    }
  }
  return ctx;
};
