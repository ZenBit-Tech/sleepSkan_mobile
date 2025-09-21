import { ViewStyle, TextStyle } from 'react-native';

import { colors, typography } from 'src/theme';

const BASE_VIEW: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10,
  backgroundColor: colors.primary,
};

const BASE_TEXT: TextStyle = {
  color: colors.white,
  fontSize: 15,
  lineHeight: 18,
  textAlign: 'center',
  fontFamily: typography.primaryBold,
};

export const viewPresets: {
  primary: ViewStyle
  secondary: ViewStyle
  tertiary: ViewStyle
  transparent: ViewStyle
} = {
  primary: {
    ...BASE_VIEW,
  },
  secondary: {
    ...BASE_VIEW,
    borderColor: colors.white,
    borderWidth: 1,
  },
  tertiary: {
    ...BASE_VIEW,
  },
  transparent: {
    ...BASE_VIEW,
    borderColor: colors.white,
    backgroundColor: colors.primary09,
    borderWidth: 1,
  },
};

export const colorsPresets: {
  primary: string[]
  secondary: string[]
  tertiary: string[]
  transparent: string[]
} = {
  primary: [colors.primary, colors.primary],
  secondary: [colors.greenLight, colors.greenDark],
  tertiary: [colors.blueDark, colors.blueLight],
  transparent: [colors.transparent, colors.transparent],
};

export const bgPresets: {
  primary: string
  secondary: string
  tertiary: string
  transparent: string
} = {
  primary: colors.primary,
  secondary: colors.secondary,
  tertiary: colors.black,
  transparent: colors.transparent,
};

export const textPresets: {
  primary: TextStyle
  secondary: TextStyle
  tertiary: TextStyle
  transparent: TextStyle
} = {
  primary: { ...BASE_TEXT },
  secondary: { ...BASE_TEXT },
  tertiary: { ...BASE_TEXT },
  transparent: { ...BASE_TEXT },
};

export type ButtonPresetNames = keyof typeof viewPresets
