import RockApolloDataSource from 'apollos/rock-apollo-data-source';

class dataSource extends RockApolloDataSource {
  expanded = true;

  resource = 'AttributeMatrixItems';

  getItemsFromGuid = async (matrixItemGuid) =>
    matrixItemGuid
      ? this.request()
          .filter(`AttributeMatrix/Guid eq guid'${matrixItemGuid}'`)
          .get()
      : [];
}

export { dataSource };
