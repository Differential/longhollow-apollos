import { renameColumns, revertColumnNames } from '../../utils/renameColumns.js';

const fields = [
  'nodeId',
  'nodeType',
  'originId',
  'originType',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
];

async function up({ context: queryInterface }) {
  await renameColumns({
    tableName: 'media',
    fields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await revertColumnNames({
    tableName: 'media',
    fields,
    queryInterface,
  });
}

const name = '005-rename-media-fields';

export default { up, down, name, order: 8 };
