import AddUUID from './000_add_uuid_extension.js';
import AddPGTRGM from './001_add_pg_trgm_extension.js';

const migrations = [AddUUID, AddPGTRGM];

export default migrations;
