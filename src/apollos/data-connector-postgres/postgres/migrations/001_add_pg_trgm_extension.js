async function up({ context: queryInterface }) {
  await queryInterface.sequelize.query(
    'CREATE EXTENSION IF NOT EXISTS "pg_trgm";'
  );
}

async function down() {
  // no
}

const name = '001-add-pg_trgm-extension';

export default { up, down, name, order: 0 };
