import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { colors } from 'src/theme';

function SvgComponent(props: SvgProps) {
  return (
    <Svg viewBox="0 0 14 14" width={14} height={14} fill={colors.white} {...props}>
      <Path
        stroke={colors.white}
        strokeWidth={1}
        fill='none'
        opacity={0.7}
        strokeLinecap='round'
        strokeLinejoin='round'
        d="M7 9.5V7M7 4.5H7.00625M13.25 7C13.25 10.4518 10.4518 13.25 7 13.25C3.54822 13.25 0.75 10.4518 0.75 7C0.75 3.54822 3.54822 0.75 7 0.75C10.4518 0.75 13.25 3.54822 13.25 7Z"
      />
    </Svg>
  );
}
export default React.memo(SvgComponent);
