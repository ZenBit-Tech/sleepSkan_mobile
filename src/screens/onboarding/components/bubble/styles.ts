import { ViewStyle } from "react-native";
import { colors } from "src/theme";

const TAIL_HALF = 12;   
const TAIL_HEIGHT = 24; 

export const WRAP: ViewStyle = { 
  position: 'relative', 
  alignSelf: 'center' 
}

export const BOX: ViewStyle = {
  paddingVertical: 11,
  paddingHorizontal: 12,
  borderRadius: 10,
  backgroundColor: colors.primary03,
}

export const TAIL: ViewStyle =  {
  position: 'absolute',
  bottom: -TAIL_HEIGHT,              
  left: '50%',
  transform: [{ translateX: -TAIL_HALF }],
  width: 0,
  height: 0,
  borderLeftWidth: TAIL_HALF,
  borderRightWidth: TAIL_HALF,
  borderTopWidth: TAIL_HEIGHT,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderTopColor: colors.primary03,
}