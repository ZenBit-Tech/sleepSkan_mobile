import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
import { colors } from 'src/theme';

function SvgComponent(props: SvgProps) {
  return (
    <Svg viewBox="0 0 28 21" width={28} height={21} fill={colors.white} {...props}>
      <Path
        fill={props.color}
        fill-rule="evenodd"
        clip-rule="evenodd"

        d="M25.6666 0.000488281H2.33341C1.04459 0.000488281 0 0.783899 0 1.75061V19.2504C0 20.217 1.04459 21.0005 2.33341 21.0005H25.6666C26.9554 21.0005 28 20.217 28 19.2504V1.75061C28 0.783899 26.9554 0.000488281 25.6666 0.000488281ZM19.9265 7.8704H16.3558L16.9797 5.07473L16.4005 4.98655L15.8208 4.89767L14.8669 7.8704H8.07352L6.53401 4.51109C8.71423 3.52563 11.2687 2.95788 14.0004 2.95788C16.7317 2.95788 19.2857 3.52563 21.466 4.51109L19.9265 7.8704Z"
      />
    </Svg>
  );
}
export default React.memo(SvgComponent);
