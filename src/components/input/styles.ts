import { TextStyle, ViewStyle } from 'react-native';
import { colors, spacing, typography } from 'src/theme';

export const CONTAINER: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  borderRadius: 16,
  borderColor: colors.greyDark_06,
  borderWidth: 1,
  padding: 10,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors.white,
};

export const CTR_ERROR: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.red,
};

export const MR_3: ViewStyle = {
  marginRight: 10,
};

export const ML_3: ViewStyle = {
  marginLeft: spacing[3],
};

export const INPUT_CTR: ViewStyle = {
  flex: 1,
  justifyContent: 'center',

};

export const INPUT: TextStyle = {
  padding: 0,
  fontSize: 15,
  fontFamily: typography.primary,
  color: colors.textColor,
};

export const LABEL_CTR: ViewStyle = {
  marginBottom: spacing[3],
};

export const ERROR_CTR: ViewStyle = {
  marginTop: spacing[2],
  marginLeft: spacing[2],
};

export const ERROR: TextStyle = {
  lineHeight: 18,
};

export const DISABLE_AREA: ViewStyle = {
  position: 'absolute',
  zIndex: 2,
  height: '100%',
  width: '100%',
};
