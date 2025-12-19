import CreateUserLikes001 from './001_create_user_likes.js';
import UpdateUserLikesNodeIdToUuid002 from './002_update_user_likes_node_id_to_uuid.js';
import RenameUserLikeFields003 from './003_rename_user_like_fields.js';

const migrations = [
  CreateUserLikes001,
  UpdateUserLikesNodeIdToUuid002,
  RenameUserLikeFields003,
];

export default migrations;
