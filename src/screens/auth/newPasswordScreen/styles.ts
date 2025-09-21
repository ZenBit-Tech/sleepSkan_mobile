import { ViewStyle } from 'react-native'

import { colors, spacing } from 'src/theme'

export const CONTAINER: ViewStyle = {
  backgroundColor: colors.blue,
  flex: 1,
}

export const LAYOUT_CTR: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-end',
}

export const LAYOUT: ViewStyle = {
  flex: 1,
  paddingTop: spacing[6],
  paddingHorizontal: spacing[5],
}

export const MAIN: ViewStyle = {
  marginTop: spacing[2],
  gap: 20,
}

export const BACK_CTR: ViewStyle = {
  marginVertical: spacing[4],
  marginLeft: spacing[5],
}
