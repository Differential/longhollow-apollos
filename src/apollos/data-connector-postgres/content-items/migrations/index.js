import CreateContentItems001 from './001_create_content_items.js';
import AddCoverImage002 from './002_add_cover_image.js';
import AddParent003 from './003_add_parent.js';
import UpdateContentItemForeignKeys from './004_update_content_item_foreign_keys.js';
import RenameContentItemTable from './005_rename_content_item_table.js';
import AddExpireAt from './006_add_expire_at.js';

const migrations = [
  CreateContentItems001,
  AddCoverImage002,
  AddParent003,
  UpdateContentItemForeignKeys,
  RenameContentItemTable,
  AddExpireAt,
];

export default migrations;
