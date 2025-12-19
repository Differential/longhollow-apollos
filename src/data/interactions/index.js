import { Interactions } from 'apollos/data-connector-rock';
import gql from 'graphql-tag';

export class dataSource extends Interactions.dataSource {
  async createPageViewInteraction({ pageTitle, pageUrl }) {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;

    const interactionComponent = await RockConstants.createOrFindInteractionComponent(
      {
        componentName: pageTitle,
        channelId: 3, // ExternalWebsite
        entityId: null,
      }
    );

    const currentUser = await Auth.getCurrentPerson();

    await this.post('/Interactions', {
      PersonAliasId: currentUser.primaryAliasId,
      InteractionComponentId: interactionComponent.id,
      Operation: 'View',
      InteractionDateTime: new Date().toJSON(),
      InteractionSummary: pageTitle,
      InteractionData: pageUrl,
      // We can introduce the session variable if the client asks for it.
      // I ran into some problems with stale sessions causing this request to fail
      // So I figured it would be better to default this to off.
      // InteractionSessionId: this.context.sessionId,
    });

    return {
      success: true,
    };
  }
}

export const schema = gql`
  ${Interactions.schema}

  extend type Mutation {
    trackPageView(pageUrl: String!, pageTitle: String!): InteractionResult
  }
`;

export const resolver = {
  ...Interactions.resolver,
  Mutation: {
    ...Interactions.resolver.Mutation,
    trackPageView: (root, args, { dataSources }) =>
      dataSources.Interactions.createPageViewInteraction(args),
  },
};
