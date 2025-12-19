import { renameColumns, revertColumnNames } from '../../utils/renameColumns.js';

const fields = [
  'requestPersonId',
  'followedPersonId',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
];

async function up({ context: queryInterface }) {
  await queryInterface.renameTable('follows', 'follow');

  await renameColumns({
    tableName: 'follow',
    fields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.renameTable('follow', 'follows');

  await revertColumnNames({
    tableName: 'follows',
    fields,
    queryInterface,
  });
}

const name = '002-rename-follow-fields';

export default { up, down, name, order: 4 };
