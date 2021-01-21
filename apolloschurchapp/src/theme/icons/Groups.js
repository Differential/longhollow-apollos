import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size, fill } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 31 21" fill="none">
    <Path
      opacity="0.2"
      d="M10.5 14.5C14.0899 14.5 17 11.5899 17 8C17 4.41015 14.0899 1.5 10.5 1.5C6.91015 1.5 4 4.41015 4 8C4 11.5899 6.91015 14.5 10.5 14.5Z"
      fill={fill}
    />
    <Path
      d="M10.5 14.5C14.0899 14.5 17 11.5899 17 8C17 4.41015 14.0899 1.5 10.5 1.5C6.91015 1.5 4 4.41015 4 8C4 11.5899 6.91015 14.5 10.5 14.5Z"
      stroke={fill}
      stroke-width="2"
      stroke-miterlimit="10"
    />
    <Path
      d="M18.9265 1.74215C19.8205 1.49026 20.7582 1.43287 21.6762 1.57386C22.5943 1.71486 23.4715 2.05095 24.2487 2.5595C25.026 3.06805 25.6852 3.73726 26.182 4.52205C26.6789 5.30683 27.0018 6.18898 27.129 7.10906C27.2562 8.02914 27.1847 8.9658 26.9194 9.85594C26.6541 10.7461 26.2012 11.569 25.5911 12.2694C24.981 12.9697 24.2278 13.5312 23.3825 13.916C22.5371 14.3008 21.619 14.4999 20.6902 14.5"
      stroke={fill}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M1.49951 19.1746C2.51468 17.7306 3.86238 16.552 5.42882 15.7384C6.99527 14.9248 8.73448 14.5001 10.4996 14.5C12.2648 14.4999 14.004 14.9246 15.5705 15.738C17.137 16.5515 18.4848 17.73 19.5001 19.1739"
      stroke={fill}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M20.6903 14.5C22.4556 14.4987 24.1952 14.9228 25.7619 15.7364C27.3285 16.55 28.676 17.7291 29.6903 19.1739"
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
