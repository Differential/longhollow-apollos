import CreateTags001 from './001_create_tags.js';
import CreateJunctionTables002 from './002_create_tag_junction_tables.js';
import CreateTagsUniqueIndex003 from './003_create_tags_unique_index.js';
import UpdateTagForeignKeyConstraints004 from './004_update_tag_foreign_key_constraint.js';
import RenameTagFields005 from './005_rename_tag_fields.js';

const migrations = [
  CreateTags001,
  CreateJunctionTables002,
  CreateTagsUniqueIndex003,
  RenameTagFields005,
  UpdateTagForeignKeyConstraints004,
];

export default migrations;
