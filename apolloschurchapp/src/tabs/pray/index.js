import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { withTheme } from '@apollosproject/ui-kit';

import ContentFeed from '../../content-feed';

import Pray from './Pray';

const { Navigator, Screen } = createNativeStackNavigator();

const PrayNavigator = (props) => (
  <Navigator initialRouteName="Pray" {...props}>
    <Screen component={Pray} name="Pray" options={{ headerShown: false }} />
    <Screen
      component={ContentFeed}
      name="ContentFeed"
      /** Function for React Navigation to set information in the header. */
      options={({ route }) => ({
        title: route.params.itemTitle || 'Content Feed',
      })}
    />
  </Navigator>
);
const EnhancedPray = withTheme(({ theme, ...props }) => ({
  ...props,
  screenOptions: {
    headerTintColor: theme.colors.action.secondary,
    headerTitleStyle: {
      color: theme.colors.text.primary,
    },
    headerStyle: {
      backgroundColor: theme.colors.background.paper,
      ...Platform.select(theme.shadows.default),
    },
    headerLargeTitle: true,
  },
}))(PrayNavigator);

export default EnhancedPray;
