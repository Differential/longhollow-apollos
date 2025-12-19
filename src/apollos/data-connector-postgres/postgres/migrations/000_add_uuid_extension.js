async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
  );
}

async function down() {
  // no
}

const name = '000-add-uuid-extension';

export default { up, down, name, order: 0 };
