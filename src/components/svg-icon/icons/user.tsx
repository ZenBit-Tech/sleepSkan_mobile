import * as React from 'react'
import Svg, { SvgProps, Circle, Ellipse } from 'react-native-svg'

function SvgComponent(props: SvgProps) {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} fill="none" {...props}>
      <Circle cx={12} cy={6.097} r={4} fill={props.color} />
      <Ellipse
        cx={12}
        cy={17.097}
        fill={props.color}
        opacity={0.5}
        rx={7}
        ry={4}
      />
    </Svg>
  )
}
export default React.memo(SvgComponent)
