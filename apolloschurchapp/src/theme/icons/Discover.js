import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size, fill } = {}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/Svg"
  >
    <Path
      d="M14 9.625C14 8.69674 14.3687 7.8065 15.0251 7.15013C15.6815 6.49375 16.5717 6.125 17.5 6.125H24.5C24.7321 6.125 24.9546 6.21719 25.1187 6.38128C25.2828 6.54538 25.375 6.76794 25.375 7V21C25.375 21.2321 25.2828 21.4546 25.1187 21.6187C24.9546 21.7828 24.7321 21.875 24.5 21.875H17.5C16.5717 21.875 15.6815 22.2437 15.0251 22.9001C14.3687 23.5565 14 24.4467 14 25.375"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.625 21C2.625 21.2321 2.71719 21.4546 2.88128 21.6187C3.04538 21.7828 3.26794 21.875 3.5 21.875H10.5C11.4283 21.875 12.3185 22.2437 12.9749 22.9001C13.6313 23.5565 14 24.4467 14 25.375V9.625C14 8.69674 13.6313 7.8065 12.9749 7.15013C12.3185 6.49375 11.4283 6.125 10.5 6.125H3.5C3.26794 6.125 3.04538 6.21719 2.88128 6.38128C2.71719 6.54538 2.625 6.76794 2.625 7V21Z"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
));

Icon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default Icon;
