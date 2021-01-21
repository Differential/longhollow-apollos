import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const Icon = makeIcon(({ size, fill } = {}) => (
  <Svg width={size} height={size} viewBox="0 0 27 27" fill="none">
    <Path
      opacity="0.2"
      d="M13.5 25.5C20.1274 25.5 25.5 20.1274 25.5 13.5C25.5 6.87258 20.1274 1.5 13.5 1.5C6.87258 1.5 1.5 6.87258 1.5 13.5C1.5 20.1274 6.87258 25.5 13.5 25.5Z"
      fill={fill}
    />
    <Path
      d="M13.5 25.5C20.1274 25.5 25.5 20.1274 25.5 13.5C25.5 6.87258 20.1274 1.5 13.5 1.5C6.87258 1.5 1.5 6.87258 1.5 13.5C1.5 20.1274 6.87258 25.5 13.5 25.5Z"
      stroke={fill}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M13.5 21.5C14.3284 21.5 15 20.8284 15 20C15 19.1716 14.3284 18.5 13.5 18.5C12.6716 18.5 12 19.1716 12 20C12 20.8284 12.6716 21.5 13.5 21.5Z"
      fill={fill}
    />
    <Path
      d="M13.5 16.5V15.5C14.2911 15.5 15.0645 15.2654 15.7223 14.8259C16.3801 14.3864 16.8928 13.7616 17.1955 13.0307C17.4983 12.2998 17.5775 11.4956 17.4231 10.7196C17.2688 9.94372 16.8878 9.23098 16.3284 8.67157C15.769 8.11216 15.0563 7.7312 14.2804 7.57686C13.5044 7.42252 12.7002 7.50173 11.9693 7.80448C11.2384 8.10723 10.6136 8.61993 10.1741 9.27772C9.7346 9.93552 9.5 10.7089 9.5 11.5"
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
