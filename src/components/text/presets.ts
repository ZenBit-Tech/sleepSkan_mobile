import { TextStyle } from 'react-native';

import { colors, typography } from 'src/theme';

const BASE: TextStyle = {
  fontSize: 16,
  letterSpacing: 0,
  lineHeight: 20,
  color: colors.white,
  fontFamily: typography.primary,
};

const BASE_BOLD: TextStyle = {
  ...BASE,
  color: colors.white,
  fontFamily: typography.primaryBold,
};

export const presets: {
  default: TextStyle
  defaultBlack: TextStyle
  incredibleBig: TextStyle
  incredibleBigBold: TextStyle
  extraBig: TextStyle
  extraBigBold: TextStyle
  megaBig: TextStyle
  superBig: TextStyle
  bold: TextStyle
  great: TextStyle
  greatBold: TextStyle
  big: TextStyle
  bigBold: TextStyle
  largeBold: TextStyle
  large: TextStyle
  middleBold: TextStyle
  middle: TextStyle
  header: TextStyle
  headerBold: TextStyle
  header2: TextStyle
  header2bold: TextStyle
  header3: TextStyle
  header3bold: TextStyle
  header4: TextStyle
  header4bold: TextStyle
  header5: TextStyle
  header5bold: TextStyle
  small: TextStyle
  smallBold: TextStyle
  smallest: TextStyle
  smallestBold: TextStyle
  superSmall: TextStyle
} = {
  default: BASE,
  defaultBlack: { ...BASE, color: colors.black },
  bold: { ...BASE_BOLD },
  incredibleBig: {
    ...BASE,
    fontSize: 64,
    lineHeight: 72,
  },
  incredibleBigBold: {
    ...BASE_BOLD,
    fontSize: 64,
    lineHeight: 72,
  },
  megaBig: {
    ...BASE,
    fontSize: 56,
    lineHeight: 72,
  },
  extraBig: {
    ...BASE,
    fontSize: 48,
    lineHeight: 57,
  },
  extraBigBold: {
    ...BASE_BOLD,
    fontSize: 48,
    lineHeight: 57,
  },
  superBig: {
    ...BASE_BOLD,
    fontSize: 40,
    lineHeight: 56,
  },
  greatBold: { ...BASE_BOLD, fontSize: 36, lineHeight: 50 },
  great: { ...BASE, fontSize: 36, lineHeight: 50 },
  big: { ...BASE, fontSize: 32, lineHeight: 38 },
  bigBold: { ...BASE_BOLD, fontSize: 32, lineHeight: 38 },
  largeBold: { ...BASE_BOLD, fontSize: 24, lineHeight: 34 },
  large: { ...BASE, fontSize: 24, lineHeight: 34 },
  middleBold: { ...BASE_BOLD, fontSize: 22, lineHeight: 34 },
  middle: { ...BASE, fontSize: 22, lineHeight: 34 },
  headerBold: { ...BASE_BOLD, fontSize: 20, lineHeight: 26 },
  header: { ...BASE, fontSize: 20, lineHeight: 26 },
  header2: { ...BASE, fontSize: 19 },
  header2bold: {
    ...BASE_BOLD,
    fontSize: 19,
  },
  header3: {
    ...BASE,
    fontSize: 18,
    lineHeight: 28,
  },
  header3bold: {
    ...BASE_BOLD,
    fontSize: 18,
    lineHeight: 28,
  },
  header4: {
    ...BASE,
    fontSize: 15,
    lineHeight: 24,
  },
  header4bold: {
    ...BASE_BOLD,
    fontSize: 15,
    lineHeight: 24,
  },
  header5: {
    ...BASE,
    fontSize: 14,
    lineHeight: 18,
  },
  header5bold: {
    ...BASE_BOLD,
    fontSize: 14,
    lineHeight: 18,
  },
  small: {
    ...BASE,
    fontSize: 12,
    lineHeight: 16,
  },
  smallBold: {
    ...BASE_BOLD,
    fontSize: 12,
    lineHeight: 16,
  },
  smallest: {
    ...BASE,
    fontSize: 10,
    lineHeight: 14,
  },
  smallestBold: {
    ...BASE_BOLD,
    fontSize: 10,
    lineHeight: 14,
  },
  superSmall: {
    ...BASE,
    fontSize: 7,
    lineHeight: 7,
  },
};

export type TextPresets = keyof typeof presets
