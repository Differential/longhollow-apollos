import CreateMedia001 from './001_create_media.js';
import UpdateMediaPrimaryKeys002 from './002_update_media_primary_keys.js';
import AddIdToMedia003 from './003_add_id_to_media.js';
import AddMetadataColumn004 from './004_add_metadata_column.js';
import ChangeUrlToText005 from './005_change_url_to_text.js';
import RenameMediaFields005 from './005_rename_media_fields.js';

const migrations = [
  CreateMedia001,
  UpdateMediaPrimaryKeys002,
  AddIdToMedia003,
  AddMetadataColumn004,
  ChangeUrlToText005,
  RenameMediaFields005,
];

export default migrations;
