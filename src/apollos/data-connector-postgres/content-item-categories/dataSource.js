import { PostgresDataSource } from '../postgres/index.js';

export default class ContentChannel extends PostgresDataSource {
  modelName = 'contentItemCategory';
}
