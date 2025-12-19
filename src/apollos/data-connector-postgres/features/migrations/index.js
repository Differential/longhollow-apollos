import CreateFeatures001 from './001_create_features.js';
import UniqueIndexForFeatures002 from './002_unique_index_for_features.js';
import RenameFeatureFields003 from './003_rename_feature_fields.js';
import AddFeaturePriorityField004 from './004_add_feature_priority_field.js';
import UpdateFeaturesUniqueIndex005 from './005_update_features_unique_index.js';

const migrations = [
  CreateFeatures001,
  UniqueIndexForFeatures002,
  RenameFeatureFields003,
  AddFeaturePriorityField004,
  UpdateFeaturesUniqueIndex005,
];

export default migrations;
