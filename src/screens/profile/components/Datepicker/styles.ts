import { TextStyle, ViewStyle } from 'react-native';
import { colors, spacing } from 'src/theme';


export const GAP: ViewStyle = {
  gap: 14,
  paddingHorizontal: 40,
  marginTop: -30,
  paddingBottom: 30
};

export const DATE_PICKER_CONTAINER: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  borderRadius: 12,
  borderColor: colors.greyDark_06,
  borderWidth: 1,
  padding: spacing[3],
  backgroundColor: colors.white,
};

export const TEXT_CENTER: TextStyle = {
  textAlign: 'center',
};

