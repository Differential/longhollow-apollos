import util from 'util';
const logOutput = (...args) => process.stdout.write(`${util.format(...args)}\n`);


/* eslint-disable */
/* istanbul ignore next */
export default class BaseAnalytics {
  shouldIdentify = false;

  // override this property if you want `identify` to be called.
  shouldTrack = true; // override this property if `track` shouldn't be called.

  // override this property to only track specific events
  eventWhitelist = null;

  initialize({ context }) {
    this.context = context;
  }

  // called when a user is identified.
  identify({ anonymousId, userId, traits, context }) {
    /* istanbul ignore next */
    logOutput({ anonymousId, userId, traits, context });
  }

  // called when an event is tracked
  track({ event, anonymousId, userId, properties, context }) {
    /* istanbul ignore next */
    logOutput({
      event,
      anonymousId,
      userId,
      properties,
      context,
    });
  }
}
