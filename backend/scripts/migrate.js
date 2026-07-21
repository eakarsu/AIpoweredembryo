'use strict';

const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');

async function migrate() {
  await sequelize.authenticate();
  // The reviewed migrations extend Sequelize's base schema and enum types.
  // Establish that non-destructively before applying the additive SQL.
  await sequelize.sync();
  await sequelize.query(
    'CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())'
  );
  const directory = path.join(__dirname, '../migrations');
  const migrations = fs.readdirSync(directory).filter((name) => name.endsWith('.sql')).sort();
  for (const name of migrations) {
    const [rows] = await sequelize.query(
      'SELECT 1 FROM schema_migrations WHERE name = :name',
      { replacements: { name } }
    );
    if (rows.length) continue;
    const transaction = await sequelize.transaction();
    try {
      const sql = fs.readFileSync(path.join(directory, name), 'utf8')
        .trim()
        .replace(/^BEGIN;\s*/, '')
        .replace(/\s*COMMIT;$/, '');
      await sequelize.query(sql, { transaction });
      await sequelize.query(
        'INSERT INTO schema_migrations(name) VALUES (:name)',
        { replacements: { name }, transaction }
      );
      await transaction.commit();
      console.log(`applied ${name}`);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  await sequelize.close();
}

migrate().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
