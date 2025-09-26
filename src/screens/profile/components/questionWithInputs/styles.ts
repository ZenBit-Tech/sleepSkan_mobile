import { TextStyle, ViewStyle } from 'react-native';
import { colors } from 'src/theme';


export const GAP: ViewStyle = {
  gap: 14,
  paddingHorizontal: 22
};

export const BTNS_CTR: ViewStyle = {
 gap: 14,
 width: 294,
 height: 114,
 alignSelf: 'center',
};

export const TEXT_CENTER: TextStyle = {
  textAlign: 'center',
};
export const ERROR_TEXT: TextStyle = {
  position: 'absolute',
  top: 105,
  left: 10,
  color: colors.red
};

export const ERROR_INPUT: ViewStyle = {
  borderColor: colors.red, 
  borderWidth: 2
}