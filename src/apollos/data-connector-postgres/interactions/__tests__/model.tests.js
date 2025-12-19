import { sequelize } from '../../postgres/index.js';
import * as People from '../../people/index.js';
import * as Campuses from '../../campus/index.js';
import * as Interaction from '../index.js';
import * as ContentItem from '../../content-items/index.js';
import * as Media from '../../media/index.js';
import * as ContentItemCategory from '../../content-item-categories/index.js';
import { setupPostgresTestEnv } from '../../utils/testUtils.js';

describe('Interaction model', () => {
  beforeEach(async () => {
    await setupPostgresTestEnv([
      Interaction,
      People,
      Campuses,
      ContentItem,
      Media,
      ContentItemCategory,
    ]);
  });
  afterEach(async () => {
    await sequelize.drop({ cascade: true });
  });

  it('constructs without issues', async () => {
    let interaction = await sequelize.models.interaction.create({
      action: 'VIEW',
      nodeId: '6f9efa03-e146-45a0-9180-98591f6cdb72',
      nodeType: 'ContentItem',
    });

    const me = await sequelize.models.people.create({
      firstName: 'Vincent',
      lastName: 'Wilson',
      gender: 'MALE',
      originType: 'rock',
      originId: '1',
    });

    await interaction.setPerson(me);

    interaction = await interaction.reload();

    expect(interaction.personId).toBe(me.id);
  });
});
