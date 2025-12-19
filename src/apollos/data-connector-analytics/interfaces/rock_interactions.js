import BaseAnalytics from './base.js';
import util from 'util';
const logOutput = (...args) => process.stdout.write(`${util.format(...args)}\n`);




export default class RockInteractionAnalytics extends BaseAnalytics {
  eventWhitelist = ['View Content'];

  track({ event, userId, sessionId, properties }) {
    if (!userId) {
      return null;
    }
    switch (event) {
      case 'View Content': {
        return this.trackViewContent({
          itemId: properties.itemId,
          title: properties.title,
          sessionId,
        });
      }
      default:
        logOutput(`${event} not supported by RockInteraction Analytics`);
        return null;
    }
  }

  trackViewContent({ title, itemId, sessionId }) {
    if (!itemId || !sessionId) {
      logOutput('No itemId or sessionId included in `track` call.');
      return null;
    }
    return this.context.dataSources.Interactions.createContentItemInteraction({
      itemId,
      itemTitle: title,
      sessionId,
      operationName: 'View Content',
    });
  }
}
