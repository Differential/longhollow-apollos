import React from 'react';
import { H2, PaddedView } from '@apollosproject/ui-kit';
import Metadata from '../ui/Metadata';
/* Export your custom prop overrides here. */

export default {
  'ui-kit.DefaultCard': {
    labelText: '',
  },
  'ui-kit.FeaturedCard': {
    labelText: '',
  },
  'ui-prayer.Onboarding': {
    title: 'How can we pray for you?',
    body:
      'Members of our church family come together to pray for our community every day. If you would like us to pray for you today, tap the button below to share your prayer request. Your request will be shared on this app for 24 hours.',
  },
  'ui-prayer.AddPrayerScreenConnected': {
    title: 'How can we pray for you today?',
    skipText: 'Nevermind',
    primaryButtonText: 'Share my request',
  },
  'ui-prayer.Confirmation': {
    title: 'Thanks for sharing!',
    body:
      'We’ll share your prayer request with other users of this app for the next 24 hours.\n\nFeel free to submit prayer requests as often as you have them.',
  },
  'ui-connected.SuggestedFollowListConnected': { Component: () => () => null },
  // same as core, but with the Metadata component
  'ui-connected.ContentNodeConnected': {
    HeaderComponent: () => ({ isLoading, node }) => (
      <PaddedView vertical={false}>
        <H2 padded isLoading={isLoading}>
          {node?.title}
        </H2>
        <Metadata node={node} />
      </PaddedView>
    ),
  },
};
