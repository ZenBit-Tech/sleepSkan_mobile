import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { colors } from 'src/theme';

function SvgComponent(props: SvgProps) {
  return (
    <Svg viewBox="0 0 15 24" width={15} height={24} fill={colors.white} {...props}>
      <Path
        fill={props.color}
        fill-rule="evenodd"
        clip-rule="evenodd"

        d="M1.53488 0H13.9534V2.66667H1.53488V0ZM12.9185 4H2.56976C1.43139 4 0.5 5.2 0.5 6.66667V21.3333C0.5 22.8 1.43139 24 2.56976 24H12.9185C14.0569 24 14.9883 22.8 14.9883 21.3333V6.66667C14.9883 5.2 14.0569 4 12.9185 4ZM11.8837 16H9.29646V19.3333H6.19183V16H3.60463V12H6.19183V8.66667H9.29646V12H11.8837V16Z"
      />
    </Svg>
  );
}
export default React.memo(SvgComponent);
