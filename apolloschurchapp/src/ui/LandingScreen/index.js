import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { styled } from '@apollosproject/ui-kit';

import LandingScreen from './LandingScreen';

const FullScreenImage = styled({
  resizeMode: 'cover',
  ...StyleSheet.absoluteFill,
  width: '100%',
  height: '100%',
})(Image);

const LandingScreenSlide = ({ navigation }) => (
  <LandingScreen
    slideTitle={'Welcome to Long Hollow!'}
    description={
      'We’re a church that exists to invite each other into a growing relationship with Jesus.'
    }
    onPressPrimary={() => navigation.push('Auth')}
    textColor={'white'}
    BackgroundComponent={<FullScreenImage source={require('./landing.jpg')} />}
    primaryNavText={"Let's get started"}
  />
);

export default LandingScreenSlide;
