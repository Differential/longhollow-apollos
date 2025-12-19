import CreatePeople001 from './001_create_people.js';
import ChangeProfileImageType002 from './002_change_profile_image_url_to_text.js';
import AddNamesIndex003 from './003_add_names_index.js';
import RenamePeopleFields004 from './004_rename_people_fields.js';

const migrations = [
  CreatePeople001,
  ChangeProfileImageType002,
  AddNamesIndex003,
  RenamePeopleFields004,
];

export default migrations;
