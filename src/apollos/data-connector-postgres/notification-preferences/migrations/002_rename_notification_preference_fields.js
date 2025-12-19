import { renameColumns, revertColumnNames } from '../../utils/renameColumns.js';

const fields = [
  'notificationProviderId',
  'notificationProviderType',
  'personId',
  'apollosId',
  'apollosType',
  'createdAt',
  'updatedAt',
];

async function up({ context: queryInterface }) {
  await queryInterface.renameTable(
    'notificationPreferences',
    'notification_preference'
  );

  await renameColumns({
    tableName: 'notification_preference',
    fields,
    queryInterface,
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.renameTable(
    'notification_preference',
    'notificationPreferences'
  );

  await revertColumnNames({
    tableName: 'notificationPreferences',
    fields,
    queryInterface,
  });
}

const name = '002-rename-notification-preference-fields';

export default { up, down, name, order: 4 };
