import * as React from 'react'
import Svg, { Path, SvgProps } from 'react-native-svg'

import { colors } from 'src/theme'

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={20} height={19} viewBox="0 0 20 19">
      <Path
        fill={props.color}
        d="M15.25 7.137v.548c0 .657.187 1.3.538 1.847l.862 1.34c.787 1.224.186 2.887-1.182 3.274a20.06 20.06 0 0 1-10.935 0c-1.369-.387-1.97-2.05-1.183-3.274l.862-1.34c.351-.547.539-1.19.539-1.847v-.548C4.75 4.13 7.1 1.693 10 1.693c2.9 0 5.25 2.437 5.25 5.444Z"
        opacity={0.5}
      />
      <Path
        fill={props.color}
        d="M10.583 4.804a.583.583 0 0 0-1.166 0v3.111a.583.583 0 1 0 1.166 0V4.804Z"
      />
      <Path
        fill={colors.dark}
        d="M6.3 14.561a3.89 3.89 0 0 0 7.4 0c-2.447.46-4.953.46-7.4 0Z"
      />
    </Svg>
  )
}
export default React.memo(SvgComponent)
