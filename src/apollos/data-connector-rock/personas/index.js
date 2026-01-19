import RockApolloDataSource from '../../rock-apollo-data-source/index.js';

class Persona extends RockApolloDataSource {
  getPersonas = async ({ categoryId }) => {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;

    // Get current user
    const { id } = await Auth.getCurrentPerson();

    // Get the entity type ID of the Person model
    const personEntityTypeId = await RockConstants.modelType('Person');

    // Rely on custom code without the plugin.
    // Use plugin, if the user has set USE_PLUGIN to true.
    // In general, you should ALWAYS use the plugin if possible.
    const endpoint =  'DataViews/GetPersistedDataViewsForEntity';

    // Return a list of all dataviews by GUID a user is a memeber
    return this.request(endpoint)
      .find(`${personEntityTypeId.id}/${id}?categoryId=${categoryId}`)
      .select('Guid')
      .get();
  };
}

export { Persona as dataSource };
export default { dataSource: Persona };
