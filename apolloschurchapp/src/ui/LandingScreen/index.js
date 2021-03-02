import React from 'react';
import { StyleSheet } from 'react-native';
import { styled, ConnectedImage } from '@apollosproject/ui-kit';

import LandingScreen from './LandingScreen';

const FullScreenImage = styled({
  resizeMode: 'cover',
  ...StyleSheet.absoluteFill,
})(ConnectedImage);

const LandingScreenSlide = ({ navigation }) => (
  <LandingScreen
    slideTitle={'Welcome to Long Hollow!'}
    description={
      'We’re a church that exists to invite each other into a growing relationship with Jesus.'
    }
    onPressPrimary={() => navigation.push('Auth')}
    textColor={'white'}
    BackgroundComponent={
      <FullScreenImage source={'https://picsum.photos/375/812/?random'} />
    }
    primaryNavText={"Let's get started"}
  />
);

export default LandingScreenSlide;
