import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg viewBox="0 0 26 26" width={26} height={26} fill="none" {...props}>
      <Path
        fill={props.color}
        stroke={props.color}
        stroke-width={1}
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M13 25L0.999999 13M0.999999 13L13 1M0.999999 13L25 13"
      />
    </Svg>
  );
}
export default React.memo(SvgComponent);
