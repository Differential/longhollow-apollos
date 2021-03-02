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
      opacity="0.2"
      d="M11.3087 23.5616L4.4343 23.5625V12.637C4.4343 12.5238 4.45795 12.4119 4.50374 12.3083C4.54953 12.2048 4.61644 12.112 4.7002 12.0359L13.4496 4.08049C13.5992 3.9445 13.794 3.86915 13.9962 3.86914C14.1983 3.86913 14.3932 3.94447 14.5428 4.08045L23.2934 12.0359C23.3771 12.112 23.444 12.2048 23.4898 12.3083C23.5356 12.4119 23.5593 12.5238 23.5593 12.637V23.5625L16.6837 23.5616V16.6241V16.5616H16.6212H11.3712H11.3087V16.6241V23.5616Z"
      fill={fill}
      stroke={fill}
      strokeWidth="0.125"
    />
    <Path
      d="M23.6218 23.625V12.637C23.6218 12.5151 23.5963 12.3946 23.547 12.2831C23.4977 12.1716 23.4256 12.0716 23.3354 11.9896L14.5848 4.0342C14.4237 3.88777 14.2139 3.80663 13.9962 3.80664C13.7785 3.80665 13.5686 3.8878 13.4076 4.03424L4.65815 11.9896C4.56796 12.0716 4.49589 12.1716 4.44658 12.2831C4.39727 12.3945 4.3718 12.5151 4.3718 12.637V23.625"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M1.7468 23.625H26.2468"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16.6212 23.6241V16.6241H11.3712V23.6241"
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
