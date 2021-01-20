import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size, fill, ...otherProps } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 24 22" fill="none">
    <Path
      d="M12 20.625C12 20.625 1.0625 14.5 1.0625 7.06251C1.06272 5.74797 1.51821 4.47408 2.35153 3.45742C3.18485 2.44076 4.34456 1.74409 5.63349 1.48585C6.92241 1.22761 8.261 1.42375 9.42165 2.04092C10.5823 2.65809 11.4934 3.65818 12 4.87118L12 4.87119C12.5066 3.65819 13.4177 2.65809 14.5783 2.04092C15.739 1.42376 17.0776 1.22762 18.3665 1.48585C19.6554 1.74409 20.8151 2.44076 21.6485 3.45742C22.4818 4.47407 22.9373 5.74797 22.9375 7.06251C22.9375 14.5 12 20.625 12 20.625Z"
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
