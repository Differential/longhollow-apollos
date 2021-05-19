import React from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

import { styled, withTheme, Touchable, Icon } from '@apollosproject/ui-kit';

const SearchIcon = withTheme(({ theme: { colors, sizing: { baseUnit } } }) => ({
  name: 'search',
  size: baseUnit * 2,
  fill: colors.primary,
}))(Icon);

const SearchButtonContainer = styled(({ theme: { sizing: { baseUnit } } }) => ({
  position: 'absolute',
  right: baseUnit,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))(Animated.View);

const HomeSearchButton = ({ onPress }) => (
  <SearchButtonContainer>
    <Touchable onPress={onPress}>
      <SearchIcon />
    </Touchable>
  </SearchButtonContainer>
);

HomeSearchButton.propTypes = {
  onPress: PropTypes.func,
};

export default HomeSearchButton;
