import React from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import gql from 'graphql-tag';
import { Query } from '@apollo/client/react/components';

import { BackgroundView, H2, styled } from '@apollosproject/ui-kit';
import {
  FeaturesFeedConnected,
  FEATURE_FEED_ACTION_MAP,
  RockAuthedWebBrowser,
} from '@apollosproject/ui-connected';

function handleOnPress({ action, ...props }) {
  if (FEATURE_FEED_ACTION_MAP[action]) {
    FEATURE_FEED_ACTION_MAP[action]({ action, ...props });
  }
  // If you add additional actions, you can handle them here.
  // Or add them to the FEATURE_FEED_ACTION_MAP, with the syntax
  // { [ActionName]: function({ relatedNode, action, ...FeatureFeedConnectedProps}) }
}

// getHomeFeed uses the HOME_FEATURES in the config.yml
// You can also hardcode an ID if you are confident it will never change
// Or use some other strategy to get a FeatureFeed.id
export const GET_WATCH_FEED = gql`
  query getWatchFeatureFeed {
    watchFeedFeatures {
      id
    }
  }
`;

const TabHeader = styled(({ theme }) => ({
  paddingLeft: theme.sizing.baseUnit,
  paddingTop: theme.sizing.baseUnit * 2,
}))(H2);

function Watch({ navigation }) {
  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundView>
          <SafeAreaView>
            <Query query={GET_WATCH_FEED}>
              {({ data }) => (
                <FeaturesFeedConnected
                  openUrl={openUrl}
                  navigation={navigation}
                  featureFeedId={data?.watchFeedFeatures?.id}
                  onPressActionItem={handleOnPress}
                  ListHeaderComponent={<TabHeader>Watch</TabHeader>}
                />
              )}
            </Query>
          </SafeAreaView>
        </BackgroundView>
      )}
    </RockAuthedWebBrowser>
  );
}

export default Watch;
