import { isSchema, printSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

// Ensure runtime config (config.yml/env expansion) is loaded during schema publish.
import '../src/config.js';

import ApollosConfig from '../src/apollos/config/index.js';

const dataObj = ApollosConfig?.DATABASE?.URL
  ? await import('../src/data/index.postgres.js')
  : await import('../src/data/index.js');

// Use the runtime data output for schema publishing.
const { schema, resolvers } = dataObj;

const executableSchema = isSchema(schema)
  ? schema
  : makeExecutableSchema({ typeDefs: schema, resolvers });

process.stdout.write(printSchema(executableSchema));
