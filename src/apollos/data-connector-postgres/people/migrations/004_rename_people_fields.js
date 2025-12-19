import { renameColumns, revertColumnNames } from '../../utils/renameColumns.js';

const fields = [
  'firstName',
  'lastName',
  'birthDate',
  'profileImageUrl',
  'campusId',
  'apollosUser',
  'originId',
  'originType',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
];

async function up({ context: queryInterface }) {
  await renameColumns({
    tableName: 'people',
    fields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await revertColumnNames({
    tableName: 'people',
    fields,
    queryInterface,
  });
}

const name = '004-rename-people-fields';

export default { up, down, name, order: 5 };
