import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgComponent(props: SvgProps) {
  return (
    <Svg viewBox="0 0 9 7" width={9} height={7} fill="none" {...props}>
      <Path
        fill={props.color}
        d="M3.087 6.514 0 3.426l.772-.772L3.087 4.97 8.057 0l.772.772-5.742 5.742Z"
      />
    </Svg>
  )
}
export default React.memo(SvgComponent)
