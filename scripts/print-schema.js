import { isSchema, printSchema } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

process.env.APOLLOS_SKIP_CONFIG_AUTODETECT = 'true';
await import('../src/config.js');

const { schema, resolvers } = await import('../src/data/index.js');

const executableSchema = isSchema(schema)
  ? schema
  : makeExecutableSchema({ typeDefs: schema, resolvers });

const output = printSchema(executableSchema);
process.stdout.write(`${output}\n`, () => {
  // Ensure the process exits even if imported modules keep handles open.
  process.exit(0);
});
