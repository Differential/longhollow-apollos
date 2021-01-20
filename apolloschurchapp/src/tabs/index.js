import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { withTheme } from '@apollosproject/ui-kit';

import Connect from './connect';
import Home from './home';
import Discover from './discover';
import Watch from './watch';
import Pray from './pray';
import tabBarIcon from './tabBarIcon';

const { Navigator, Screen } = createBottomTabNavigator();

const TabNavigator = (props) => (
  <Navigator {...props} lazy>
    <Screen
      name="Home"
      component={Home}
      options={{ tabBarIcon: tabBarIcon('home') }}
    />
    <Screen
      name="Read"
      component={Discover}
      options={{ tabBarIcon: tabBarIcon('discover') }}
    />
    <Screen
      name="Watch"
      component={Watch}
      options={{ tabBarIcon: tabBarIcon('video') }}
    />
    <Screen
      name="Pray"
      component={Pray}
      options={{ tabBarIcon: tabBarIcon('heart') }}
    />
    <Screen
      name="Connect"
      component={Connect}
      options={{ tabBarIcon: tabBarIcon('connect') }}
    />
  </Navigator>
);

const ThemedTabNavigator = withTheme(({ theme }) => ({
  tabBarOptions: {
    activeTintColor: theme?.colors?.secondary,
    inactiveTintColor: theme?.colors?.text?.tertiary,
    style: {
      backgroundColor: theme?.colors?.background?.paper,
      borderTopColor: theme?.colors?.shadows.default,
      ...Platform.select(theme?.shadows.default),
    },
  },
}))(TabNavigator);

export default ThemedTabNavigator;
