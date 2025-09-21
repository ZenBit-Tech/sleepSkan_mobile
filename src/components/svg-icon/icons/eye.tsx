import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

import { colors } from 'src/theme'

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        fill={colors.greyDark}
        d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20c4.182 0 7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4 7.818 4 4.972 6.5 3.275 8.704 2.425 9.81 2 10.361 2 12Z"
        opacity={0.5}
      />
      <Path
        fill={colors.greyDark}
        fillRule="evenodd"
        d="M8.25 12a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Zm1.5 0a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z"
        clipRule="evenodd"
      />
    </Svg>
  )
}
export default React.memo(SvgComponent)
