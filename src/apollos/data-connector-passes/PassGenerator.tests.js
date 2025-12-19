import ApollosConfig from '../config/index.js';
import Pass from './PassGenerator.js';

describe('PassGenerator', () => {
  it('creates a valid Certificates object', async () => {
    const pass = new Pass({
      model: ApollosConfig.PASS.TEMPLATES.EXAMPLE,
    });

    expect(pass.Certificates).toMatchSnapshot();
  });
});
