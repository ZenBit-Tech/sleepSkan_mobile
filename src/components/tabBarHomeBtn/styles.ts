import { ViewStyle } from 'react-native'

import { colors } from 'src/theme'

export const CIRCLE_CTR: ViewStyle = {
  bottom: 15,
  alignSelf: 'center',
}

export const GRADIENT_CTR: ViewStyle = {
  width: 65,
  height: 65,
  borderRadius: 65,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 4,
  borderColor: colors.greyDark,
}
