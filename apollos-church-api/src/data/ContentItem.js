import { ContentItem } from '@apollosproject/data-connector-rock';

const { resolver, schema, dataSource: CoreContentItem } = ContentItem;

class dataSource extends CoreContentItem {
  attributeIsVideo = ({ key }) => key.toLowerCase().includes('vimeo');
}

export { resolver, schema, dataSource };
