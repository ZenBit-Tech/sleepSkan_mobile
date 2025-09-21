import { TextStyle, ViewStyle } from 'react-native'

import { colors, spacing } from 'src/theme'

export const TAB_BAR_CTR: ViewStyle = {
  height: 80,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors.greyDark,
  gap: 2,
}

export const TAB_BAR_INSIGHTS_CTR: ViewStyle = {
  marginLeft: 20,
}

export const TAB_CON: ViewStyle = {
  position: 'absolute',
  left: 2,
}

export const ACTIVE_TAB_BAR_CTR: ViewStyle = {
  padding: 6,
  backgroundColor: colors.grey,
  opacity: 0.8,
  borderRadius: 10,
}

export const TEXT: TextStyle = {
  textAlign: 'center',
  textTransform: 'capitalize',
}

export const ICON_CTR: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  height: 36,
  marginBottom: 2,
}

export const TEXT_CTR: ViewStyle = {
  marginLeft: spacing[1],
}
