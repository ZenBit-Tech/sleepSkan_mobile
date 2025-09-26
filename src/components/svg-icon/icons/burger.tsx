import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { colors } from 'src/theme';

function SvgComponent(props: SvgProps) {
  return (
    <Svg viewBox="0 0 50 50" width={50} height={50} fill='none' {...props}>
      <Path
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap='round'
        d="M8.33398 37.5H41.6673"
      />
      <Path
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap='round'
        d="M8.33398 25H41.6673"
      />
      <Path
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap='round'
        d="M8.33398 12.5H41.6673"
      />
    </Svg>
  );
}
export default React.memo(SvgComponent);
