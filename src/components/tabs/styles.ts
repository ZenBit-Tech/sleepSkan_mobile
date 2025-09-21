import { TextStyle, ViewStyle } from 'react-native'

import { colors } from 'src/theme'

export const CONTAINER: ViewStyle = {
  width: '100%',
  height: 32,
  flexDirection: 'row',
  backgroundColor: colors.greyDark,
  borderRadius: 24,
}

export const TAB_CTR: ViewStyle = {
  height: 32,
  justifyContent: 'center',
  alignItems: 'center',
}

export const ACTIVE_CTR: ViewStyle = {
  position: 'absolute',
  zIndex: -1,
  width: '50%',
  height: '100%',
}

export const GRADIENT_CTR: ViewStyle = {
  width: '100%',
  height: '100%',
  borderRadius: 24,
}

export const TEXT_CENTER: TextStyle = {
  textAlign: 'center',
  textTransform: 'capitalize',
}
