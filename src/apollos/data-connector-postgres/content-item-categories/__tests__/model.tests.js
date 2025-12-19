import { sequelize } from '../../postgres/index.js';
import { setupPostgresTestEnv } from '../../utils/testUtils.js';
import * as ContentItem from '../../content-items/index.js';
import * as ContentItemCategory from '../index.js';
import * as Media from '../../media/index.js';

describe('ContentItemCategory model', () => {
  beforeEach(async () => {
    await setupPostgresTestEnv([ContentItem, ContentItemCategory, Media]);
  });
  afterEach(async () => {
    await sequelize.drop({ cascade: true });
  });

  it('constructs without issues', async () => {
    const content = await sequelize.models.contentItem.create({
      title: 'Parent Item',
      originType: 'rock',
      originId: '1',
    });

    const category = await sequelize.models.contentItemCategory.create({
      title: 'Devotionals',
      originType: 'rock',
      originId: '2',
    });

    await content.setContentItemCategory(category);

    expect((await content.getContentItemCategory()).id).toEqual(category.id);
  });
});
