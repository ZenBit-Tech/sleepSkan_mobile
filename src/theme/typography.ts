import { Platform } from 'react-native'

export const typography = {
  primary: Platform.select({
    ios: 'Manrope-Regular',
    android: 'Manrope-Regular',
  }),
  primaryBold: Platform.select({
    ios: 'Manrope-SemiBold',
    android: 'Manrope-SemiBold',
  }),
  link: Platform.select({
    ios: 'Manrope-Bold',
    android: 'Manrope-Bold',
  }),
  secondary: Platform.select({
    ios: 'Orbitron-SemiBold',
    android: 'Orbitron-SemiBold',
  }),
}
