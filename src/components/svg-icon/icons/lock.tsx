import * as React from 'react'
import Svg, { SvgProps, Path } from 'react-native-svg'

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        fill={props.color}
        d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16Z"
        opacity={0.5}
      />
      <Path
        fill={props.color}
        d="M8 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM17 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a5.25 5.25 0 0 1 10.5 0v2.004c.567.005 1.064.018 1.5.05V8a6.75 6.75 0 0 0-13.5 0v2.055a23.57 23.57 0 0 1 1.5-.051V8Z"
      />
    </Svg>
  )
}
export default React.memo(SvgComponent)
