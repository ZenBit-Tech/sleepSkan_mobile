import { ViewStyle } from 'react-native'

import { colors, spacing } from 'src/theme'

export const CONTAINER: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  width: '80%',
  borderRadius: 8,
  backgroundColor: colors.greenLight,
  paddingLeft: spacing[1],
}

export const MAIN: ViewStyle = {
  flex: 1,
  borderRadius: 8,
  backgroundColor: colors.white,
  paddingVertical: spacing[3],
  paddingRight: spacing[3],
  paddingLeft: spacing[5],
}

export const CTR_ERROR: ViewStyle = {
  borderColor: colors.redLight,
  backgroundColor: colors.red,
}
