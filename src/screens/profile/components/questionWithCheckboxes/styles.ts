import { TextStyle, ViewStyle } from 'react-native';
import { colors } from 'src/theme';


export const GAP: ViewStyle = {
  gap: 14,
};

export const BLOCK: ViewStyle = {
  borderColor: colors.white,
  borderWidth: 1,
  borderRadius: 10,
  padding: 10,
  backgroundColor: colors.primary04,
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
};

export const BLOCKS_CTR: ViewStyle = {
  gap: 10,
  width: '90%',
  alignSelf: 'center',
  marginTop: 25,
  marginBottom: 20
};

export const INACTIVE_BLOCK: ViewStyle = {
  backgroundColor: colors.inactive,
};

export const TEXT: TextStyle = {
  fontSize: 13,
  width: '90%',
};
export const TEXT_CENTER: TextStyle = {
  textAlign: 'center',
};
