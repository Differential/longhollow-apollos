import { isSchema, printSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import ApollosConfig from '../src/apollos/config/index.js';

process.env.APOLLOS_SKIP_CONFIG_AUTODETECT = 'true';
await import('../src/config.js');

const dataObj = ApollosConfig?.DATABASE?.URL
  ? await import('../src/data/index.postgres.js')
  : await import('../src/data/index.js');

const { schema, resolvers } = dataObj;

const executableSchema = isSchema(schema)
  ? schema
  : makeExecutableSchema({ typeDefs: schema, resolvers });

process.stdout.write(printSchema(executableSchema));
