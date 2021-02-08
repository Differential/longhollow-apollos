import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size, fill } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 26 22" fill="none">
    <Path
      d="M13 4.625C13 3.69674 13.3687 2.8065 14.0251 2.15013C14.6815 1.49375 15.5717 1.125 16.5 1.125H23.5C23.7321 1.125 23.9546 1.21719 24.1187 1.38128C24.2828 1.54538 24.375 1.76794 24.375 2V16C24.375 16.2321 24.2828 16.4546 24.1187 16.6187C23.9546 16.7828 23.7321 16.875 23.5 16.875H16.5C15.5717 16.875 14.6815 17.2437 14.0251 17.9001C13.3687 18.5565 13 19.4467 13 20.375"
      stroke={fill}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M1.625 16C1.625 16.2321 1.71719 16.4546 1.88128 16.6187C2.04538 16.7828 2.26794 16.875 2.5 16.875H9.5C10.4283 16.875 11.3185 17.2437 11.9749 17.9001C12.6313 18.5565 13 19.4467 13 20.375V4.625C13 3.69674 12.6313 2.8065 11.9749 2.15013C11.3185 1.49375 10.4283 1.125 9.5 1.125H2.5C2.26794 1.125 2.04538 1.21719 1.88128 1.38128C1.71719 1.54538 1.625 1.76794 1.625 2V16Z"
      stroke={fill}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
